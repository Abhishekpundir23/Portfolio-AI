export type Portfolio = {
  id: string;
  user_id: string;
  username: string;
  hook: string;
  problem: string;
  solution: string;
  tech_stack: string[];
  win: string;
  learning: string;
  template: "bold" | "minimal" | "creative";
  repo_url?: string;
  created_at: string;
};
