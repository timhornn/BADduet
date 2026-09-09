import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Имитация входа/регистрации
    const userData = {
      email: email || phone,
      role,
    };
    
    login(userData);
    
    // Перенаправление на главную
    window.location.href = '/';
  };

  return (
    <div style={{ 
      marginLeft: '250px', 
      padding: '3rem 2rem',
      minHeight: '100vh',
      background: '#f5f6fa',
    }}>
      <div style={{ 
        maxWidth: '450px', 
        margin: '0 auto',
        background: 'white',
        padding: '2.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#2c3e50' }}>
          {isLogin ? 'Вход' : 'Регистрация'}
        </h1>
        <p style={{ textAlign: 'center', color: '#7f8c8d', marginBottom: '2rem' }}>
          {isLogin ? 'С возвращением!' : 'Создайте аккаунт'}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Выберите роль:
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ flex: 1 }}>
                  <input
                    type="radio"
                    checked={role === 'patient'}
                    onChange={() => setRole('patient')}
                    style={{ marginRight: '0.5rem' }}
                  />
                  👤 Пациент
                </label>
                <label style={{ flex: 1 }}>
                  <input
                    type="radio"
                    checked={role === 'doctor'}
                    onChange={() => setRole('doctor')}
                    style={{ marginRight: '0.5rem' }}
                  />
                  🩺 Врач/нутрициолог
                </label>
              </div>
              {!isLogin && role === 'doctor' && (
                <div style={{
                  marginTop: '0.75rem',
                  padding: '0.75rem',
                  background: '#fff3cd',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  color: '#856404',
                }}>
                  ⚠️ Выбор роли "Врач/нутрициолог" означает, что вы подтверждаете наличие соответствующего образования. БАДдуэт предоставляет информацию справочного характера и не заменяет очную консультацию специалиста. Ответственность за интерпретацию результатов несет пользователь.
                </div>
              )}
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Email или телефон:
            </label>
            <input
              type="text"
              value={email || phone}
              onChange={(e) => {
                if (e.target.value.includes('@')) {
                  setEmail(e.target.value);
                  setPhone('');
                } else {
                  setPhone(e.target.value);
                  setEmail('');
                }
              }}
              placeholder="name@example.com или +7..."
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #ddd',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Пароль:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #ddd',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '1rem',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
            }}
          >
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none',
                border: 'none',
                color: '#3498db',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
