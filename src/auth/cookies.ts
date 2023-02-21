import Cookies from 'cookies';
import { IncomingMessage, ServerResponse } from 'http';

export interface CookieSessionConfig {
  cookieName: 'wr.f';
  keys: string[];
  maxAge: number;
}

export class CookieSession {
  constructor(private config: CookieSessionConfig) {}

  private initCookies(req: IncomingMessage, res: ServerResponse) {
    return new Cookies(req, res, { keys: this.config.keys });
  }

  setSessionId(
    req: IncomingMessage,
    res: ServerResponse,
    sessionId: number | null,
    remember: boolean
  ) {
    const { cookieName, maxAge } = this.config;
    const cookies = this.initCookies(req, res);
    if (sessionId === null) {
      cookies.set(cookieName);
    }
    cookies.set(cookieName, sessionId ? sessionId.toString() : null, {
      maxAge: remember ? maxAge : undefined,
      signed: true,
    });
  }

  getSessionId(req: IncomingMessage, res: ServerResponse) {
    const cookies = this.initCookies(req, res);
    const id = cookies.get(this.config.cookieName, { signed: true });
    const parsed = id ? parseInt(id) : Number.NaN;
    return Number.isNaN(parsed) ? null : parsed;
  }
}
