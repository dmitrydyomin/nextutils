'use client';

import { FormEventHandler, useCallback, useState } from 'react';

export interface LoginFormValues {
  username: string;
  password: string;
  remember: boolean;
}

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [submitting, setSubmitting] = useState(false);

  const [values, setValues] = useState<LoginFormValues>({
    username: '',
    password: '',
    remember: false,
  });

  const onFormSubmit = useCallback<FormEventHandler>(
    (e) => {
      e.preventDefault();
      setSubmitting(true);
      onSubmit(values).finally(() => {
        setSubmitting(false);
      });
    },
    [onSubmit, values]
  );

  return (
    <form className="space-y-6" onSubmit={onFormSubmit}>
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Имя пользователя
        </label>
        <div className="mt-1">
          <input
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            id="username"
            onChange={(e) =>
              setValues((v) => ({ ...v, username: e.target.value }))
            }
            required
            type="text"
            value={values.username}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Пароль
        </label>
        <div className="mt-1">
          <input
            autoComplete="current-password"
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            id="password"
            onChange={(e) =>
              setValues((v) => ({ ...v, password: e.target.value }))
            }
            required
            type="password"
            value={values.password}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            checked={values.remember}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            id="remember"
            onChange={(e) =>
              setValues((v) => ({ ...v, remember: e.target.checked }))
            }
            type="checkbox"
          />
          <label
            htmlFor="remember"
            className="ml-2 block text-sm text-gray-900"
          >
            Запомнить меня
          </label>
        </div>
      </div>

      <div>
        <button
          disabled={submitting}
          type="submit"
          className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Войти
        </button>
      </div>
    </form>
  );
};
