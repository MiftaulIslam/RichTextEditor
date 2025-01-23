export interface IArticleResponse {
  data: {
    articles: Array<{
      id: string;
      title: string;
      content: string;
      short_preview: string;
      thumbnail: string | null;
      created_at: string;
      updated_at: string;
      views: number;
      likes: number;
      is_published: boolean;
      slug: string;
      User: {
        id: string;
        name: string;
        avatar: string;
        domain: string;
      };
    }>;
    pagination: {
      page: number;
      pages: number;
      total: number;
      limit: number;
    };
  };
  statusCode: number;
  message: string;
} 