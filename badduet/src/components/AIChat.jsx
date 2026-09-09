import { useState } from 'react';
import { chatService } from '../services/api';

export default function AIChat({ context }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(input, context);
      const aiMessage = { role: 'assistant', content: response.message };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Ошибка чата:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: 'Извините, произошла ошибка. Попробуйте позже.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-chat" style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '1rem',
      background: '#f9f9f9',
    }}>
      <h3 style={{ margin: '0 0 1rem 0' }}>💬 Спроси у ИИ</h3>
      
      <div style={{
        maxHeight: '300px',
        overflowY: 'auto',
        marginBottom: '1rem',
        padding: '0.5rem',
      }}>
        {messages.length === 0 && (
          <div style={{ color: '#666', fontStyle: 'italic' }}>
            Задайте вопрос о совместимости препаратов...
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: '0.75rem',
              padding: '0.75rem',
              borderRadius: '8px',
              background: msg.role === 'user' ? '#e3f2fd' : 'white',
              marginLeft: msg.role === 'user' ? '1rem' : '0',
            }}
          >
            <strong style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
              {msg.role === 'user' ? 'Вы' : 'ИИ-ассистент'}
            </strong>
            {msg.content}
          </div>
        ))}
        
        {isLoading && (
          <div style={{ color: '#666', fontStyle: 'italic' }}>
            ИИ печатает...
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ваш вопрос..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ddd',
          }}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          style={{
            padding: '0.5rem 1rem',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          ➤
        </button>
      </div>

      <div style={{
        marginTop: '0.75rem',
        fontSize: '0.75rem',
        color: '#666',
        fontStyle: 'italic',
      }}>
        ⚠️ Ответы ИИ носят рекомендательный характер и не являются медицинской консультацией
      </div>
    </div>
  );
}
