import { useFetchQuery } from '@/hooks/useFetchQuery';
import useTokenStore from '@/store/TokenStore';
import BounceLoader from '@/Components/BounchLoader';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { IArticle, IComment, ILike, IUser } from '@/Interfaces/EntityInterface';
import { format } from 'date-fns';
import { MessageCircle, ThumbsUp, MoreVertical } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/Components/ui/sheet';
import { ScrollArea } from '@/Components/ui/scroll-area';
import ArticleCardPositionVertical from '@/Components/Article/ArticleCardPositionVertical';
import { useForm } from 'react-hook-form';
import { Skeleton } from '@/Components/ui/skeleton';
import { useCommentMutations } from '@/Components/Article/ArticlePage/hooks/useCommentMutations';
import { useFollowMutations } from '@/Components/Article/ArticlePage/hooks/useFollowMutations';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useArticleQueries } from '@/Components/Article/ArticlePage/hooks/useArticleQueries';


interface IArticleWithUser {
  User: IUser;
  likes: ILike[];
  comments: IComment[];
  content: string;
  created_at: string;
  id: string;
  is_published: boolean;
  published_at: string | null;
  short_preview: string | null;
  slug: string | null;
  thumbnail: string | null;
  title: string | null;
  updated_at: string | null;
  views: number;
  author_id: string;
  estimated_reading_time: number;
  isFollowing: boolean;
}
interface ArticleResponse {
  data: IArticleWithUser;
}

interface CommentForm {
  content: string;
}

interface ReplyForm {
  content: string;
}

const Article = () => {
  const navigate = useNavigate();
  const { domain, slug } = useParams();
  const token = useTokenStore((state) => state.token);
  const { fetchRequest } = useFetchQuery();

  const [isLiked, setIsLiked] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const { register: registerComment, handleSubmit: handleSubmitComment, reset: resetComment } = useForm<CommentForm>();
  const { register: registerReply, handleSubmit: handleSubmitReply, reset: resetReply } = useForm<ReplyForm>();
  //logged in user info
  const userInfo = useUserInfo();
  //Article info
  const { data: article, isLoading } = useQuery<ArticleResponse>({
    queryKey: ['article', domain, slug],
    queryFn: async () => {
      return await fetchRequest(
        `${token ? `articles/${domain}/${slug}?u=${userInfo?.data.id}` : `articles/${domain}/${slug}`}`,
        'GET',
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      ) as ArticleResponse;
    }
  });

  //Following state
  const [following, setFollowing] = useState(!isLoading && article?.data.isFollowing);

  //Follow/unfollow mutations
  const { followMutation, unfollowMutation } = useFollowMutations(domain, slug, setFollowing, article?.data.User.id);
  //Article queries
  const { likeMutation, commentsData, isCommentsLoading } = useArticleQueries(setIsLiked, isLiked, article?.data);

  // article Like
  const handleLike = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    await likeMutation.mutateAsync();
  };
  //Follow/Unfollow toggle
  const handleFollowToggle = async () => {
    if (following) {
      await unfollowMutation.mutateAsync();
    } else {
      await followMutation.mutateAsync();
    }
  };
  //comment mutations
  const {
    likeCommentMutation,
    commentMutation
  } = useCommentMutations(article?.data.id);

  // Submit comment
  const onSubmitComment = async (data: CommentForm) => {
    if (!token) {
      navigate('/login');
      return;
    }
    await commentMutation.mutateAsync({ content: data.content });
    resetComment()
  };

  const onSubmitReply = async (data: ReplyForm, parentId: string) => {
    if (!token) {
      navigate('/login');
      return;
    }
    await commentMutation.mutateAsync({
      content: data.content,
      parentId
    });
    resetReply();
    setActiveReplyId(null);
  };


  const handleLikeComment = async (commentId: string) => {
    if (!token) {
      navigate('/login');
      return;
    }
    await likeCommentMutation.mutateAsync(commentId);
  };

  const handleReplyClick = (commentId: string) => {
    setActiveReplyId(activeReplyId === commentId ? null : commentId);
  };

  useEffect(() => {
    setFollowing(article?.data.isFollowing);
  }, [commentsData, article?.data.isFollowing, isLoading])
  console.log(commentsData)
  if (isLoading) return <BounceLoader />;
  if (!article?.data) return <div className="text-center py-8">Article not found</div>;
  return (
    <article className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <header className="space-y-4">
        <h1 className="text-3xl font-bold italic">
          {article?.data?.title}
        </h1>

        <p className="text-gray-600 text-sm font-semibold">{article?.data?.short_preview}</p>

        {/* Author info */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden" onClick={() => navigate(`/profile/${article?.data?.User?.domain}`)}>
              <img src={article?.data?.User?.avatar || "/placeholder.svg"} alt="Author avatar" className="w-full h-full object-cover" />
            </div>
            <div className=" gap-2">
              <p className="text-xs font-normal space-x-2 flex items-center">
                <span className='text-black font-semibold' onClick={() => navigate(`/profile/${article?.data?.User?.domain}`)}>
                  {article?.data?.User?.name}
                </span>
                <span className='text-gray-500'>·</span>
                <button
                  onClick={handleFollowToggle}
                  className='text-green-700 hover:underline text-sm'
                >
                  {following ? "Following" : "Follow"}
                </button>
                <button
                  onClick={handleLike}
                  disabled={likeMutation.isPending}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <ThumbsUp size={16} className={isLiked ? "text-blue-600" : ""} />
                  <span>{article?.data.likes?.length || 0}</span>
                </button>


                <a href='#comments-preview' className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                  <MessageCircle size={16} />
                  <span className='text-sm'>{commentsData?.data.length || '...'}</span>
                </a>
              </p>

              <p className="text-gray-500 text-xs font-normal space-x-2">
                <span className='text-gray-500'>{article?.data.estimated_reading_time ? `${article?.data.estimated_reading_time} min read` : Math.floor(article?.data.content.split(' ').length / 250)} min read</span>
                <span className='text-gray-500'>·</span>
                <span className='text-gray-500'>{format(new Date(article?.data?.created_at), 'MMM dd, yyyy')}</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      <hr className='my-4' />




      <div className='my-4'>
        <img src={article?.data.thumbnail as string} alt="" />
      </div>
      {/* Article content */}
      <div className="prose max-w-none mt-8 space-y-6" dangerouslySetInnerHTML={{ __html: article?.data.content }} />

      {/* Comments Section */}
      <section className="mt-8 border-t pt-8" id='comments-preview'>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Responses ({commentsData?.data.length || 0})</h3>
        </div>

        {/* Comment Input */}
        <div className="flex items-start gap-3 mb-8">
          <Avatar className="w-6 h-6">
            <AvatarImage src={userInfo?.data.avatar || "/placeholder.svg"} />
            <AvatarFallback>{userInfo?.data.name}</AvatarFallback>
          </Avatar>
          <form className="flex-1" onSubmit={handleSubmitComment(onSubmitComment)}>
            <textarea

              {...registerComment('content', { required: true })}
              placeholder="What are your thoughts?"
              className="w-full min-h-[100px] p-3 border rounded resize-none focus:outline-none shadow text-sm text-gray-500"
            />
            <button type='submit' className="mt-2 bg-green-500 text-white px-4 py-2 rounded text-xs font-medium">
              Comment
            </button>
          </form>
        </div>

        {/* Comments Preview List */}
        <motion.section className="space-y-6">
          <AnimatePresence>
            {!isCommentsLoading ? commentsData?.data.slice(0, 2).map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex gap-3"
              >
                <Avatar className="w-6 h-6">
                  <AvatarImage src={comment.User?.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{comment.User?.name}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{comment.User?.name}</span>
                      <span className="text-xs text-gray-500">{format(new Date(comment.created_at), 'MMM dd, yyyy')}</span>
                    </div>
                    <button>
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-700">{comment.content}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className="text-gray-500 flex items-center gap-1"
                    >
                      <span className='text-xs flex items-center gap-1'><ThumbsUp size={14} className='mb-1'/>{comment.comment_likes.length}</span>
                    </button>
                    <span className='text-gray-500'>·</span>
                    <button
                      onClick={() => handleReplyClick(comment.id)}
                      className="text-gray-500 text-xs hover:underline"
                    >
                      {activeReplyId === comment.id ? 'Hide Replies' : `Replies (${comment.other_comments.length})`}
                    </button>
                  </div>

                  {/* Replies Section - Only visible when activeReplyId matches */}
                  {activeReplyId === comment.id && (
                    <div className="mt-4 ml-8 space-y-4">
                      {/* Reply Form */}
                      <form onSubmit={handleSubmitReply((data) => onSubmitReply(data, comment.id))}>
                        <textarea
                          {...registerReply('content', { required: true })}
                          placeholder={`Reply to ${comment.User?.name}...`}
                          className="w-full p-3 border rounded resize-none focus:outline-none shadow text-sm text-gray-500"
                          rows={2}
                        />
                        <button
                          type="submit"
                          className="mt-2 bg-green-500 text-white px-4 py-2 rounded text-xs font-medium"
                          disabled={commentMutation.isPending}
                        >
                          {commentMutation.isPending ? 'Sending...' : 'Reply'}
                        </button>
                      </form>

                      {/* Existing Replies */}
                      {comment.other_comments.map((reply) => (
                        <div key={reply.id} className="border-l-2 pl-4">
                          <div className="flex items-center gap-2 mb-2">
                            <img
                              src={reply.User.avatar || "/placeholder.svg"}
                              alt={reply.User.name}
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="font-semibold text-sm">{reply.User.name}</span>
                            <span className="text-gray-500 text-xs">
                              {format(new Date(reply.created_at), 'MMM dd, yyyy')}
                            </span>
                          </div>
                          <p className="text-xs text-gray-700">{reply.content}</p>
                          <button
                            onClick={() => handleLikeComment(reply.id)}
                            className="mt-2 text-gray-500 flex items-center gap-1"
                          >
                            <ThumbsUp size={14} />
                            <span className="text-xs">{reply.comment_likes.length}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )) : <div className="space-y-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white border-b animate-pulse overflow-hidden">
                  <div className="p-6">
                    <Skeleton className="bg-gray-200 w-7 h-7 rounded-full" />
                  </div>
                </div>
              ))}
            </div>}
          </AnimatePresence>
        </motion.section>

        {/* See all responses sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="mt-6 bg-green-500 text-white px-4 py-2 rounded text-xs font-medium">
              See all responses ({commentsData?.data.length})
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-[500px]">
            <SheetHeader>
              <SheetTitle>All Responses ({commentsData?.data.length})</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
              <div className="space-y-6 pr-4">
                {commentsData?.data.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3"
                  >
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={comment.User?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{comment.User?.name}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{comment.User?.name}</span>
                          <span className="text-xs text-gray-500">{format(new Date(comment.created_at), 'MMM dd, yyyy')}</span>
                        </div>
                        <button   >
                          <MoreVertical size={16} />

                        </button>
                      </div>
                      <p className="mt-1 text-xs text-gray-700">{comment.content}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <button className="text-gray-500 ">
                          <span className="text-xs flex items-center gap-1">
                            <ThumbsUp size={16} className="mr-1" />{comment.comment_likes.length} </span>
                        </button>
                        <button
                          onClick={() => handleReplyClick(comment.id)}
                          className="text-gray-500 text-xs hover:underline"
                        >
                          {activeReplyId === comment.id ? 'Hide Replies' : `${comment.other_comments.length} Replies`}
                        </button>
                      </div>
                  {/* Replies Section - Only visible when activeReplyId matches */}
                  {activeReplyId === comment.id && (
                    <div className="mt-4 ml-8 space-y-4">
                      {/* Reply Form */}
                      <form onSubmit={handleSubmitReply((data) => onSubmitReply(data, comment.id))}>
                        <textarea
                          {...registerReply('content', { required: true })}
                          placeholder={`Reply to ${comment.User?.name}...`}
                          className="w-full p-3 border rounded resize-none focus:outline-none shadow text-sm text-gray-500"
                          rows={2}
                        />
                        <button
                          type="submit"
                          className="mt-2 bg-green-500 text-white px-4 py-2 rounded text-xs font-medium"
                          disabled={commentMutation.isPending}
                        >
                          {commentMutation.isPending ? 'Sending...' : 'Reply'}
                        </button>
                      </form>

                      {/* Existing Replies */}
                      {comment.other_comments.map((reply) => (
                        <div key={reply.id} className="border-l-2 pl-4">
                          <div className="flex items-center gap-2 mb-2">
                            <img
                              src={reply.User.avatar || "/placeholder.svg"}
                              alt={reply.User.name}
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="font-medium text-sm">{reply.User.name}</span>
                            <span className="text-gray-500 text-xs">
                              {format(new Date(reply.created_at), 'MMM dd, yyyy')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{reply.content}</p>
                          <button
                            onClick={() => handleLikeComment(reply.id)}
                            className="mt-2 text-gray-500 flex items-center gap-1"
                          >
                            <ThumbsUp size={14} />
                            <span className="text-xs">{reply.comment_likes.length}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </section>
      {/* User's articles */}
      <section className='my-8 space-y-6'>
        <h2 className="text-xl font-semibold w-full">More from {article?.data.User?.name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {article?.data.User.articles.slice(0, 4).map((article: IArticle) => (
            <div key={article.id}>
              <ArticleCardPositionVertical article={article} />

            </div>
          ))}
        </div>
        <button className="mt-6 bg-green-500 text-white px-4 py-2 rounded text-xs font-medium" onClick={() => navigate(`/${article?.data.User?.domain}`)}>
          See all from {article?.data.User?.name}
        </button>
      </section>

      {/* Recommended articles */}
      <section className='my-8 space-y-6'>
        <h2 className="text-xl font-semibold w-full">Recommended for you</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {article?.data.User.articles.slice(0, 4).map((article: IArticle) => (
            <div key={article.id}>
              <ArticleCardPositionVertical article={article} />
            </div>
          ))}
        </div>
      </section>


    </article>
  )
}

export default Article





