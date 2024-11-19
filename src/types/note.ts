export type Note = {
  id: string;
  user_id: string;
  title?: string;
  content?: string;
  tags?: string[];
  linked_notes?: string[];
  created_at: Date;
};

export type CreateNote = Omit<Note, "id">;

export type UpdateNote = Omit<Note, "user_id">;
