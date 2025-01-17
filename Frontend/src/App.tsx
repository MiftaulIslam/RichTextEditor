
import { RouterProvider } from 'react-router-dom'
import router from './routes/routes'
import { useQuery } from '@tanstack/react-query';
import BounceLoader from './Components/BounchLoader';
import { IUserInfo } from './Interfaces/AuthInterfaces';
import { useFetchQuery } from './hooks/useFetchQuery';
import useTokenStore from './store/TokenStore';

function App() {
  const token = useTokenStore((state) => state.token);
  const { fetchRequest } = useFetchQuery<IUserInfo>();

  const fetchUser = async () => {
    const headers = { Authorization: `Bearer ${token}` };
    return await fetchRequest("user/getAuthenticateUser", "GET", null, { headers });
  };

  const {  isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    enabled: !!token, 
    refetchOnWindowFocus: false,
  });
  if (isLoading) return <BounceLoader />;
  if (isError) return <div>Error fetching user data.</div>;

  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}

export default App
