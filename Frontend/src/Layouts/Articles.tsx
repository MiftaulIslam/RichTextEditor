import React, { useState } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, MessageCircle, Share2, Calendar } from "lucide-react";

const articlesList = [
    {
        id: 1,
        author: {
            id: 1,
            name: "Nayef Mohammad Farhan Nisar",
            image: "https://i.ibb.co/Vw8tBqr/824bd5800350.png",
        },
        title: "Veganism: Pros and Cons",
        preview: "A detailed look into the benefits and drawbacks of a vegan lifestyle.",
        thumbnail: "https://i.ibb.co.com/mTJWsND/79ce6c655a2f.png",
        content:
            "Veganism is a lifestyle that involves abstaining from the consumption of animal products. This includes meat, dairy, eggs, and other animal-derived ingredients. People choose to follow a vegan diet for various reasons, including ethical concerns, environmental sustainability, and health benefits.",
        timestamp: "2021-09-01T00:00:00Z",
        likes: 120,
        tags: ["Veganism", "Health", "Environment"],
        comments: [
            {
                id: 1,
                author: {
                    name: "Redwan Vai",
                    image: "https://cdn-ilbdfbp.nitrocdn.com/grDmdYDcEeLUVAKVOHtErVIiTlbdEarC/assets/images/optimized/rev-46c6051/redwanhasan.com/wp-content/uploads/2024/08/Redwan_Hasan1-removebg-preview.png",
                },
                content: "This article really opened my eyes to the severity of climate change.",
                timestamp: "2023-07-12T15:00:00Z",
            },
            {
                id: 2,
                author: {
                    name: "Zarin🙂",
                    image: "https://scontent.fdac22-1.fna.fbcdn.net/v/t39.30808-1/455707518_3799108867010405_2923013483668062133_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=107&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeGqD7YDAeFDV6JNvQSevn_M0zw1A7bDKu_TPDUDtsMq70xMRo-LCChXggRke93SEpo-extY223U9IFfsNPHsJz2&_nc_ohc=uzT9qf5YOgQQ7kNvgE8U1FU&_nc_zt=24&_nc_ht=scontent.fdac22-1.fna&_nc_gid=AEejaqNRsaIBQRoDQu605Vr&oh=00_AYDhM0D733fCNmN96WfXiTpNoD7qfZrXCM-NkEJx8CMS2w&oe=67957314",
                },
                content: "Baler article lekhso amar",
                timestamp: "2023-07-12T15:00:00Z",
            },
            {
                id: 3,
                author: {
                    name: "Samiul Islam",
                    image: "https://i.ibb.co/8xjxyZZ/Samiul-Image.jpg",
                },
                content: "This article on climate change is really eye-opening. We all need to act now.",
                timestamp: "2023-07-12T16:00:00Z",
            },
            {
                id: 4,
                author: {
                    name: "Anika Rahman",
                    image: "https://i.ibb.co/2Yt2KKh/Anika-Image.jpg",
                },
                content: "Great read, but I think we need more actionable solutions for coastal cities.",
                timestamp: "2023-07-12T17:30:00Z",
            },
            {
                id: 5,
                author: {
                    name: "Tariq Abdullah",
                    image: "https://i.ibb.co/9vc9dDF/Tariq-Image.jpg",
                },
                content: "The effects of climate change are terrifying. It's time for immediate action!",
                timestamp: "2023-07-12T18:00:00Z",
            },
            {
                id: 6,
                author: {
                    name: "Shahina Yasmin",
                    image: "https://i.ibb.co/Xjb7KfF/Shahina-Image.jpg",
                },
                content: "I appreciate the insight into how climate change affects coastal cities. This needs more attention.",
                timestamp: "2023-07-12T19:00:00Z",
            },
            {
                id: 7,
                author: {
                    name: "Imran Khan",
                    image: "https://i.ibb.co/KmspV7b/Imran-Image.jpg",
                },
                content: "Wow, this article really explains the problem. We need to start thinking about sustainable living.",
                timestamp: "2023-07-12T20:15:00Z",
            },
        ],
    },
    {
        id: 2,
        author: {
            id: 2,
            name: "Miftaul Islam Ariyan",
            image: "https://i.ibb.co/Wsj077d/597e9d22564b.jpg",
        },
        title: "The Impact of Climate Change on Coastal Cities",
        preview: "Explore the ways rising sea levels and extreme weather events affect coastal communities worldwide.",
        thumbnail: "https://i.ibb.co.com/YZL9XD6/9768a128f171.jpg",
        content:
            "Climate change is a pressing issue affecting our planet. Coastal cities are particularly vulnerable due to rising sea levels, increasing storm intensity, and frequent flooding. Cities like Miami, Venice, and Jakarta are already experiencing significant impacts, requiring adaptive solutions to safeguard infrastructure and communities.",
        timestamp: "2023-07-12T14:45:00Z",
        likes: 210,
        tags: ["Veganism", "Health", "Environment"],
        comments: [
            {
                id: 1,
                author: {
                    name: "Redwan Vai",
                    image: "https://cdn-ilbdfbp.nitrocdn.com/grDmdYDcEeLUVAKVOHtErVIiTlbdEarC/assets/images/optimized/rev-46c6051/redwanhasan.com/wp-content/uploads/2024/08/Redwan_Hasan1-removebg-preview.png",
                },
                content: "This article really opened my eyes to the severity of climate change.",
                timestamp: "2023-07-12T15:00:00Z",
            },
            {
                id: 2,
                author: {
                    name: "Zarin🙂",
                    image: "https://scontent.fdac22-1.fna.fbcdn.net/v/t39.30808-1/455707518_3799108867010405_2923013483668062133_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=107&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeGqD7YDAeFDV6JNvQSevn_M0zw1A7bDKu_TPDUDtsMq70xMRo-LCChXggRke93SEpo-extY223U9IFfsNPHsJz2&_nc_ohc=uzT9qf5YOgQQ7kNvgE8U1FU&_nc_zt=24&_nc_ht=scontent.fdac22-1.fna&_nc_gid=AEejaqNRsaIBQRoDQu605Vr&oh=00_AYDhM0D733fCNmN96WfXiTpNoD7qfZrXCM-NkEJx8CMS2w&oe=67957314",
                },
                content: "Baler article lekhso amar",
                timestamp: "2023-07-12T15:00:00Z",
            },
            {
                id: 3,
                author: {
                    name: "Samiul Islam",
                    image: "https://i.ibb.co/8xjxyZZ/Samiul-Image.jpg",
                },
                content: "This article on climate change is really eye-opening. We all need to act now.",
                timestamp: "2023-07-12T16:00:00Z",
            },
            {
                id: 4,
                author: {
                    name: "Anika Rahman",
                    image: "https://i.ibb.co/2Yt2KKh/Anika-Image.jpg",
                },
                content: "Great read, but I think we need more actionable solutions for coastal cities.",
                timestamp: "2023-07-12T17:30:00Z",
            },
            {
                id: 5,
                author: {
                    name: "Tariq Abdullah",
                    image: "https://i.ibb.co/9vc9dDF/Tariq-Image.jpg",
                },
                content: "The effects of climate change are terrifying. It's time for immediate action!",
                timestamp: "2023-07-12T18:00:00Z",
            },
            {
                id: 6,
                author: {
                    name: "Shahina Yasmin",
                    image: "https://i.ibb.co/Xjb7KfF/Shahina-Image.jpg",
                },
                content: "I appreciate the insight into how climate change affects coastal cities. This needs more attention.",
                timestamp: "2023-07-12T19:00:00Z",
            },
            {
                id: 7,
                author: {
                    name: "Imran Khan",
                    image: "https://i.ibb.co/KmspV7b/Imran-Image.jpg",
                },
                content: "Wow, this article really explains the problem. We need to start thinking about sustainable living.",
                timestamp: "2023-07-12T20:15:00Z",
            },
            
        ],
    },
];

const Articles = () => {
    const [articles, setArticles] = useState(articlesList);
    const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
    const [visibleComments, setVisibleComments] = useState<Record<number, boolean>>({});

    const toggleCommentsVisibility = (id: number) => {
        setVisibleComments((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const toggleComments = (id: number) => {
        setExpandedComments((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleLike = (id: number) => {
        setArticles((prevArticles) =>
            prevArticles.map((article) =>
                article.id === id ? { ...article, likes: article.likes + 1 } : article
            )
        );
    };

    return (
        <main className="p-6 min-h-screen">
            <div className="mx-auto max-w-4xl">
                <div className="space-y-8">
                    {articles.map((article) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="bg-white border-b overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <img
                                            src={article.author.image || "/placeholder.svg"}
                                            alt={article.author.name}
                                            className="rounded-full w-7 h-7 object-cover"
                                        />
                                        <div className="ml-4">
                                            <h2 className="font-bold text-gray-800 text-xs">{article.author.name}</h2>
                                        </div>
                                    </div>

                                    <h3 className="mb-2 font-bold text-2xl text-gray-900">{article.title}</h3>
                                    <p className="mb-4 text-gray-600">{article.preview}</p>

                                    <div className="flex items-center space-x-4 mb-4">
                                        <button
                                            onClick={() => handleLike(article.id)}
                                            className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-md text-blue-600 transition duration-200"
                                        >
                                            <ThumbsUp size={16} />
                                            <span>{article.likes}</span>
                                        </button>
                                        <button
                                            onClick={() => toggleCommentsVisibility(article.id)}
                                            className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-md text-gray-600 transition duration-200"
                                        >
                                            <MessageCircle size={16} />
                                            <span>{article.comments.length}</span>
                                        </button>
                                        <button className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-md text-gray-600 transition duration-200">
                                            <Share2 size={16} />
                                            <span>Share</span>
                                        </button>

                                        <button
                                            onClick={() => handleLike(article.id)}
                                            className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-500 text-sm transition duration-200"
                                        >
                                            <Calendar size={16} />
                                            <span>{new Date(article.timestamp).toLocaleDateString()}</span>
                                        </button>
                                    </div>

                                    {visibleComments[article.id] && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <motion.div layout className="space-y-2">
                                                {article.comments
                                                    .slice(0, expandedComments[article.id] ? article.comments.length : 3)
                                                    .map((comment, index) => (
                                                        <motion.div
                                                            key={index}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="flex space-x-3 bg-white shadow-sm p-3 rounded-md"
                                                        >
                                                            <img
                                                                src={comment.author.image || "/placeholder.svg"}
                                                                alt={comment.author.name}
                                                                className="rounded-full w-10 h-10 object-cover"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="flex justify-between items-center">
                                                                    <h4 className="font-semibold text-gray-800">{comment.author.name}</h4>
                                                                    <span className="text-gray-500 text-xs">
                                                                        {new Date(comment.timestamp).toLocaleString()}
                                                                    </span>
                                                                </div>
                                                                <p className="text-gray-600 text-sm">{comment.content}</p>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                            </motion.div>

                                            {/* {article.comments.length > 3 && (
                                                <button
                                                    onClick={() => toggleComments(article.id)}
                                                    className="flex items-center mt-2 text-blue-600 hover:text-blue-700"
                                                >
                                                    {expandedComments[article.id] ? (
                                                        <>
                                                            <ChevronUp size={16} className="mr-1" /> Show Less
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ChevronDown size={16} className="mr-1" /> Show More
                                                        </>
                                                    )}
                                                </button>
                                            )} */}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Articles;
