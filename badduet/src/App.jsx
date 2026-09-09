import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Sidebar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/check" element={<HomePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<div style={{marginLeft: '250px', padding: '2rem'}}><h1>👤 Личный кабинет</h1><p>Раздел в разработке</p></div>} />
          <Route path="/about" element={<div style={{marginLeft: '250px', padding: '2rem'}}><h1>ℹ️ О проекте</h1><p>БАДдуэт — платформа для проверки совместимости БАД и лекарств</p></div>} />
          <Route path="/contacts" element={<div style={{marginLeft: '250px', padding: '2rem'}}><h1>📞 Контакты</h1><p>Рогатных Виктория Ивановна — СЕО БАДдуэт<br/>Тг: https://t.me/mginw</p></div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
