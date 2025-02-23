/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";

import { IArticle } from "@/Interfaces/EntityInterface";

import useTokenStore from "@/store/TokenStore";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

export const useArticleQueries = (article: IArticle | undefined,) => {
    const token = useTokenStore((state) => state.token);
    const { fetchRequest } = useFetchQuery();
    const queryClient = useQueryClient();

    // article Like mutation
    const likeMutation = useMutation({
        mutationFn: async () => {
            return await fetchRequest(
                `likes/article/${article?.id}/like?authorId=${article?.User?.id}&authorDomain=${article?.User?.domain}&articleSlug=${article?.slug}`,
                'POST',
                null,
                { headers: { Authorization: `Bearer ${token}` } }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['article', article?.User?.domain, article?.slug] });
        }
    });

    const { data: commentsData, isLoading } = useQuery<any>({
        queryKey: ['comments', article?.id],
        queryFn: async () => {
            return await fetchRequest(
                `comments/${article?.id}`,
                'GET',
                null,
                { headers: { Authorization: `Bearer ${token}` } }
            );
        },
        enabled: !!article?.id 
    });

    return { likeMutation, commentsData,isLoading };
}