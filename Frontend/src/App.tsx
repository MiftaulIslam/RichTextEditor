import { RouterProvider } from 'react-router-dom'
import router from './routes/routes'
import { useQuery } from '@tanstack/react-query';
  import BounceLoader from './Components/BounchLoader';
import { useFetchQuery } from './hooks/useFetchQuery';
import useTokenStore from './store/TokenStore';
import { useEffect } from 'react';
import socket from './socket/socketServer';
import { IUserInfo } from './Interfaces/ResponseInterface';

function App() {
  const token = useTokenStore((state) => state.token);
  const { fetchRequest } = useFetchQuery<IUserInfo>();

  // Connect socket when app loads
  useEffect(() => {
    if (token) {
      const userId = JSON.parse(atob(token.split('.')[1])).id;
      socket.connect();
      socket.emit('join', { userId });

      return () => {
        socket.disconnect();
      };
    }
  }, [token]);

  const fetchUser = async () => {
    if (token) {
      const headers = { Authorization: `Bearer ${token}` };
      return await fetchRequest("user/getAuthenticateUser", "GET", null, { headers });
    }
  };

  const { isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    enabled: !!token,
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <BounceLoader />;

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
