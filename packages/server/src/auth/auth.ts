import { IncomingMessage, ServerResponse } from 'http';
import createHttpError from 'http-errors';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiHandler,
  PreviewData,
} from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getClientIp } from 'request-ip';
import { catchHttpError } from '../api/catchHttpError';
import { CookieSession } from './cookies';

export interface Session<U extends { id: string }> {
  data: U;
  sessionId: string;
}

export interface AuthProvider<U extends { id: string }, C extends {}> {
  createSession(userId: string, ip: string): Promise<string>;
  endSession(id: string): Promise<boolean>;
  findSession(id: string): Promise<Session<U> | null>;
  findUser(credentials: C): Promise<string | undefined>;
  formatUser(data: U): any;
  rateLimitter(ip: string): Promise<void>;
  validateCredentials(data: any): C & { remember: boolean };
}

export class Auth<U extends { id: string }, C extends {}> {
  constructor(
    private provider: AuthProvider<U, C>,
    private cookies: CookieSession
  ) {}

  async login(
    req: IncomingMessage,
    res: ServerResponse,
    credentials: C,
    remember: boolean
  ) {
    const userId = await this.provider.findUser(credentials);

    if (!userId) {
      return false;
    }

    const ip = getClientIp(req);
    if (!ip) {
      return false;
    }
    const sessionId = await this.provider.createSession(userId, ip);
    this.cookies.setSessionId(req, res, sessionId, remember);
    return true;
  }

  async logout(req: IncomingMessage, res: ServerResponse) {
    const sessionId = this.cookies.getSessionId(req, res);
    if (sessionId) {
      await this.provider.endSession(sessionId);
    }
    this.cookies.setSessionId(req, res, null, false);
  }

  async getUser(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<Session<U> | null> {
    const sessionId = this.cookies.getSessionId(req, res);
    if (!sessionId) {
      return null;
    }
    return await this.provider.findSession(sessionId);
  }

  gsspLoginRedirect = <
    P extends { [key: string]: any } = { [key: string]: any },
    Q extends ParsedUrlQuery = ParsedUrlQuery,
    D extends PreviewData = PreviewData
  >(
    handler?: (
      context: GetServerSidePropsContext<Q, D>,
      user: Session<U>
    ) => Promise<GetServerSidePropsResult<P>>
  ): GetServerSideProps<P, Q, D> => {
    return async (context) => {
      const user = await this.getUser(context.req, context.res);

      if (!user) {
        return {
          redirect: {
            statusCode: 302,
            destination: `/login${
              !context.req.url ||
              context.req.url === '/' ||
              context.req.url.endsWith('.json')
                ? ''
                : `?redirect=${encodeURIComponent(context.req.url)}`
            }`,
          },
        };
      }

      return handler ? handler(context, user) : { props: {} as P };
    };
  };

  getLoginHandler(): NextApiHandler {
    return async (req, res) => {
      try {
        switch (req.method) {
          case 'GET': {
            const data = await this.getUser(req, res);
            if (!data) {
              throw new createHttpError.Unauthorized();
            }
            return res.json(this.provider.formatUser(data.data));
          }
          case 'POST': {
            const ip = getClientIp(req);
            if (!ip) {
              throw new createHttpError.Forbidden();
            }

            try {
              await this.provider.rateLimitter(ip);
            } catch (err) {
              throw new createHttpError.TooManyRequests();
            }

            let value: C & { remember: boolean };
            try {
              value = this.provider.validateCredentials(req.body);
            } catch (err: any) {
              throw new createHttpError.BadRequest(err.message);
            }
            const success = await this.login(req, res, value, value.remember);
            if (!success) {
              throw new createHttpError.Forbidden('Invalid login or password');
            }
            return res.end();
          }
          case 'DELETE':
            await this.logout(req, res);
            return res.end();
          default:
            throw new createHttpError.MethodNotAllowed();
        }
      } catch (err) {
        return catchHttpError(err, res);
      }
    };
  }
}
