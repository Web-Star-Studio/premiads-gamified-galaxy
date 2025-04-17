
export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  imageUrl: string;
  slug: string;
  featured?: boolean;
}

export interface Category {
  name: string;
  count: number;
}
