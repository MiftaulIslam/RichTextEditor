/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFetchQuery } from "@/hooks/useFetchQuery";
import useTokenStore from "@/store/TokenStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useCommentMutations = (articleId: string|undefined) => {
  const {fetchRequest} = useFetchQuery();
  const queryClient = useQueryClient();
  const token = useTokenStore((state) => state.token);
  
  // Add comment mutation
  const commentMutation = useMutation({
    mutationFn: async ({ content, parentId }: { content: string, parentId?: string }) => {
      return await fetchRequest(
        `${parentId ? `comments?parentId=${parentId}` : 'comments'}`,
        'POST',
        {
          articleId: articleId,
          content
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
    }
  });

  // Like comment mutation
  const likeCommentMutation = useMutation({
    mutationFn: async (comment: any) => {
      return await fetchRequest(
        `comments/${comment.id}/like?commentAuthor=${comment.author_id}&article=${comment.article_id}`,
        'POST',
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
    }
  });
  return {likeCommentMutation, commentMutation}
}
