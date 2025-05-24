import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import OrdinalsPage from './pages/OrdinalsPage';
function App() {
  return (
    <>
      <Navbar /> {/* Re-enabled Navbar */}
      <Routes>
        <Route path="/" element={<OrdinalsPage />} />
      </Routes>
    </>
  );
}

export default App;
