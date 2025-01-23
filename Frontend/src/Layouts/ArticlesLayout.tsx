/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
// import { IArticleResponse } from "@/Interfaces/ArticleInterfaces";
import useTokenStore from "@/store/TokenStore";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import BounceLoader from "@/Components/BounchLoader";
// import ArticlesList from "@/Components/Article/ArticleList";
import ArticleCard from "@/Components/Article/ArticleCard";
import { IArticle } from "@/Interfaces/EntityInterface";
import { motion } from "framer-motion";
import { Skeleton } from "@/Components/ui/skeleton";
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
    ContextMenuTrigger,
} from "@/Components/ui/context-menu"
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 4;

const ArticlesLayout = () => {
    const navigate = useNavigate();
    const token = useTokenStore((state) => state.token);
    const { fetchRequest } = useFetchQuery();
    const { ref, inView } = useInView();
    const fetchArticles = async (pageParam: number) => {
        const response = await fetchRequest(
            `articles?page=${pageParam}&limit=${ITEMS_PER_PAGE}&isPublished=true`,
            "GET",
            null,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response;
    }
    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['articles'],
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
    }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);
    console.log(data)
    if (isLoading) return <BounceLoader />;

    return (
        <main className="p-6 min-h-screen">
            <div className="mx-auto max-w-4xl">
                <div className="space-y-8">
                    {data?.pages.map((page: any) =>
                        page.data.articles.map((article: IArticle) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <ContextMenu>
                                    {/* <ContextMenuTrigger className="rounded-md border border-dashed text-sm"> */}

                                        <ArticleCard article={article} />
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
                                            <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
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
                                        <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
                                        <ContextMenuSeparator />
                                        <ContextMenuRadioGroup value="pedro">
                                            <ContextMenuLabel inset>People</ContextMenuLabel>
                                            <ContextMenuSeparator />
                                            <ContextMenuRadioItem value="pedro">
                                                Pedro Duarte
                                            </ContextMenuRadioItem>
                                            <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
                                        </ContextMenuRadioGroup>
                                    </ContextMenuContent>
                                </ContextMenu>
                            </motion.div>
                        ))
                    )}
                </div>

                <div
                    ref={ref}
                    className="p-4"
                >
                    {isFetchingNextPage && (

                        <div className="space-y-8">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="bg-white border-b animate-pulse overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex items-center mb-4">
                                            <Skeleton className="bg-gray-200 w-7 h-7 rounded-full" />
                                            {/* <div className="bg-gray-200 rounded-full w-7 h-7"></div> */}
                                            <Skeleton className="bg-gray-200 ml-4 rounded w-24 h-4"></Skeleton>
                                        </div>

                                        <Skeleton className="bg-gray-200 mb-2 rounded w-3/4 h-8"></Skeleton>
                                        <div className="space-y-2 mb-4">
                                            <Skeleton className="bg-gray-200 rounded w-full h-4"></Skeleton>
                                            <Skeleton className="bg-gray-200 rounded w-5/6 h-4"></Skeleton>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>

                    )}
                </div>
            </div>
        </main>
    );
};

export default ArticlesLayout;
