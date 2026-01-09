
import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { useAuthStore } from './stores/authStore';

function App() {
  const { loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <AppRoutes/>
  );
}

export default App;