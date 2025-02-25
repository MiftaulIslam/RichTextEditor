/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import useTokenStore from "@/store/TokenStore";
import TextLoader from "@/widgets/Icons/TextLoader";
import { IArticle } from "@/Interfaces/EntityInterface";
import { format } from "date-fns";
import { IArticleResponse } from "@/Interfaces/ResponseInterface";
import { MoreVertical, Edit, Trash, Link } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog"
import { Skeleton } from "../ui/skeleton";
import { useUserInfo } from "@/hooks/useUserInfo";

const Home = () => {
  // Separate state for dialog and dropdown
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const { userId } = useOutletContext<{ userId: string }>();
  const userInfo = useUserInfo();
  const isOwn = userInfo?.data.id == userId;
  const token = useTokenStore((state) => state.token);
  const { fetchRequest } = useFetchQuery();

  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const getArticlesEndpoint = `articles?userId=${userId}&page=${page}&limit=${ITEMS_PER_PAGE}`;

  const { data, isLoading, isFetching } = useQuery<IArticleResponse>({
    queryKey: ["articles", userId, page],
    queryFn: async () => {
      const response = (await fetchRequest(getArticlesEndpoint, "GET", null, {
        headers: { Authorization: `Bearer ${token}` },
      })) as IArticleResponse;
      return response;
    },
  });
  
  const handleSeeMore = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);


  // Open delete dialog
  const openDeleteDialog = useCallback((articleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setArticleToDelete(articleId);
    // Close dropdown when dialog opens
    setOpenDropdown(null);
  }, []);

  // Close delete dialog
  const closeDeleteDialog = useCallback(() => {
    setArticleToDelete(null);
  }, []);

  // Handle delete with proper event handling
  const handleDelete = useCallback(async () => {
    if (!articleToDelete) return;
    
    try {
      await fetchRequest(`articles/${articleToDelete}/d`, "DELETE", null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["articles", userId, page] });
      
      // Close the dialog
      closeDeleteDialog();
      
      // Small delay to ensure clean UI state
      setTimeout(() => {
        document.body.click(); // Force any lingering handlers to reset
      }, 100);
      
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  }, [articleToDelete, fetchRequest, token, queryClient, userId, page, closeDeleteDialog]);

  // Prevent event bubbling for any action
  const stopPropagation = useCallback((e:any) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }, []);

  // Handle article click for navigation
  const handleArticleClick = useCallback((articleId: string) => {
    // Your navigation logic here
    console.log("Navigate to article:", articleId);
  }, []);

  // Handle dropdown open state change
  const handleOpenChange = useCallback((open: boolean, articleId: string) => {
    setOpenDropdown(open ? articleId : null);
  }, []);

  // Skeleton loading state
  if (isLoading) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 space-y-8">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="flex justify-between py-8 border-b border-gray-100 items-center gap-4 w-full"
          >
            <div className="w-1/2 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="w-2/6 h-40 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const hasMorePages =
    data?.data?.pagination?.page && data?.data?.pagination?.pages
      ? data.data.pagination.page < data.data.pagination.pages
      : false;

  return (
    <div className="max-w-3xl px-4">
      {data?.data?.articles?.length === 0 ? (
        <div className="text-center text-gray-500">No articles found</div>
      ) : (
        <div className="space-y-8">
          {data?.data.articles.map((article: IArticle) => (
            <article 
              key={article.id} 
              className="cursor-pointer"
              onClick={() => handleArticleClick(article.id)}
            >
              <div className="flex justify-between border-b border-gray-100 items-center gap-4 w-full">
                {article.thumbnail && (
                  <img
                    src={article.thumbnail || ""}
                    alt={article.title || ""}
                    className="w-1/4 rounded max-h-48 m-0 p-0 object-cover"
                  />
                )}
                <div className="w-4/6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xl hover:text-gray-600">
                      {article.title}
                    </h4>
                    {isOwn && (
                      <div onClick={stopPropagation}>
                        <DropdownMenu 
                          open={openDropdown === article.id} 
                          onOpenChange={(open) => handleOpenChange(open, article.id)}
                        >
                          <DropdownMenuTrigger asChild>
                            <button 
                              className="p-2 border-none outline-none"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.nativeEvent.stopImmediatePropagation();
                              }}
                            >
                              <MoreVertical className="h-5 w-5 text-gray-500" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" onCloseAutoFocus={stopPropagation}>
                            <DropdownMenuItem 
                              className="flex items-center gap-2 cursor-pointer" 
                              onClick={stopPropagation}
                            >
                              <Edit className="h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                              onClick={(e) => openDeleteDialog(article.id, e)} 
                              className="flex items-center gap-2 cursor-pointer text-red-600"
                            >
                              <Trash className="h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                              className="flex items-center gap-2 cursor-pointer" 
                              onClick={stopPropagation}
                            >
                              <Link className="h-4 w-4" />
                              <span>Copy Link</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm">
                    {article?.short_preview?.slice(0, 150)}...
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      {format(new Date(article.created_at), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Alert Dialog - Detached from the component tree for cleaner event handling */}
      <AlertDialog 
        open={articleToDelete !== null} 
        onOpenChange={(open) => {
          if (!open) {
            closeDeleteDialog();
            // Force reset any lingering UI state
            setTimeout(() => {
              document.body.click();
            }, 100);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your article.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={stopPropagation}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* See More Button */}
      {hasMorePages && (
        <div className="flex justify-center py-8">
          <button
            onClick={handleSeeMore}
            disabled={isFetching}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          >
            {isFetching ? (
              <span className="flex items-center gap-2">
                <TextLoader />
                Loading...
              </span>
            ) : (
              "See More"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;