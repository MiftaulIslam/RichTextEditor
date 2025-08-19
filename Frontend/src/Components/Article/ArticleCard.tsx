import {
  ChevronDown,
  ChevronUp,
  Heart,
  MessageCircle,
} from "lucide-react";
import { IArticle } from "@/Interfaces/EntityInterface";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardFooter } from "@/Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/utils/time-ago";
const ArticleCard = ({
  article,
  isList,
}: {
  article: IArticle;
  isList: boolean;
}) => {
  const navigate = useNavigate();
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const parentComments =
    article.comments &&
    article?.comments.filter((comment) => comment.parent_id == null);

  return (
    <Card className="mb-4 overflow-hidden transition-all duration-200">
      <CardContent
        className="p-4 cursor-pointer"
        onClick={() => navigate(`/${article.User?.domain}/${article.slug}`)}
      >
        {/* Author Section */}
        <div className="flex items-center mb-4 justify-between">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate(`/profile/${article.User?.domain}`)}
          >
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage
                src={(article.User?.avatar as string) || "/placeholder.svg"}
                alt={article.User?.name as string}
              />
              <AvatarFallback>{article.User?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="text-sm hover:underline">{article.User?.name}</p>
          </div>

          <span className="text-sm text-muted-foreground">
            {timeAgo(article.created_at)}
          </span>
        </div>

        {/* Blog Content Section */}
        <div
          className={`flex ${
            isList ? "flex-col sm:flex-row" : "flex-col"
          } gap-4`}
        >
          <div className={`${isList && "sm:w-1/3"} mb-3 sm:mb-0`}>
            <div
              className={`relative ${
                isList ? "h-48 sm:h-28" : "h-48"
              }  w-full rounded-md overflow-hidden`}
            >
              <img
                src={(article.thumbnail as string) || "/placeholder.svg"}
                alt={article.title?.charAt(5)}
                className="object-fill w-full h-full"
              />
            </div>
          </div>
          <div className="sm:w-2/3">
            <h3 className="text-lg mb-1">{article.title}</h3>
            <p className=" text-sm text-muted-foreground">
              {article.short_preview}...
            </p>
          </div>
        </div>
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="flex flex-col px-4 py-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              <span className="text-sm">{article.likes?.length || 0}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center p-0 h-auto"
              onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{parentComments?.length || 0}</span>
              {parentComments &&
                parentComments?.length > 0 &&
                (isCommentsOpen ? (
                  <ChevronUp className="h-4 w-4 " />
                ) : (
                  <ChevronDown className="h-4 w-4 " />
                ))}
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        <div
          className={cn(
            "w-full mt-2 overflow-hidden transition-all duration-200",
            isCommentsOpen ? "max-h-96" : "max-h-0"
          )}
        >
          {parentComments?.slice(0, 3).map((comment) => (
            <div key={comment.id} className="py-2 border-t">
              <div
                className="flex items-center mb-1 cursor-pointer"
                onClick={() => navigate(`/profile/${comment.User.domain}`)}
              >
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage
                    src={comment?.User.avatar || "/placeholder.svg"}
                    alt={comment?.User.name}
                  />
                  <AvatarFallback>
                    {comment?.User.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm hover:underline">{comment?.User.name}</p>
              </div>
              <p className="text-sm pl-8">{comment.content}</p>
            </div>
          ))}
          {parentComments && parentComments?.length > 3 && (
            <Button variant="link" size="sm" className="mt-1 h-auto p-0">
              View all {parentComments?.length} comments
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
