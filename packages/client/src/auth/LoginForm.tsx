import { FormEventHandler, useCallback, useState } from 'react';
import styles from './LoginForm.module.css';

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
    <form className={styles.container} onSubmit={onFormSubmit}>
      <div>
        <label htmlFor="username" className={styles.label}>
          Имя пользователя
        </label>
        <div className={styles.inputContainer}>
          <input
            className={styles.input}
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
        <label htmlFor="password" className={styles.label}>
          Пароль
        </label>
        <div className={styles.inputContainer}>
          <input
            autoComplete="current-password"
            className={styles.input}
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

      <div className={styles.row}>
        <div className={styles.rowItem}>
          <input
            checked={values.remember}
            className={styles.checkbox}
            id="remember"
            onChange={(e) =>
              setValues((v) => ({ ...v, remember: e.target.checked }))
            }
            type="checkbox"
          />{' '}
          <label htmlFor="remember" className={styles.checkboxLabel}>
            Запомнить меня
          </label>
        </div>
      </div>

      <div>
        <button disabled={submitting} type="submit" className={styles.submit}>
          Войти
        </button>
      </div>
    </form>
  );
};
