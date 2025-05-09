
interface article {
    id: string;
    author_id: string;
    title: string;
    content: string;
    created_at: string;
    is_published: boolean;
    publishedAt: string | null;
    slug: string;
    thumbnail: string | null;
    updated_at: string;
    views: number;
}

export interface articleResponse {
    message: string;
    statusCode: number;
    success: boolean;
    data: article;
}