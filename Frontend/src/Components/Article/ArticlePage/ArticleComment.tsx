/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { useUserInfo } from "@/hooks/useUserInfo";
import useTokenStore from "@/store/TokenStore";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCommentMutations } from "./hooks/useCommentMutations";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { format } from "date-fns/format";
import {  MessageCircleMore, MoreVertical, ThumbsUp } from "lucide-react";
import { Skeleton } from "@/Components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,  } from "@/Components/ui/sheet";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { useArticleQueries } from "./hooks/useArticleQueries";
import { SecondaryLoader } from "@/Components/SecondaryLoader";

const CommentInput = ({
    handleForm,
    inputRegister,
    placeholder,
    className,
    buttonText
  }: {
    handleForm: (e: React.FormEvent) => void;
    inputRegister: any;
    placeholder: string;
    className: string;
    buttonText: any;
  }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Function to auto-adjust textarea height
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to auto
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight, // Use scrollHeight to calculate the required height
        200 // Set a max height (e.g., 200px)
      )}px`;
    }
  };

  // Adjust height on input change
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.addEventListener("input", adjustTextareaHeight);
    }
    return () => {
      if (textareaRef.current) {
        textareaRef.current.removeEventListener("input", adjustTextareaHeight);
      }
    };
  }, []);
    return (
      <form className="flex-1 relative" onSubmit={handleForm}>
        <textarea
    
        ref={textareaRef}
          {...inputRegister}
          placeholder={placeholder}
          className={`${className} font_montserrat w-full p-3 border rounded resize-none focus:outline-none shadow text-sm text-gray-700`}
        />
        <button type='submit' className="absolute bottom-3 right-3 mt-2 comment_button font_opensans ">
  
          {buttonText}
        </button>
      </form>
    )
  }
  
const CommentCard = ({ comment, handleLike, isReply, activeReply, handleActiveReply }: {
    comment: any;
    handleLike: (e: any) => void;
    isReply?: boolean;
    activeReply?: any;
    handleActiveReply?: any;
  }) => {
    return (
      <>
  
        {/* Commenter author's image */}
        <Avatar className="w-6 h-6">
          <AvatarImage src={comment?.User.avatar || "/placeholder.svg"} />
          <AvatarFallback>{comment?.User?.name}</AvatarFallback>
        </Avatar>
        {/* Comment info */}
        <div className='space-y-1 flex-1'>
          {/* commenter name with date */}
          <div className="flex_between_center gap-2">
            <div className='space-x-2'>
              <span className="user_name">{comment?.User.name}</span>
              <span className="date">
                {format(new Date(comment?.created_at), 'MMM-dd-yy')}
              </span>
            </div>
  
            <button>
              <MoreVertical className='w-4 h-4' />
            </button>
          </div>
          {/* comment */}
          <p className="text-sm font_opensans text-gray-600 max-w-64 break-words">{comment?.content}</p>
          <div className='flex_start_center gap-1'>
  
  
            <button
              onClick={handleLike}
              className="text-gray-500 flex text-sm gap-1"
            >
              <ThumbsUp className='w-4 h-4 inline-block' />
              <span className="text-xs">{comment?.comment_likes?.length}</span>
            </button>
            {
              isReply && (
                <>
  
                  <span className='text-gray-500'>·</span>
                  <button
                    onClick={handleActiveReply}
                    className="text-gray-500 text-xs hover:underline"
                  >
                    {activeReply === comment.id ? 'Hide Replies' : `Replies (${comment?.other_comments?.length})`}
                  </button>
                </>
              )
            }
          </div>
        </div>
      </>
    )
  }


  const CommentSkeleton = ({id}:{id:number})=>{
    return (
        <div key={id} className="bg-white border-b animate-pulse overflow-hidden">
              <div className="p-6">
                <Skeleton className="bg-gray-200 w-7 h-7 rounded-full" />
              </div>
            </div>
    )
  }
const ArticleComment = ({article}:{article:any}) => {
    const userInfo = useUserInfo();
    const navigate = useNavigate();
    
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

    const token = useTokenStore((state) => state.token);
    
  //Article queries
  const { commentsData, isLoading } = useArticleQueries(article);

  //comment mutations
  const {
    likeCommentMutation,
    commentMutation
  } = useCommentMutations(article?.id);
  const { register: registerComment, handleSubmit: handleSubmitComment, reset: resetComment } = useForm<any>();
  const { register: registerReply, handleSubmit: handleSubmitReply, reset: resetReply } = useForm<any>();
  const onSubmitComment = async (data: any) => {
    await commentMutation.mutateAsync({ content: data.content });
    resetComment()
  };
  
  const onSubmitReply = async (data: any, parentId: string) => {
    await commentMutation.mutateAsync({
      content: data.content,
      parentId
    });
    resetReply();
    setActiveReplyId(null);
  };
  
  const handleLikeComment = async (comment: any) => {
    if (!token) {
      navigate('/login');
      return;
    }
    await likeCommentMutation.mutateAsync(comment);
  };
  
  console.log(commentsData)
  return (
    <section className="mt-8 border-t pt-8" id='comments-preview'>

    <h3 className="font_montserrat font-semibold my-4">Comments ({commentsData?.data.length || 0})</h3>


    {/* Comment Input */}
    {
        token && (

            <div className="flex gap-2 mb-8">
            {/* Usaer's image */}
            <Avatar className="w-6 h-6">
              <AvatarImage src={userInfo?.data.avatar || "/placeholder.svg"} />
              <AvatarFallback>{userInfo?.data.name}</AvatarFallback>
            </Avatar>
            <CommentInput handleForm={handleSubmitComment(onSubmitComment)} inputRegister={{ ...registerComment('content', { required: true }) }} placeholder={'What are your thoughts?'} className={'min-h-[100px]'} buttonText={commentMutation.isPending ? <SecondaryLoader size={6} color={"bg-green-700"}/> : <MessageCircleMore className="w-6 h-6 text-green-600"/>} />
          </div>
      
        )
    }
    {/* Comments Preview List */}
    <motion.section className="space-y-6">
      <AnimatePresence>
        {!isLoading ? commentsData?.data.slice(0, 2).map((comment: any) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex gap-3"
          >

            <div className="flex-1 space-y-1">
              {/* comment info */}
              <div className="flex gap-3">
              <CommentCard comment={comment} handleLike={() => handleLikeComment(comment)}  isReply={true} activeReply={activeReplyId} handleActiveReply={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}/>
              </div>
           

              {/* Replies Section - Only visible when activeReplyId matches */}
              {activeReplyId === comment.id && (
                <div className="mt-4 ml-8 space-y-4">
                    
                  {/* Reply Form */}
                  {token &&
                  <CommentInput handleForm={handleSubmitReply((data) => onSubmitReply(data, comment.id))} inputRegister={{ ...registerReply('content', { required: true }) }} placeholder={`Reply to ${comment.User?.name}...`} className={'min-h-[50px]'} buttonText={commentMutation.isPending ? <SecondaryLoader size={6} color={"bg-green-700"}/> : <MessageCircleMore className="w-6 h-6 text-green-600"/>}  /> }



                  {/* Existing Replies */}
                  {comment.other_comments.map((reply: any) => (

                    <div key={reply.id} className="border-l-2 pl-4">
                      <div className='flex gap-3'>
                        <CommentCard comment={reply} handleLike={() => handleLikeComment(reply)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )) : <div className="space-y-8">
          {[1, 2, 3].map((item) => (
            <CommentSkeleton id={item}/>
          ))}
        </div>}
      </AnimatePresence>
    </motion.section>

    {/* See all responses sheet */}
    <Sheet>
      <SheetTrigger asChild>
        <button className=" font_opensans my-2 text-sm text-green-600 font-semibold rounded underline px-1 py-2">
          See more ({commentsData?.data.length})
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font_opensans underline">Responses ({commentsData?.data.length || 0})</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          <div className="space-y-6 pr-4 w-full">
            {commentsData?.data.map((comment: any) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3"
              >
                 <div className="space-y-1 sm:w-[400px]">
              {/* comment info */}
              <div className="flex gap-3">
              <CommentCard comment={comment} handleLike={() => handleLikeComment(comment)}  isReply={true} activeReply={activeReplyId} handleActiveReply={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}/>
              </div>
           

              {/* Replies Section - Only visible when activeReplyId matches */}
              {activeReplyId === comment.id && (
                <div className="mt-4 ml-8 space-y-4">
                    
                  {/* Reply Form */}
                  {token &&
                  <CommentInput handleForm={handleSubmitReply((data) => onSubmitReply(data, comment.id))} inputRegister={{ ...registerReply('content', { required: true }) }} placeholder={`Reply to ${comment.User?.name}...`} className={'min-h-[50px]'} buttonText={commentMutation.isPending ? <SecondaryLoader size={6} color={"bg-green-700"}/> : <MessageCircleMore className="w-6 h-6 text-green-600"/>}  /> }



                  {/* Existing Replies */}
                  {comment.other_comments.map((reply: any) => (

                    <div key={reply.id} className="border-l-2 pl-4">
                      <div className='flex gap-3'>
                        <CommentCard comment={reply} handleLike={() => handleLikeComment(reply)} />
                      </div>
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
  )
}

export default ArticleComment