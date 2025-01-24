import { useFetchQuery } from '@/hooks/useFetchQuery';
import useTokenStore from '@/store/TokenStore';
import BounceLoader from '@/Components/BounchLoader';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { IArticle, IComment, ILike, IUser } from '@/Interfaces/EntityInterface';
import { format } from 'date-fns';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/Components/ui/sheet';
import { ScrollArea } from '@/Components/ui/scroll-area';
import ArticleCardPositionVertical from '@/Components/Article/ArticleCardPositionVertical';

const comments = [
  {
    id: 1,
    author: "Impoly",
    avatar: "/placeholder.svg",
    content: "Nice Article!",
    likes: 301,
    date: "Jan 8 (edited)",
    replies: [],
  },
  {
    id: 2,
    author: "Attila Vágó",
    avatar: "/placeholder.svg",
    content:
      "I find myself increasingly relying on Apple Freeform. Very easy to use, free and the diagrams look great.",
    likes: 161,
    date: "Jan 8",
    replies: [
      {
        id: 21,
        author: "Saeed Zarinfam",
        avatar: "/placeholder.svg",
        content: "My experience with Windsurf was great, I should also try Cursor.",
        likes: 159,
        date: "Jan 9",
      },
    ],
  },
]
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

const Article = () => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const { domain, slug } = useParams();
  const token = useTokenStore((state) => state.token);
  const { fetchRequest } = useFetchQuery();
  const queryClient = useQueryClient();
  const { data: userInfo } = useQuery<{ data: IUser }>({
    queryKey: ['user'],
    enabled: !!token,
  });
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

  // const [following, setFollowing] = useState(article?.data.isFollowing);
  const [following, setFollowing] = useState(!isLoading && article?.data.isFollowing );
  useEffect(() => {
    setFollowing(article?.data.isFollowing);
  }, [article?.data.isFollowing, isLoading])
  
  const handleFollow = async () => {

    setFollowing(true);
    const response = await fetchRequest(`followers/${article?.data.User.id}/follow`, 'POST', null, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response;
  }
  const handleUnfollow = async () => {

    setFollowing(false);
    const response = await fetchRequest(`followers/${article?.data.User.id}/unfollow`, 'DELETE', null, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response;
  }
  // Add follow/unfollow mutations
  const followMutation = useMutation({
    mutationFn: handleFollow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article', domain, slug] });
    }
  });

  const unfollowMutation = useMutation({
    mutationFn: handleUnfollow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article', domain, slug] });
    }
  });

  const handleFollowToggle = async () => {
    
    if (following) {
      await unfollowMutation.mutateAsync();
    } else {
      await followMutation.mutateAsync();
    }
  };

  // Add like mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      return await fetchRequest(
        `likes/article/${article?.data.id}/like?userId=${userInfo?.data.id}`,
        'POST',
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      setIsLiked(!isLiked);
      queryClient.invalidateQueries({ queryKey: ['article', domain, slug] });
    }
  });

  const handleLike = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    await likeMutation.mutateAsync();
  };

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
                  <ThumbsUp size={20} className={isLiked ? "fill-blue-600 text-blue-600" : ""} />
                  <span>{article?.data.likes?.length || 0}</span>
                </button>


                <a href='#comments-preview' className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                  <MessageCircle size={16} />
                  <span className='text-sm'>{article?.data.comments.length}</span>
                </a>
              </p>

              <p className="text-gray-500 text-xs font-normal space-x-2">
                <span className='text-gray-500'>{article?.data.estimated_reading_time ? `${article?.data.estimated_reading_time} min read`:Math.floor(article?.data.content.split(' ').length / 250)} min read</span>
                <span className='text-gray-500'>·</span>
                <span className='text-gray-500'>{format(new Date(article?.data?.created_at), 'MMM dd, yyyy')}</span>
              </p>
            </div>
          </div>
        </div>
      </header>
      <hr className='my-4'/>
      <div className='my-4'>
        <img src={article?.data.thumbnail as string} alt="" />
      </div>
      {/* Article content */}
      <div className="prose max-w-none mt-8 space-y-6" dangerouslySetInnerHTML={{ __html: article?.data.content }} />

      {/* Comments Section */}
      <section className="mt-8 border-t pt-8" id='comments-preview'>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Responses (130)</h3>

        </div>

        {/* Comment Input */}
        <div className="flex items-start gap-3 mb-8">
          <Avatar className="w-8 h-8">
            <AvatarImage src={article?.data.User?.avatar || "/placeholder.svg"} />
            <AvatarFallback>{article?.data.User?.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <textarea
              placeholder="What are your thoughts?"
              className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
            <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded text-xs font-medium">
              Comment
            </button>
          </div>
        </div>

        {/* Comments Preview List */}
        <motion.section className="space-y-6">
          <AnimatePresence>
            {comments.slice(0, 2).map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex gap-3"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={comment.avatar} />
                  <AvatarFallback>{comment.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{comment.author}</span>
                      <span className="text-sm text-gray-500">{comment.date}</span>
                    </div>
                    <button>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-1 text-gray-700">{comment.content}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <button className="text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      {comment.likes}
                    </button>
                    <button className="text-gray-500">
                      Reply
                    </button>
                  </div>

                  {/* Nested Replies */}
                  {comment.replies?.map((reply) => (
                    <motion.div
                      key={reply.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3 mt-4 ml-8"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={reply.avatar} />
                        <AvatarFallback>{reply.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{reply.author}</span>
                            <span className="text-sm text-gray-500">{reply.date}</span>
                          </div>
                          <button   >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                              />
                            </svg>
                          </button>
                        </div>
                        <p className="mt-1 text-gray-700">{reply.content}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <button className="text-gray-500">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                            {reply.likes}
                          </button>
                          <button className="text-gray-500">
                            Reply
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.section>

        {/* See all responses sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="mt-6 bg-green-500 text-white px-4 py-2 rounded text-xs font-medium">
              See all responses ({article?.data.comments.length})
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-[500px]">
            <SheetHeader>
              <SheetTitle>All Responses ({article?.data.comments.length})</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
              <div className="space-y-6 pr-4">
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.avatar} />
                      <AvatarFallback>{comment.author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{comment.author}</span>
                          <span className="text-sm text-gray-500">{comment.date}</span>
                        </div>
                        <button   >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </button>
                      </div>
                      <p className="mt-1 text-gray-700">{comment.content}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <button className="text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          {comment.likes}
                        </button>
                        <button className="text-gray-500">
                          Reply
                        </button>
                      </div>

                      {/* Nested Replies in Sheet */}
                      {comment.replies?.map((reply) => (
                        <motion.div
                          key={reply.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-3 mt-4 ml-8"
                        >
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={reply.avatar} />
                            <AvatarFallback>{reply.author[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{reply.author}</span>
                                <span className="text-sm text-gray-500">{reply.date}</span>
                              </div>
                              <button   >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                  />
                                </svg>
                              </button>
                            </div>
                            <p className="mt-1 text-gray-700">{reply.content}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <button className="text-gray-500">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                  />
                                </svg>
                                {reply.likes}
                              </button>
                              <button className="text-gray-500">
                                Reply
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
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





