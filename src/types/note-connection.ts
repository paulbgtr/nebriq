export type NoteConnection = {
  id: string;
  note_id_from: string;
  note_id_to: string;
  created_at?: Date;
};

export type CreateNoteConnection = Omit<NoteConnection, "id">;
