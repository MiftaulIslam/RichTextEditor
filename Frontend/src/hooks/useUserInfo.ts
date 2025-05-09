import useTokenStore from "@/store/TokenStore";
import { useQuery } from "@tanstack/react-query";
import { IUser } from "@/Interfaces/EntityInterface";
import { useFetchQuery } from "./useFetchQuery";

export const useUserInfo = () => {
    const token = useTokenStore((state) => state.token);
    const { fetchRequest } = useFetchQuery<{ data: IUser }>();

    const { data: userInfo } = useQuery<{ data: IUser }>({
        queryKey: ['user'],
        queryFn: async () => {
            if (!token) throw new Error('No token available');
            const headers = { Authorization: `Bearer ${token}` };
            return await fetchRequest("user/getAuthenticateUser", "GET", null, { headers });
        },
        enabled: !!token,
    });

    return userInfo;
}