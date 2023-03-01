import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useSWRConfig } from 'swr';

import { apiReq, useAPI } from '../api/useAPI';
import { checkResponseOK } from '../api/errorMessage';
import type { LoginFormValues } from './LoginForm';

export interface UseAuthOptions {
  loginURL?: string;
  loggedInURL?: string;
}

export function useAuth<T extends {}>(options?: UseAuthOptions) {
  const { data: user, error, mutate } = useAPI<T | undefined>('/auth');
  const { mutate: mutateOther } = useSWRConfig();
  const { push, query } = useRouter();
  const redirect = query.redirect;

  const login = useCallback(
    async (data: LoginFormValues) => {
      const res = await apiReq('/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error(
          res.status === 403
            ? 'Неверное имя пользователя или пароль'
            : res.status === 429
            ? 'Слишком много попыток входа. Попробуйте позже'
            : res.statusText
        );
      }
      mutate();
      push(
        typeof redirect === 'string' ? redirect : options?.loggedInURL || '/'
      );
    },
    [mutate, push, redirect]
  );

  const logout = useCallback(async () => {
    try {
      const res = await apiReq('/auth', { method: 'DELETE' });
      await checkResponseOK(res);
      mutate();
      push(options?.loginURL || '/login');
    } catch (err: any) {
      toast.error(err.message);
    }
  }, [mutate, mutateOther, push]);

  return {
    login,
    logout,
    user: error ? undefined : user,
    refresh: mutate,
  };
}
