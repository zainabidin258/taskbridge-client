import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
// import BoardPage from './pages/BoardPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from './components/MainLayout';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignUpPage />} />

          {/* Protected Routes */}

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path='/dashboard' element={<Dashboard />}></Route>
            </Route>
          </Route>

          <Route path='*' element={<Navigate to='/login' />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
