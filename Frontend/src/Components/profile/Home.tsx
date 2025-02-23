import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import useTokenStore from "@/store/TokenStore";
import BounceLoader from "../BounchLoader";
// import { format } from "date-fns";
import TextLoader from "@/widgets/Icons/TextLoader";
import { IArticle } from "@/Interfaces/EntityInterface";
import { format } from 'date-fns';
import { IArticleResponse } from "@/Interfaces/ResponseInterface";


const Home = () => {
  const { userId } = useOutletContext<{ userId: string }>();
  
  const token = useTokenStore((state) => state.token);
  const { fetchRequest } = useFetchQuery();
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const endpoint =
     `articles?userId=${userId}`


  const {
    data,
    isLoading,
    isFetching,
  } = useQuery<IArticleResponse>({
    queryKey: ['articles', userId, page],
    queryFn: async () => {
      const response = await fetchRequest(
        `${endpoint}&page=${page}&limit=${ITEMS_PER_PAGE}`,
        "GET",
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      ) as IArticleResponse;
      return response;
    },
  });
console.log(data)
  const handleSeeMore = () => {
    setPage(prev => prev + 1);
  };

  if (isLoading) return <BounceLoader />;

  const hasMorePages = data?.data?.pagination?.page && data?.data?.pagination?.pages 
    ? data.data.pagination.page < data.data.pagination.pages 
    : false;

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      {data?.data?.articles?.length === 0 ? (
        <div className="text-center text-gray-500">No articles found</div>
      ) : (
      <div className="space-y-8">
        {data?.data.articles.map((article:IArticle) => (
          <article key={article.id} className="cursor-pointer" >
           <div className=" flex justify-between py-8 border-b border-gray-100 items-center gap-4 w-full">
           <div className="w-1/2 space-y-4">
           <h2 className="text-xl font-bold hover:text-gray-600">
              {article.title}
            </h2>
            <p className="text-gray-600 text-sm">
              {article?.short_preview?.slice(0, 150)}...
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{ format(new Date(article.created_at), 'MMM dd, yyyy')}</span>
            </div>
           </div>
          {article.thumbnail && (
          //  <div className=" m-0">
            <img src={article.thumbnail || ''} alt={article.title || ''} className="w-2/6 rounded min-h-40 max-h-48 m-0 p-0 object-fit" />
      
          )}

           </div>

          </article>
        ))}
      </div>
      )}

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
              'See More'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
  
  