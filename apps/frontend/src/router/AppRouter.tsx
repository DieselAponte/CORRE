import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TwoPlayersView from '../components/TwoPlayersView';
import TestingPage from '../pages/TestingPage';
import OptionsPage from '../pages/OptionsPage';
import CreditsPage from '../pages/CreditsPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TwoPlayersView />} />
        <Route path="/testing" element={<TestingPage />} />
        <Route path="/options" element={<OptionsPage />} />
        <Route path="/credits" element={<CreditsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
