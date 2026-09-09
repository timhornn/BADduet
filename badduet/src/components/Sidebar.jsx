import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: '🏠 Главная' },
    { path: '/check', label: '✅ Проверить совместимость' },
    ...(user ? [{ path: '/profile', label: '👤 Личный кабинет' }] : []),
    { path: '/about', label: 'ℹ️ О проекте' },
    { path: '/contacts', label: '📞 Контакты' },
  ];

  return (
    <aside className="sidebar" style={{
      width: '250px',
      background: '#2c3e50',
      color: 'white',
      padding: '1.5rem',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      overflowY: 'auto',
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>💊 БАДдуэт</h2>
        <p style={{ fontSize: '0.875rem', color: '#bdc3c7', margin: '0.5rem 0 0 0' }}>
          Проверка совместимости
        </p>
      </div>

      <nav>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'block',
              padding: '0.75rem 1rem',
              color: location.pathname === item.path ? '#3498db' : 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              marginBottom: '0.5rem',
              background: location.pathname === item.path ? '#34495e' : 'transparent',
            }}
            onMouseOver={(e) => e.target.style.background = location.pathname === item.path ? '#34495e' : '#34495e'}
            onMouseOut={(e) => e.target.style.background = location.pathname === item.path ? '#34495e' : 'transparent'}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {user && (
        <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #34495e' }}>
          <div style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
            👤 {user.email || user.phone}
            <div style={{ color: '#bdc3c7', fontSize: '0.75rem' }}>
              {user.role === 'doctor' ? 'Врач/нутрициолог' : 'Пациент'}
            </div>
          </div>
          
          <button
            onClick={logout}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            🚪 Выйти
          </button>
        </div>
      )}

      <div style={{ marginTop: '2rem', fontSize: '0.75rem', color: '#7f8c8d' }}>
        <p>БАДы месяца:</p>
        <div style={{ fontStyle: 'italic' }}>Загрузка...</div>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#7f8c8d' }}>
        <p>⚠️ Этим БАДам лучше не доверять:</p>
        <div style={{ fontStyle: 'italic' }}>Список обновляется</div>
      </div>
    </aside>
  );
}
