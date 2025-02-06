export interface Card {
  id: number;
  title: string;
  list_id: number;
  position: number;
  color: string;
  description: string;
  custom: any;
  users: number[];
  created_at: number;
}
