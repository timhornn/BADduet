import { useState } from 'react';
import { substancesService } from '../services/api';

export default function SubstanceInput({ value, onChange, onRemove, canRemove }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = async (e) => {
    const query = e.target.value;
    onChange(query);
    
    if (query.length >= 2) {
      try {
        const results = await substancesService.search(query);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Ошибка поиска:', error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (substance) => {
    onChange(substance.name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="substance-input-wrapper" style={{ position: 'relative', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => value.length >= 2 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Введите название препарата или БАД"
          style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
        />
        {canRemove && (
          <button
            onClick={onRemove}
            style={{
              padding: '0.75rem 1rem',
              background: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 1000,
          maxHeight: '200px',
          overflowY: 'auto',
        }}>
          {suggestions.map((substance) => (
            <div
              key={substance.id}
              onClick={() => handleSelectSuggestion(substance)}
              style={{
                padding: '0.75rem',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
              }}
              onMouseOver={(e) => e.target.style.background = '#f5f5f5'}
              onMouseOut={(e) => e.target.style.background = 'white'}
            >
              <strong>{substance.name}</strong>
              {substance.synonym && <div style={{ fontSize: '0.875rem', color: '#666' }}>{substance.synonym}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
