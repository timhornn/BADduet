import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AIChat from '../components/AIChat';

export default function ResultsPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [substances, setSubstances] = useState([]);
  const [userRole, setUserRole] = useState('patient');

  useEffect(() => {
    // Получаем данные из sessionStorage
    const savedSubstances = sessionStorage.getItem('check_substances');
    const savedRole = sessionStorage.getItem('check_user_role');
    
    if (!savedSubstances) {
      navigate('/');
      return;
    }

    const subs = JSON.parse(savedSubstances);
    setSubstances(subs);
    setUserRole(savedRole || 'patient');
    
    // Имитация загрузки результатов (в реальности здесь будет API запрос)
    setTimeout(() => {
      // Генерируем тестовые результаты
      const mockResults = generateMockResults(subs);
      setResults(mockResults);
      setIsLoading(false);
    }, 1500);
  }, [navigate]);

  const generateMockResults = (subs) => {
    // Создаем все пары веществ
    const pairs = [];
    for (let i = 0; i < subs.length; i++) {
      for (let j = i + 1; j < subs.length; j++) {
        pairs.push({
          substance1: subs[i],
          substance2: subs[j],
          status: Math.random() > 0.6 ? 'warning' : Math.random() > 0.8 ? 'danger' : 'safe',
          description: `Взаимодействие между ${subs[i]} и ${subs[j]}`,
        });
      }
    }
    return { pairs };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'safe': return '#27ae60';
      case 'warning': return '#f39c12';
      case 'danger': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'safe': return '✅ Безопасно';
      case 'warning': return '⚠️ Требуется осторожность';
      case 'danger': return '❌ Опасно';
      default: return '❓ Нет данных';
    }
  };

  const hasDangerInteraction = results?.pairs.some(p => p.status === 'danger');

  if (isLoading) {
    return (
      <div style={{ marginLeft: '250px', padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>Анализируем совместимость...</p>
      </div>
    );
  }

  return (
    <div style={{ marginLeft: '250px', padding: '2rem' }}>
      <button
        onClick={() => navigate('/')}
        style={{
          marginBottom: '1rem',
          padding: '0.75rem 1.5rem',
          background: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        ← Проверить снова
      </button>

      {/* Основной результат */}
      <div style={{
        background: hasDangerInteraction ? '#ffebee' : '#e8f5e9',
        border: `2px solid ${hasDangerInteraction ? '#e74c3c' : '#27ae60'}`,
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
      }}>
        <h1 style={{ 
          margin: '0 0 1rem 0',
          color: hasDangerInteraction ? '#e74c3c' : '#27ae60',
          fontSize: '2rem',
        }}>
          {hasDangerInteraction ? '❌ Обнаружено опасное взаимодействие!' : getStatusText('safe')}
        </h1>
        
        <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>
          Проверено пар: {results?.pairs.length || 0}
        </p>

        {hasDangerInteraction && (
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#e74c3c' }}>
              ⚠️ Критические взаимодействия:
            </h3>
            {results?.pairs.filter(p => p.status === 'danger').map((pair, idx) => (
              <div key={idx} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                <strong>{pair.substance1} + {pair.substance2}</strong>
                <p style={{ margin: '0.5rem 0', color: '#666' }}>
                  {userRole === 'doctor' 
                    ? 'Механизм: Конкуренция за ферменты системы цитохрома P450. Повышение концентрации в плазме крови.'
                    : 'Эти препараты могут усиливать побочные эффекты друг друга. Рекомендуется проконсультироваться с врачом.'}
                </p>
                <small style={{ color: '#999' }}>Источник: ГРЛС, клинические рекомендации 2024</small>
              </div>
            ))}
          </div>
        )}

        <div style={{
          background: '#fff3cd',
          padding: '1rem',
          borderRadius: '8px',
          fontSize: '0.875rem',
          color: '#856404',
        }}>
          ⚠️ <strong>Дисклеймер:</strong> Информация носит справочный характер и не заменяет консультацию лечащего врача. Решение о приеме препаратов вы принимаете самостоятельно. БАДдуэт не несет ответственности за последствия самостоятельного применения лекарственных средств и БАДов на основе полученных данных.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        {/* Таблица всех пар */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>📊 Подробная таблица совместимости</h2>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Пара веществ</th>
                <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Статус</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Пояснение</th>
              </tr>
            </thead>
            <tbody>
              {results?.pairs.map((pair, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem' }}>
                    <strong>{pair.substance1}</strong> + <strong>{pair.substance2}</strong>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '0.5rem 1rem',
                      background: getStatusColor(pair.status),
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                    }}>
                      {getStatusText(pair.status)}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#666' }}>
                    {pair.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI-чат */}
        <div>
          <AIChat context={{ substances, userRole }} />
          
          {/* Рекомендации по приему */}
          <div style={{
            marginTop: '1.5rem',
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>💊 Рекомендации по приему</h3>
            {substances.map((sub, idx) => (
              <div key={idx} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                <strong>{sub}</strong>
                <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
                  • Утром, после еды<br/>
                  • Запивать водой<br/>
                  • Интервал с другими препаратами: 2 часа
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
