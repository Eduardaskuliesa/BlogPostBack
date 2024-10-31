export interface Author {
  id: string;
  name: string;
  email: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  shortDescription: string;
  authorId: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}
