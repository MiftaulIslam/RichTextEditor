import { useFetchQuery } from "@/hooks/useFetchQuery";
import useTokenStore from "@/store/TokenStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useFollowMutations = (domain: string|undefined, slug: string|undefined, setFollowing: (following: boolean) => void, authorId: string|undefined   ) => {
    const {fetchRequest} = useFetchQuery();
    const token = useTokenStore((state) => state.token);
    const queryClient = useQueryClient();

  // Add follow/unfollow mutations
  const followMutation = useMutation({
    mutationFn: async () => {
        setFollowing(true);
        return await fetchRequest(`followers/${authorId}/follow`, 'POST', null, {
            headers: { Authorization: `Bearer ${token}` }
            })
        },
        onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article', domain, slug] });
    }
  });

  const unfollowMutation = useMutation({
    mutationFn: async () => {
        setFollowing(false);
        return await fetchRequest(`followers/${authorId}/unfollow`, 'DELETE', null, {
            headers: { Authorization: `Bearer ${token}` }
        })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article', domain, slug] });
    }
  });

    return {followMutation, unfollowMutation}
}