import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SubstanceInput from '../components/SubstanceInput';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [substances, setSubstances] = useState(['', '']);
  const [isLoading, setIsLoading] = useState(false);

  const addSubstanceField = () => {
    if (substances.length < 10) {
      setSubstances([...substances, '']);
    }
  };

  const removeSubstanceField = (index) => {
    if (substances.length > 2) {
      setSubstances(substances.filter((_, i) => i !== index));
    }
  };

  const updateSubstance = (index, value) => {
    const newSubstances = [...substances];
    newSubstances[index] = value;
    setSubstances(newSubstances);
  };

  const handleCheck = async () => {
    const filledSubstances = substances.filter(s => s.trim());
    
    if (filledSubstances.length < 2) {
      alert('Введите минимум 2 вещества для проверки');
      return;
    }

    setIsLoading(true);
    
    // Сохраняем вещества в sessionStorage для передачи на страницу результатов
    sessionStorage.setItem('check_substances', JSON.stringify(filledSubstances));
    sessionStorage.setItem('check_user_role', user?.role || 'patient');
    
    navigate('/results');
    setIsLoading(false);
  };

  const handleBarcodeScan = () => {
    // Здесь будет логика сканирования штрих-кода
    alert('Функция сканирования штрих-кода будет доступна в следующей версии');
  };

  return (
    <div style={{ marginLeft: '250px', padding: '2rem' }}>
      {/* Хедер */}
      <header style={{ 
        textAlign: 'center', 
        marginBottom: '3rem',
        padding: '2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        color: 'white',
      }}>
        <h1 style={{ margin: '0 0 1rem 0', fontSize: '2.5rem' }}>
          💊 БАДдуэт
        </h1>
        <p style={{ fontSize: '1.25rem', margin: 0 }}>
          Проверь совместимость лекарств и БАДов за 10 секунд
        </p>
      </header>

      {/* Основной блок проверки */}
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#2c3e50' }}>
          Введите вещества для проверки
        </h2>

        {substances.map((substance, index) => (
          <SubstanceInput
            key={index}
            value={substance}
            onChange={(value) => updateSubstance(index, value)}
            onRemove={() => removeSubstanceField(index)}
            canRemove={substances.length > 2}
          />
        ))}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button
            onClick={addSubstanceField}
            disabled={substances.length >= 10}
            style={{
              padding: '0.75rem 1.5rem',
              background: substances.length >= 10 ? '#ccc' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: substances.length >= 10 ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
            }}
          >
            + Добавить еще вещество
          </button>

          <button
            onClick={handleBarcodeScan}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#9b59b6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            📷 Отсканируй штрих-код
          </button>
        </div>

        <button
          onClick={handleCheck}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '1rem',
            marginTop: '2rem',
            background: isLoading ? '#ccc' : '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '1.125rem',
            fontWeight: 'bold',
          }}
        >
          {isLoading ? 'Проверка...' : '✅ Проверить совместимость'}
        </button>

        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: '#fff3cd',
          borderRadius: '8px',
          fontSize: '0.875rem',
          color: '#856404',
        }}>
          ⚠️ <strong>Дисклеймер:</strong> Выбор роли "Врач/нутрициолог" означает, что вы подтверждаете наличие соответствующего образования. БАДдуэт предоставляет информацию справочного характера и не заменяет очную консультацию специалиста.
        </div>
      </div>

      {/* Блок с популярными препаратами */}
      <div style={{ 
        maxWidth: '800px', 
        margin: '2rem auto',
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}>
        <h3 style={{ marginTop: 0, color: '#2c3e50' }}>🔥 Популярные запросы</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {['Омега-3', 'Витамин D', 'Магний B6', 'Аспирин', 'Метформин'].map((item) => (
            <span
              key={item}
              onClick={() => {
                const newSubstances = [...substances];
                newSubstances[0] = item;
                setSubstances(newSubstances);
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#ecf0f1',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
              onMouseOver={(e) => e.target.style.background = '#bdc3c7'}
              onMouseOut={(e) => e.target.style.background = '#ecf0f1'}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
