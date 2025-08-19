import { Calendar, MessageCircle, ThumbsUp } from "lucide-react"
import { format } from 'date-fns';
import { IArticle } from "@/Interfaces/EntityInterface";
import { useState } from "react";
import { motion } from "motion/react";
import { AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";

const comments = [
    {
      id: 1,
      author: "Sarah Chen",
      avatar: "/placeholder.svg",
      content: "This is exactly what I needed! The system design concepts are explained so well.",
      timeAgo: "2h ago",
    },
    {
      id: 2,
      author: "Mike Johnson",
      avatar: "/placeholder.svg",
      content: "Great article! Would love to see more content about distributed systems.",
      timeAgo: "5h ago",
    },
    {
      id: 3,
      author: "Alex Kumar",
      avatar: "/placeholder.svg",
      content: "The diagrams really helped me understand the concepts better. Thanks for sharing!",
      timeAgo: "1d ago",
    },
  ]
const ArticleCardPositionVertical = ({ article }: { article: IArticle }) => {
    
    const navigate = useNavigate()
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
    return (
    <div className="w-full cursor-pointer">
      <div className="shadow rounded overflow-hidden">
        <div className="p-3">
          <div className="flex flex-col items-start gap-2 mb-2" onClick={() => navigate(`/${article.User?.domain}/${article.slug}`)}>
            {/* image */}
          <div className="w-full overflow-hidden rounded">
              <img
                src={article.thumbnail as string}
                alt={article.title as string}
                
                className="w-full h-full object-cover"
              />
            </div>            
          <div className=" cursor-pointer space-y-2">
            
            {/* Profile */}
            <div className="flex items-center gap-2">

            <div className="w-6 h-6 rounded-full overflow-hidden">
              <img
                src={article.User?.avatar || "/placeholder.svg"}
                alt={article.User?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-medium text-xs text-gray-500 hover:underline cursor-pointer">
              {article.User?.name}
            </span>

            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold leading-tight tracking-tight">{article.title}</h2>
              <p className="text-gray-600 text-xs line-clamp-2">{article.short_preview}</p>
              
            </div>
          </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{format(new Date(article.created_at), "MMM dd, yyyy")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp size={12} />
                  <span>{article.likes?.length || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle size={12} />
                  <button onClick={() => setIsCommentsOpen(!isCommentsOpen)} className="hover:underline cursor-pointer">
                    {article.comments?.length || 0} comments
                  </button>
                </div>
              </div>
        </div>
      </div>

      <AnimatePresence>
        {isCommentsOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 bg-white shadow-md rounded-lg overflow-hidden"
          >
            <div className="p-3 space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={comment.avatar || "/placeholder.svg"}
                      alt={comment.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{comment.author}</span>
                      <span className="text-xs text-gray-500">{comment.timeAgo}</span>
                    </div>
                    <p className="text-xs text-gray-600">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    )
}

export default ArticleCardPositionVertical






