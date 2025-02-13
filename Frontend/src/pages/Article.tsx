/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFetchQuery } from '@/hooks/useFetchQuery';
import useTokenStore from '@/store/TokenStore';
import BounceLoader from '@/Components/BounchLoader';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react'
import {  useNavigate, useParams } from 'react-router-dom';
import { IArticle, IComment, ILike, IUser } from '@/Interfaces/EntityInterface';
import { format } from 'date-fns';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import ArticleCardPositionVertical from '@/Components/Article/ArticleCardPositionVertical';
import { useFollowMutations } from '@/Components/Article/ArticlePage/hooks/useFollowMutations';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useArticleQueries } from '@/Components/Article/ArticlePage/hooks/useArticleQueries';
import ArticleComment from '@/Components/Article/ArticlePage/ArticleComment';


interface IArticleWithUser {
  User: IUser;
  likes: ILike[];
  comments: IComment[];
  content: string;
  created_at: string;
  id: string;
  is_published: boolean;
  published_at: string | null;
  short_preview: string | null;
  slug: string | null;
  thumbnail: string | null;
  title: string | null;
  updated_at: string | null;
  views: number;
  author_id: string;
  estimate_reading_time: number;
  isFollowing: boolean;
}
interface ArticleResponse {
  data: IArticleWithUser;
}



const Article = () => {
  const navigate = useNavigate();
  const { domain, slug } = useParams();
  const token = useTokenStore((state) => state.token);
  const { fetchRequest } = useFetchQuery();

  const [isLiked, setIsLiked] = useState(false);

  //logged in user info
  const userInfo = useUserInfo();
  //Article info
  const { data: article, isLoading } = useQuery<ArticleResponse>({
    queryKey: ['article', domain, slug],
    queryFn: async () => {
      return await fetchRequest(
        `${token ? `articles/${domain}/${slug}?u=${userInfo?.data.id}` : `articles/${domain}/${slug}`}`,
        'GET',
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      ) as ArticleResponse;
    }
  });

  //Following state
  const [following, setFollowing] = useState(!isLoading && article?.data.isFollowing);

  //Follow/unfollow mutations
  const { followMutation, unfollowMutation } = useFollowMutations(domain, slug, setFollowing, article?.data.User.id);
  //Article queries
  const { likeMutation, commentsData } = useArticleQueries(article?.data,setIsLiked, isLiked );

  // article Like
  const handleLike = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    await likeMutation.mutateAsync();
  };
  //Follow/Unfollow toggle
  const handleFollowToggle = async () => {
    if (following) {
      await unfollowMutation.mutateAsync();
    } else {
      await followMutation.mutateAsync();
    }
  };

  useEffect(() => {
    setFollowing(article?.data.isFollowing);
  }, [commentsData, article?.data.isFollowing, isLoading])
  if (isLoading) return <BounceLoader />;
  if (!article?.data) return <div className="text-center py-8">Article not found</div>;
  return (
    <article className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <header className="space-y-4">

        {/* Author info */}
        <div className="flex_between_center pt-2">
          <div className="flex_start_center gap-3">
            {/* Author image and info with navigation */}
            <div className="w-10 h-10 pointer rounded-full overflow-hidden" onClick={() => navigate(`/profile/${article?.data?.User?.domain}`)}>
              <img src={article?.data?.User?.avatar || "/placeholder.svg"} alt="Author avatar" className="w-full h-full object-cover" />
            </div>
            <div className='space-y-1'>
              <p className="text-sm font_lato space-x-2 flex_start_center">
                <span className='user_name' onClick={() => navigate(`/profile/${article?.data?.User?.domain}`)}>
                  {article?.data?.User?.name}
                </span>
                {userInfo?.data.domain != article.data.User.domain && (
                  <>
                    <span className='text-gray-500'>·</span>
                    <button
                      onClick={handleFollowToggle}
                      className='text-green-600 hover:underline font-semibold'
                    >
                      {following ? "Following" : "Follow"}
                    </button></>
                )}

              </p>

              <div className="flex items-center gap-2">
                {/* Article like comment buttons */}
                <p className='flex  gap-2'>
                  <span className='flex gap-2'>
                    <button
                      onClick={handleLike}
                      disabled={likeMutation.isPending}
                      className=" flex gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                    >

                      <ThumbsUp className={`${isLiked ? "text-blue-600" : ""} w-4 h-4 hover:text-blue-600 inline-block text-gray-500`} />
                      <span>{article?.data.likes?.length || 0}</span>
                    </button>


                    <a href='#comments-preview' className="flex font-sm  gap-1 text-gray-500 hover:text-gray-700">
                      <MessageCircle className='w-4 h-4 inline-block' />
                      <span className='text-sm'>{commentsData?.data.length || '...'}</span>
                    </a>
                  </span>

                </p>

                <span className='text-gray-500 '>·</span>
                {/* Article read_time and date */}
                <p className='text-gray-600 font_montserrat text-xs space-x-2 flex_start_center'>
                  <span >{article?.data.estimate_reading_time && `${article?.data.estimate_reading_time} min read`}</span>
                  <span>·</span>
                  <span>{format(new Date(article?.data?.created_at), 'MMM dd, yyyy')}</span>

                </p>


              </div>
            </div>
          </div>
        </div>
      </header>

      <hr className='my-4' />


      <div className='space-y-2'>
        <h1 className="text-2xl font-semibold italic font_montserrat">
          {article?.data?.title}
        </h1>

        <p className="text-gray-500 text-sm font-semibold font_opensans">{article?.data?.short_preview}</p>

      </div>

      <div className='my-4'>
        <img src={article?.data.thumbnail as string} alt="" />
      </div>

      {/* Article content */}
      <div className="prose max-w-none mt-8 space-y-6 article" dangerouslySetInnerHTML={{ __html: article?.data.content }} />

      {/* Comments Section */}
      <ArticleComment article={article.data}/>
      {/* User's articles */}
      <section className='my-8 space-y-6'>
        <h2 className="text-xl font-semibold w-full">More from {article?.data.User?.name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {article?.data.User.articles.slice(0, 4).map((article: IArticle) => (
            <div key={article.id}>
              <ArticleCardPositionVertical article={article} />

            </div>
          ))}
        </div>
        <button className="mt-6 bg-green-500 text-white px-4 py-2 rounded text-xs font-medium" onClick={() => navigate(`/${article?.data.User?.domain}`)}>
          See all from {article?.data.User?.name}
        </button>
      </section>

      {/* Recommended articles */}
      <section className='my-8 space-y-6'>
        <h2 className="text-xl font-semibold w-full">Recommended for you</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {article?.data.User.articles.slice(0, 4).map((article: IArticle) => (
            <div key={article.id}>
              <ArticleCardPositionVertical article={article} />
            </div>
          ))}
        </div>
      </section>


    </article>
  )
}

export default Article





