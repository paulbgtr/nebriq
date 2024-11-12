import { DetailedNote } from "./detailed-note";
import { Note } from "./note";

const DUMMY_NOTES = [
  {
    id: 1,
    title: "Meeting Notes",
    content: "Discuss project timeline and deliverables",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: 2,
    title: "Shopping List",
    content: "Milk, eggs, bread, fruits",
    createdAt: new Date("2024-01-16"),
  },
  {
    id: 3,
    title: "Ideas",
    content: "New feature suggestions for the app",
    createdAt: new Date("2024-01-17"),
  },
];

export const NoteList = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {DUMMY_NOTES.map((note) => (
        <DetailedNote key={note.id} {...note}>
          <Note {...note} />
        </DetailedNote>
      ))}
    </div>
  );
};
