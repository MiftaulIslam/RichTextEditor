import React from 'react';
import { motion } from "framer-motion";
import ArticleCard from '@/Components/ArticleCard';
import BounceLoader from '@/Components/BounchLoader';
import { IArticleResponse } from '@/Interfaces/ArticleInterfaces';

interface ArticlesListProps {
    articles: IArticleResponse['data']['articles'];
    observerRef: (node?: Element | null) => void;
    hasNextPage?: boolean;
    isFetchingNextPage: boolean;
}

const ArticlesList = ({ articles, observerRef, hasNextPage, isFetchingNextPage }: ArticlesListProps) => {
    return (
        <>
            <div className="space-y-8">
                {articles.map((article) => (
                    <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <ArticleCard article={article} />
                    </motion.div>
                ))}
            </div>

            <div ref={observerRef} className="mt-8 text-center">
                {isFetchingNextPage ? (
                    <BounceLoader />
                ) : hasNextPage ? (
                    <div className="text-gray-500">Loading more articles...</div>
                ) : (
                    <div className="py-10 text-center">
                        <div className="text-gray-500 text-sm">No more articles to show</div>
                        <div className="mt-2 text-gray-400 text-xs">You've reached the end for now</div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ArticlesList;
