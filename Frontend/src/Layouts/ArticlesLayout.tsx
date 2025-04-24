/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import useTokenStore from "@/store/TokenStore";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import ArticleCard from "@/Components/Article/ArticleCard";
import { IArticle } from "@/Interfaces/EntityInterface";
import { motion } from "framer-motion";

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  //   ContextMenuTrigger,
} from "@/Components/ui/context-menu";
import BlogCardSkeleton from "@/widgets/skeletons/blog-card-skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/Components/ui/toggle-group";
import { LayoutGrid, List } from "lucide-react";

const ArticlesLayout = () => {
  const [itemPerPage, setItemPerPage] = useState(10);
  const [isList, setIsList] = useState(true);

  const token = useTokenStore((state) => state.token);
  const { fetchRequest } = useFetchQuery();
  const { ref, inView } = useInView();
  const fetchArticles = async (pageParam: number) => {
    const response = await fetchRequest(
      `articles?page=${pageParam}&limit=${itemPerPage}&isPublished=true`,
      "GET",
      null,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response;
  };
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["articles"],
      queryFn: ({ pageParam }) => fetchArticles(pageParam as number),
      getNextPageParam: (lastPage: any) => {
        if (lastPage.data.pagination.page < lastPage.data.pagination.pages) {
          return lastPage.data.pagination.page + 1;
        }
        return undefined;
      },
      initialPageParam: 1,
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage, itemPerPage]);

  console.log(`isList: ${isList}`)
  console.log(`itemPerPage: ${itemPerPage}`)
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl">
        <div className="space-y-8">

          <div className="w-full p-1 rounded-lg flex flex-wrap justify-between items-center gap-4">

            {/* toggle view */}
            <ToggleGroup
              type="single"
              className="hidden sm:block"
              value={isList ? "list" : "grid"}
              onValueChange={(value) => setIsList(value === "list")}
              size={"default"}
              variant={"default"}
            >
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>

            {/* item per page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Items per page:
              </span>
              <ToggleGroup
                type="single"
                value={itemPerPage.toString()}
                onValueChange={(value) => setItemPerPage(Number(value))}
                size={"default"}
                variant={"default"}
              >
                <ToggleGroupItem value="10" aria-label="10 items per page">
                  10
                </ToggleGroupItem>
                <ToggleGroupItem value="20" aria-label="20 items per page">
                  20
                </ToggleGroupItem>
                <ToggleGroupItem value="50" aria-label="50 items per page">
                  50
                </ToggleGroupItem>
                <ToggleGroupItem value="100" aria-label="100 items per page">
                  100
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
          
          {!isLoading ? (
            <div className={`${!isList && "grid grid-cols-1 md:grid-cols-2 gap-4"}`}>
              {
                
            data?.pages.map((page: any) =>
              page.data.articles.map((article: IArticle) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ContextMenu>
                    {/* <ContextMenuTrigger className="rounded-md border border-dashed text-sm"> */}
                    
                    <div className={`${isList && "max-w-2xl mx-auto "}`}>
                      <ArticleCard article={article} isList={isList} />
                    </div>
                    {/* </ContextMenuTrigger> */}
                    <ContextMenuContent className="w-64">
                      <ContextMenuItem inset>
                        Back
                        <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                      </ContextMenuItem>
                      <ContextMenuItem inset disabled>
                        Forward
                        <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                      </ContextMenuItem>
                      <ContextMenuItem inset>
                        Reload
                        <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                      </ContextMenuItem>
                      <ContextMenuSub>
                        <ContextMenuSubTrigger inset>
                          More Tools
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent className="w-48">
                          <ContextMenuItem>
                            Save Page As...
                            <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
                          </ContextMenuItem>
                          <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                          <ContextMenuItem>Name Window...</ContextMenuItem>
                          <ContextMenuSeparator />
                          <ContextMenuItem>Developer Tools</ContextMenuItem>
                        </ContextMenuSubContent>
                      </ContextMenuSub>
                      <ContextMenuSeparator />
                      <ContextMenuCheckboxItem checked>
                        Show Bookmarks Bar
                        <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
                      </ContextMenuCheckboxItem>
                      <ContextMenuCheckboxItem>
                        Show Full URLs
                      </ContextMenuCheckboxItem>
                      <ContextMenuSeparator />
                      <ContextMenuRadioGroup value="pedro">
                        <ContextMenuLabel inset>People</ContextMenuLabel>
                        <ContextMenuSeparator />
                        <ContextMenuRadioItem value="pedro">
                          Pedro Duarte
                        </ContextMenuRadioItem>
                        <ContextMenuRadioItem value="colm">
                          Colm Tuite
                        </ContextMenuRadioItem>
                      </ContextMenuRadioGroup>
                    </ContextMenuContent>
                  </ContextMenu>
                </motion.div>
              ))
            )
              }
            </div>
          ) : (
            <BlogCardSkeleton item_per_page={itemPerPage} />
          )}
        </div>

        <div ref={ref} className="p-4">
          {isFetchingNextPage && (
            <BlogCardSkeleton item_per_page={itemPerPage} />
          )}
        </div>
      </div>
    </main>
  );
};

export default ArticlesLayout;
