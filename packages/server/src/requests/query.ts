import type { NextParsedUrlQuery } from 'next/dist/server/request-meta';

export const getId = (q: NextParsedUrlQuery, prop = 'id') => {
  const v = q[prop];
  const id = typeof v === 'string' ? parseInt(v) : Number.NaN;
  return Number.isNaN(id) ? undefined : id;
};

export const getArgsId = (q: NextParsedUrlQuery, prop = 'args', index = 0) => {
  const v = q[prop];
  const id = Array.isArray(v) ? parseInt(v[index]) : Number.NaN;
  return Number.isNaN(id) ? undefined : id;
};
