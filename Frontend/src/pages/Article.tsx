/* eslint-disable @typescript-eslint/no-explicit-any */

import { NavigateFunction } from 'react-router-dom';

interface IArticleWithUser {
  User: IUser;
  likes: ILike[]|any;
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

interface ArticleHeaderProps {
  article: IArticleWithUser;
  userInfo: IUser | any;
  following: boolean;
  isLike: boolean;
  commentsCount: number;
  onFollowToggle: () => void;
  onLike: () => void;
  navigate: NavigateFunction;
}

interface AuthorImageProps {
  author: IUser;
  navigate: NavigateFunction;
}

interface AuthorInfoProps {
  author: IUser;
  userInfo: IUser;
  following: boolean;
  onFollowToggle: () => void;
  navigate: NavigateFunction;
}

interface ArticleMetadataProps {
  article: IArticleWithUser;
  isLike: boolean;
  commentsCount: number;
  onLike: () => void;
}

interface ArticleTitleProps {
  title: string | null;
  shortPreview: string | null;
}

interface ArticleThumbnailProps {
  thumbnail: string | null;
}

interface ArticleContentProps {
  article: IArticleWithUser;
  userinfo: any ;
}

interface UserArticlesProps {
  user: IUser;
  navigate: NavigateFunction;
}

interface RecommendedArticlesProps {
  articles: IArticle[];
}
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Frown, MessageCircle, ThumbsUp } from 'lucide-react';

import { useFetchQuery } from '@/hooks/useFetchQuery';
import useTokenStore from '@/store/TokenStore';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useFollowMutations } from '@/Components/Article/ArticlePage/hooks/useFollowMutations';
import { useArticleQueries } from '@/Components/Article/ArticlePage/hooks/useArticleQueries';

import BounceLoader from '@/Components/BounchLoader';
import ArticleCardPositionVertical from '@/Components/Article/ArticleCardPositionVertical';
import ArticleComment from '@/Components/Article/ArticlePage/ArticleComment';

import { IArticle, IUser,  IComment, ILike } from '@/Interfaces/EntityInterface';
import { toast } from 'sonner';

const Article = () => {
  const navigate = useNavigate();
  const { domain, slug } = useParams();
  const token = useTokenStore((state) => state.token);
  const { fetchRequest } = useFetchQuery();
  const userInfo = useUserInfo();

  const [following, setFollowing] = useState(false);
  const [isLike, setIsLike] = useState(false);

  const { data: article, isLoading } = useQuery<ArticleResponse>({
    queryKey: ['article', domain, slug],
    queryFn: () => fetchArticle(),
  });

  const { followMutation, unfollowMutation } = useFollowMutations(domain, slug, setFollowing, article?.data.User.id);
  const { likeMutation, commentsData } = useArticleQueries(article?.data);

  useEffect(() => {
    if (article?.data) {
      setFollowing(article.data.isFollowing);
      setIsLike(article.data.likes?.some((like: any) => like.user_id === userInfo?.data.id) || false);
    }
  }, [commentsData, article?.data, userInfo?.data.id]);

  const fetchArticle = async () => {
    const url = token 
      ? `articles/${domain}/${slug}?u=${userInfo?.data.id}`
      : `articles/${domain}/${slug}`;
    return await fetchRequest(url, 'GET', null, { headers: { Authorization: `Bearer ${token}` } }) as ArticleResponse;
  };
  const handleLike = async () => {
    if (!token ) {
      toast("Unauthorize action detected", {
        description: "Please login to access this feature.",
        cancel: {
          label: "close",
          onClick: () => console.log("close"),
        },
      })
      return;
    }
    else if(userInfo?.data.isActive == false){
      toast("Unauthorize action detected", {
        description: "Please verify your email to access this feature.",
        cancel: {
          label: "close",
          onClick: () => console.log("close"),
        },
      })
      return;
    }
    setIsLike((prevIsLike) => !prevIsLike);
    updateArticleLikes();

    try {
      await likeMutation.mutateAsync();
    } catch {
      setIsLike((prevIsLike) => !prevIsLike);
      updateArticleLikes();
    }
  };

  const updateArticleLikes = () => {
    if (article && article.data) {
      article.data = {
        ...article.data,
        likes: isLike
          ? article.data.likes.filter((like: any) => like.user_id !== userInfo?.data.id)
          : [...(article.data.likes ?? []), { user_id: userInfo?.data.id }],
      };
    }
  };

  const handleFollowToggle = async () => {
    if (!token ) {
      toast("Unauthorize action detected", {
        description: "Please login to access this feature.",
        cancel: {
          label: "close",
          onClick: () => console.log("close"),
        },
      })
      return;
    }
    else if(userInfo?.data.isActive == false){
      toast("Unauthorize action detected", {
        description: "Please verify your email to access this feature.",
        cancel: {
          label: "close",
          onClick: () => console.log("close"),
        },
      })
      return;
    }
    if (following) {
      await unfollowMutation.mutateAsync();
    } else {
      await followMutation.mutateAsync();
    }
  };

  if (isLoading) return <BounceLoader />;
  if (!article?.data) return <div className="text-center py-8">Article not found</div>;

  return (
    <article className="max-w-3xl mx-auto px-4 py-6 ">
      <ArticleHeader 
        article={article.data} 
        userInfo={userInfo?.data} 
        following={following} 
        isLike={isLike}
        commentsCount={commentsData?.data.length || 0}
        onFollowToggle={handleFollowToggle}
        onLike={handleLike}
        navigate={navigate}
      />
      <ArticleContent article={article.data} userinfo={userInfo} />
      <ArticleComment article={article.data} />
      <UserArticles user={article.data.User} navigate={navigate} />
      <RecommendedArticles articles={article.data.User.articles} />
    </article>
  );
};

const ArticleHeader: React.FC<ArticleHeaderProps> = ({ article, userInfo, following, isLike, commentsCount, onFollowToggle, onLike, navigate }) => (
  <header className="space-y-4">
    <div className="flex_between_center pt-2">
      <div className="flex_start_center gap-3">
        <AuthorImage author={article.User} navigate={navigate} />
        <AuthorInfo 
          author={article.User} 
          userInfo={userInfo} 
          following={following} 
          onFollowToggle={onFollowToggle} 
          navigate={navigate}
        />
      </div>
    </div>
    <ArticleMetadata 
      article={article} 
      isLike={isLike} 
      commentsCount={commentsCount}
      onLike={onLike}
    />
    <hr className='my-4' />
    <ArticleTitle title={article.title} shortPreview={article.short_preview} />
    <ArticleThumbnail thumbnail={article.thumbnail} />
  </header>
);

const AuthorImage: React.FC<AuthorImageProps> = ({ author, navigate }) => (
  <div className="w-10 h-10 pointer rounded-full overflow-hidden" onClick={() => navigate(`/profile/${author.domain}`)}>
    <img src={author.avatar || "/placeholder.svg"} alt="Author avatar" className="w-full h-full object-cover" />
  </div>
);

const AuthorInfo: React.FC<AuthorInfoProps> = ({ author, userInfo, following, onFollowToggle, navigate }) => (
  <div className='space-y-1'>
    <p className="text-sm font_lato space-x-2 flex_start_center">
      <span className='user_name cursor-pointer hover:underline' onClick={() => navigate(`/profile/${author.domain}`)}>
        {author.name}
      </span>
      {userInfo.domain !== author.domain && (
        <>
          <span className='text-gray-500'>·</span>
          <button onClick={onFollowToggle} className='text-green-600 hover:underline font-semibold'>
            {following ? "Following" : "Follow"}
          </button>
        </>
      )}
    </p>
  </div>
);

const ArticleMetadata: React.FC<ArticleMetadataProps> = ({ article, isLike, commentsCount, onLike }) => (
  <div className="flex items-center gap-2">
    <p className='flex gap-2'>
      <button
        onClick={onLike}
        className={`${isLike ? "text-blue-600 hover:text-gray-600" : "text-gray-600 hover:text-blue-600"} flex gap-1 text-sm transition-colors`}
      >
        <ThumbsUp className="w-4 h-4 inline-block" />
        <span>{article.likes?.length || 0}</span>
      </button>
      <a href='#comments-preview' className="flex font-sm gap-1 text-gray-500 hover:text-gray-700">
        <MessageCircle className='w-4 h-4 inline-block' />
        <span className='text-sm'>{commentsCount}</span>
      </a>
    </p>
    <span className='text-gray-500'>·</span>
    <p className='text-gray-600 font_montserrat text-xs space-x-2 flex_start_center'>
      <span>{article.estimate_reading_time && `${article.estimate_reading_time} min read`}</span>
      <span>·</span>
      <span>{format(new Date(article.created_at), 'MMM dd, yyyy')}</span>
    </p>
  </div>
);

const ArticleTitle: React.FC<ArticleTitleProps> = ({ title, shortPreview }) => (
  <div className='space-y-2'>
    <h1 className="text-2xl font-semibold italic font_montserrat">{title}</h1>
    <p className="text-gray-500 text-sm font-semibold font_opensans">{shortPreview}</p>
  </div>
);

const ArticleThumbnail: React.FC<ArticleThumbnailProps> = ({ thumbnail }) => (
  <div className='my-4'>
    {thumbnail && 
    <img src={thumbnail} alt="" />
    }
  </div>
);

const ArticleContent: React.FC<ArticleContentProps> = ({ article, userinfo }) => {
  if(userinfo?.data.isActive){return (
    <div className="prose max-w-none mt-8 space-y-6 article" dangerouslySetInnerHTML={{ __html: article.content }} />
  )}else{
    const halfContent = article.content.slice(0, Math.ceil(article.content.length / 2));
    return (
      <>
      <div className='relative'>
        <div className='flex items-center'>

        <div className="prose max-w-none mt-8 space-y-6 article" dangerouslySetInnerHTML={{ __html: halfContent }}/>
        <span className='prose max-w-none mt-8 space-y-6 article'>...</span>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-white to-transparent pointer-events-none" />
       
      </div>
      <div className='text-center'>
        
      <p className="text-lg font-semibold text-gray-600 py-4 flex items-center justify-center"><Frown />Activate your account to gain full access</p>
      <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-600 transition-colors">
            Activate Account
          </button>
      </div>
   
      </>
    )
  }
 ;}

const UserArticles: React.FC<UserArticlesProps> = ({ user, navigate }) => (
  user.articles.length > 0 && (
    <section className='my-8 space-y-6'>
      <h2 className="text-xl font-semibold w-full">More from {user.name}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {user.articles.slice(0, 4).map((article: IArticle) => (
          <ArticleCardPositionVertical key={article.id} article={article} />
        ))}
      </div>
      <button className="mt-6 bg-green-500 text-white px-4 py-2 rounded text-xs font-medium" onClick={() => navigate(`/${user.domain}`)}>
        See all from {user.name}
      </button>
    </section>
  )
);

const RecommendedArticles: React.FC<RecommendedArticlesProps> = ({ articles }) => (
  <section className='my-8 space-y-6'>
    <h2 className="text-xl font-semibold w-full">Recommended for you</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {articles.slice(0, 4).map((article: IArticle) => (
        <ArticleCardPositionVertical key={article.id} article={article} />
      ))}
    </div>
  </section>
);

export default Article;






