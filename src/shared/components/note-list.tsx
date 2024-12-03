import { DetailedNote } from "./detailed-note";
import { Note } from "./note";
import { Note as NoteType } from "@/types/note";

type NoteListProps = {
  notes: NoteType[];
};

export const NoteList = ({ notes }: NoteListProps) => {
  const sortedNotes = [...notes].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {sortedNotes.map((note) => (
        <DetailedNote
          key={note.id}
          {...note}
          initialTags={note.tags}
          createdAt={note.created_at}
        >
          <Note {...note} createdAt={note.created_at} />
        </DetailedNote>
      ))}
    </div>
  );
};
