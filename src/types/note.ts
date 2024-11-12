export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  linked_notes: string[];
  created_at: Date;
};
