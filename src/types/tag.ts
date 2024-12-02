export type Tag = {
  id: string;
  user_id: string;
  note_id: string;
  name: string;
  created_at?: Date;
};

export type CreateTag = Omit<Tag, "id">;

export type UpdateTag = Omit<Tag, "user_id">;

// You might want to add this for form handling
export type NewTagFormData = {
  name: string;
};
