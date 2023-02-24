import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { checkResponseOK, getResponseMessage } from './errorMessage';

export const API_BASE_URL = '/api';

export const apiReq: typeof fetch = (url, ...args) =>
  fetch(`${API_BASE_URL}${url}`, ...args);

export const api = async <T = any>(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) => {
  const res = await fetch(
    typeof input === 'string' ? `${API_BASE_URL}${input}` : input,
    init
  );
  await checkResponseOK(res);
  const data: T = await res.json();
  return { ...res, data };
};

const fetcher = async (key: string | undefined) => {
  if (key === undefined) {
    return undefined;
  }
  const res = await apiReq(key);
  if (!res.ok) {
    const message = await res
      .json()
      .then((data) => data.message)
      .catch(() => undefined)
      .then((v) => v || res.statusText || `Ошибка ${res.status}`);
    throw new Error(message);
  }
  return res.json();
};

export function useAPI<T = any>(url: string | undefined) {
  return useSWR<T>(url, fetcher);
}

export function usePost<R = any, D = any>(
  url: string,
  options?: { method?: 'POST' | 'PUT' | 'DELETE'; skipErrors?: boolean }
) {
  const [refreshing, setRefreshing] = useState(false);
  const [result, setResult] = useState<R | undefined>();

  const send = useCallback(
    async (data: D): Promise<{ data?: R; res?: Response }> => {
      let res;
      try {
        setRefreshing(true);
        res = await fetch(url, {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
          method: options?.method || 'POST',
        });
        if (!res.ok && !options?.skipErrors) {
          throw new Error(
            `Ошибка: ${res.statusText} ${await getResponseMessage(res)}`
          );
        }
        const resData = await res.json();
        setResult(resData);
        return { data: resData, res };
      } catch (err: any) {
        toast.error(err.message);
        return { res };
      } finally {
        setRefreshing(false);
      }
    },
    [options?.method, options?.skipErrors, url]
  );

  return { refreshing, result, send };
}
