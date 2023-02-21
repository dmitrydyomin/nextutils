export const getResponseMessage = (res: Response): Promise<string> =>
  res
    .json()
    .then((data) => data.message)
    .catch(() => res.statusText || `Ошибка ${res.status}`);

export const checkResponseOK = async (res: Response) => {
  if (!res.ok) {
    const message = await getResponseMessage(res);
    throw new Error(message);
  }
};
