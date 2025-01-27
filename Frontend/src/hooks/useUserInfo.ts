import useTokenStore from "@/store/TokenStore";

import { useQuery } from "@tanstack/react-query";


import { IUser } from "@/Interfaces/EntityInterface";

export const useUserInfo = () => {
    const token = useTokenStore((state) => state.token);
    const { data: userInfo } = useQuery<{ data: IUser }>({
        queryKey: ['user'],
        enabled: !!token,
    });
    return userInfo;
}