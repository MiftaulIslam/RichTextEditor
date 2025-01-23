import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { IArticleResponse } from "@/Interfaces/ArticleInterfaces";
import useTokenStore from "@/store/TokenStore";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import ArticlesList from "./ArticlesList";
import BounceLoader from "@/Components/BounchLoader";

const ITEMS_PER_PAGE = 10;

const ArticlesLayout = () => {
    const token = useTokenStore((state) => state.token);
    const { fetchRequest } = useFetchQuery<IArticleResponse>();
    const { ref, inView } = useInView();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['articles'],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await fetchRequest(
                `articles?page=${pageParam}&limit=${ITEMS_PER_PAGE}&isPublished=true`,
                "GET",
                null,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.data.pagination.page < lastPage.data.pagination.pages) {
                return lastPage.data.pagination.page + 1;
            }
            return undefined;
        },
    });

    React.useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

    if (status === 'loading') return <BounceLoader />;
    if (status === 'error') return <div>Error loading articles</div>;
    if (!data) return null;

    return (
        <main className="p-6 min-h-screen">
            <div className="mx-auto max-w-4xl">
                <ArticlesList 
                    articles={data.pages.flatMap(page => page.data.articles)}
                    observerRef={ref}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                />
            </div>
        </main>
    );
};

export default ArticlesLayout;
