import { useFetchQuery } from '@/hooks/useFetchQuery';
import useTokenStore from '@/store/TokenStore';
import BounceLoader from '@/Components/BounchLoader';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { IArticle } from '@/Interfaces/EntityInterface';
import { format } from 'date-fns';
import { MessageCircle, Share, ThumbsUp } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/Components/ui/sheet';
import { ScrollArea } from '@/Components/ui/scroll-area';

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
const Article = () => {
    
  const [isLiked, setIsLiked] = useState(false)
    const { domain, slug } = useParams();
      const token = useTokenStore((state) => state.token);
      const { fetchRequest } = useFetchQuery();
    
      const { data: article, isLoading } = useQuery<{ data: IArticle }>({
        queryKey: ['article', domain, slug],
        queryFn: async () => {
          return await fetchRequest(
            `articles/${domain}/${slug}`,
            'GET',
            null,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        },
      });
    
      if (isLoading) return <BounceLoader />;
      if (!article?.data) return <div className="text-center py-8">Article not found</div>;
    
  return (

      <article className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="space-y-4">
        
  
          <h1 className="text-3xl font-bold">
            {article?.data.title}
          </h1>
  
          <p className="text-gray-600">{article?.data.short_preview}</p>
  
          {/* Author info */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img src={article?.data.User?.avatar || "/placeholder.svg"} alt="Author avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{article?.data.User?.name}</span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-500">Follow</span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-500">5 min read</span>
                <span className="text-gray-500">·</span>
                <time className="text-gray-500">{format(new Date(article?.data.created_at), 'MMM dd, yyyy')}</time>
              </div>
            </div>
          </div>
  
          {/* Action buttons */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
              >
                <ThumbsUp size={16} />
                <span>{article?.data.likes.length}</span>
              </button>

              <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                <MessageCircle size={16} />
                <span>{article?.data.comments.length}</span>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-500 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>
  
        {/* Article content */}
        <div className="prose max-w-none mt-8 space-y-6" dangerouslySetInnerHTML={{ __html: article?.data.content }} />
  
        {/* Comments Section */}
        <section className="mt-8 border-t pt-8">
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
          <motion.div className="space-y-6">
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
                      <button   className="text-gray-500">
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
                      <button   className="text-gray-500">
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
                            <button   className="text-gray-500">
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
                            <button   className="text-gray-500">
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
          </motion.div>
  
          {/* See all responses sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <button  className="mt-6 bg-green-500 text-white px-4 py-2 rounded text-xs font-medium">
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
                          <button   className="text-gray-500">
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
                          <button   className="text-gray-500">
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
                                <button   className="text-gray-500">
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
                                <button   className="text-gray-500">
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
      </article>
  )
}

export default Article





