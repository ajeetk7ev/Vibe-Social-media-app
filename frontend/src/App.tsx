import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { useAuthStore } from './stores/authStore';
import { useSocketStore } from './stores/socketStore';

function App() {
  const { user, loadUser } = useAuthStore();
  const { connectSocket, disconnectSocket } = useSocketStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (user) {
      connectSocket();
    } else {
      disconnectSocket();
    }
  }, [user, connectSocket, disconnectSocket]);

  return (
    <AppRoutes />
  );
}

export default App;