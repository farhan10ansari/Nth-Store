
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Shop } from './pages/Shop';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/shop" replace />} />
          <Route path="/shop" element={<Shop />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
