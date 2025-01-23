import React from 'react';
import { ThumbsUp, MessageCircle, Share2, Calendar } from "lucide-react";
import { IArticleResponse } from '@/Interfaces/ArticleInterfaces';
import useTokenStore from '@/store/TokenStore';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { useNavigate } from 'react-router-dom';

interface ArticleCardProps {
    article: IArticleResponse['data']['articles'][0];
}

const ArticleCard = ({ article }: ArticleCardProps) => {
    const navigate = useNavigate();
    const token = useTokenStore((state) => state.token);
    const { fetchRequest } = useFetchQuery();

    const handleLike = async () => {
        try {
            await fetchRequest(
                `articles/${article.id}/like`,
                "POST",
                null,
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error('Error liking article:', error);
        }
    };

    return (
        <div className="bg-white border-b cursor-pointer overflow-hidden" onClick={() => alert(article.slug)} >
            <div className="p-6">
                {/* User Info */}
                <div className="flex items-center mb-4">
                    <img
                        src={article.User.avatar || "/placeholder.svg"}
                        alt={article.User.name}
                        className="rounded-full w-7 h-7 object-cover"
                    />
                    <div className="ml-4">
                        <h2 className="font-bold text-gray-800 text-xs">{article.User.name}</h2>
                    </div>
                </div>

                {/* Article Content */}
                <h3 className="mb-2 font-bold text-2xl text-gray-900">{article.title}</h3>
                <p className="mb-4 text-gray-600">{article.short_preview}</p>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4 mb-4">
                    <button
                        onClick={handleLike}
                        className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-md text-blue-600 transition duration-200"
                    >
                        <ThumbsUp size={16} />
                        <span>{article.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-md text-gray-600 transition duration-200">
                        <MessageCircle size={16} />
                    </button>
                    <button className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-md text-gray-600 transition duration-200">
                        <Share2 size={16} />
                        <span>Share</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-500 text-sm transition duration-200">
                        <Calendar size={16} />
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard; 