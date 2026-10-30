import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Plans from './pages/Plans'; // <-- IMPORT PLANS

function Layout({ children }) {
  const { user, logout } = useAuth();
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: 16, marginBottom: 24 }}>
        <h1>Plan Reminder</h1>
        <div>
          Logged in as <strong>{user.name}</strong> ({user.role})
          <button onClick={logout} style={{ marginLeft: 16 }}>Log out</button>
        </div>
      </header>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Plans />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}