// Using JSONPlaceholder structure
export interface DashboardPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface DashboardData {
  posts?: DashboardPost[];
  totalPosts?: number;
}