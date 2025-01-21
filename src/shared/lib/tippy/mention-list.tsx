import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { createNoteConnection } from "@/app/actions/supabase/note_connections";
import { z } from "zod";
import { createNoteConnectionSchema } from "../schemas/note-connection";

interface MentionListProps {
  items: Array<{ id: string; title: string }>;
  command: (params: { id: string }) => void;
  currentNoteId: string;
}

const MentionList = forwardRef<
  { onKeyDown: (params: { event: KeyboardEvent }) => boolean },
  MentionListProps
>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = async (index: number) => {
    const item = props.items[index];

    if (item) {
      props.command({ id: item.title });
    }

    const noteConnection: z.infer<typeof createNoteConnectionSchema> = {
      note_id_from: props.currentNoteId,
      note_id_to: item.id,
    };

    await createNoteConnection(noteConnection);
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="dropdown-menu">
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            className={index === selectedIndex ? "is-selected" : ""}
            key={index}
            onClick={async () => {
              await selectItem(index);
            }}
          >
            {item.title}
          </button>
        ))
      ) : (
        <div className="item">No result</div>
      )}
    </div>
  );
});

MentionList.displayName = "MentionList";

export default MentionList;
