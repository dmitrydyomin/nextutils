import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export const useAsync = <A extends Array<any>, R>(
  f: (...args: A) => Promise<R>
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const mounted = useRef(true);

  const call = useCallback(
    async (...args: A) => {
      try {
        setLoading(true);
        setError(undefined);
        const res = await f(...args);
        return res;
      } catch (err: any) {
        if (mounted.current) {
          setError(err.message);
        }
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    },
    [f]
  );

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return { call, error, loading };
};

export const useAsyncData = <A extends [], R>(
  f: (...args: A) => Promise<R>,
  ...args: A
) => {
  const { call: refresh, error, loading } = useAsync(f);
  const [data, setData] = useState<R | undefined>();

  const argsStr = JSON.stringify(args);
  const argsMemo = useMemo<A>(() => JSON.parse(argsStr), [argsStr]);

  useEffect(() => {
    refresh(...argsMemo).then(setData);
  }, [argsMemo, refresh]);

  return { data, error, loading, call: refresh };
};
