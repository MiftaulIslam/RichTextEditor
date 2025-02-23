import { Calendar, MessageCircle, ThumbsUp } from "lucide-react"
import { format } from 'date-fns';
import { IArticle } from "@/Interfaces/EntityInterface";
import { useState } from "react";
import { motion } from "motion/react";
import { AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";

const ArticleCard = ({ article }: { article: IArticle }) => {
    const navigate = useNavigate()
    //  const { commentsData, isLoading } = useArticleQueries(article);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
    return (
    <div className="max-w-2xl mx-auto ">
      <div className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer">
        <div className="p-3">
          <div className="flex items-center gap-2 mb-2" onClick={() => navigate(`/profile/${article.User?.domain}`)}>
            <div className="w-6 h-6 rounded-full overflow-hidden">
              <img
                src={article.User?.avatar as string }
                alt={article.User?.name as string}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-medium text-xs text-gray-500 hover:underline cursor-pointer">
              {article.User?.name}
            </span>
          </div>
          <div className="flex gap-4 items-start justify-between cursor-pointer" onClick={() => navigate(`/${article.User?.domain}/${article.slug}`)}>
            <div className="space-y-2">
              <h2 className="text-lg font-bold leading-tight tracking-tight">{article.title}</h2>
              <p className="text-gray-600 text-xs line-clamp-2">{article.short_preview}</p>
              
            </div>
            <div className="w-1/4 overflow-hidden rounded">
              <img
                src={article.thumbnail || "/placeholder.svg"}
                alt="Article thumbnail"
                
                className="w-full h-full object-cover"
              />
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
              {article?.comments?.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 cursor-pointer" onClick={()=> navigate(`/profile/${comment.User.domain}`)}>
                    <img
                      src={comment?.User.avatar || "/placeholder.svg"}
                      alt={comment?.User.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs font-medium hover:underline" onClick={()=> navigate(`/profile/${comment.User.domain}`)}>{comment.User.name}</span>
                      <span className="text-xs text-gray-500">{format(new Date(comment.created_at), 'MMM dd, yyyy')}</span>
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

export default ArticleCard







