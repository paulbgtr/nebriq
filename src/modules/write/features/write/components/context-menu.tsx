import {
  Heading1,
  Heading2,
  Heading3,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Strikethrough,
  Underline,
  Bold,
  Italic,
  List,
  ListOrdered,
  Paperclip,
  ImagePlus,
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/shared/components/ui/context-menu";
import { Editor } from "@tiptap/react";

type Props = {
  editor: Editor | null;
  children: React.ReactNode;
};

export const EditorContextMenu = ({ children, editor }: Props) => {
  if (!editor) {
    return null;
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Heading1 className="w-4 h-4 mr-2" />
            Text Style
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem
              onClick={() =>
                editor.chain().focus().setHeading({ level: 1 }).run()
              }
            >
              <Heading1 className="w-4 h-4 mr-2" />
              Heading 1
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() =>
                editor.chain().focus().setHeading({ level: 2 }).run()
              }
            >
              <Heading2 className="w-4 h-4 mr-2" />
              Heading 2
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() =>
                editor.chain().focus().setHeading({ level: 3 }).run()
              }
            >
              <Heading3 className="w-4 h-4 mr-2" />
              Heading 3
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuItem
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="w-4 h-4 mr-2" />
          Bold
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="w-4 h-4 mr-2" />
          Italic
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Underline className="w-4 h-4 mr-2" />
          Underline
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="w-4 h-4 mr-2" />
          Strikethrough
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <AlignLeft className="w-4 h-4 mr-2" />
            Alignment
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
            >
              <AlignLeft className="w-4 h-4 mr-2" />
              Left
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
            >
              <AlignCenter className="w-4 h-4 mr-2" />
              Center
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
            >
              <AlignRight className="w-4 h-4 mr-2" />
              Right
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuItem
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="w-4 h-4 mr-2" />
          Bullet List
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="w-4 h-4 mr-2" />
          Numbered List
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Paperclip className="w-4 h-4 mr-2" />
            Insert
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>
              <ImagePlus className="w-4 h-4 mr-2" />
              Upload Image
            </ContextMenuItem>
            <ContextMenuItem>
              <Paperclip className="w-4 h-4 mr-2" />
              Attach File
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
            // onClick={() => {
            //   const url = window.prompt("Enter link URL");
            //   if (url) editor.chain().focus().setLink({ href: url }).run();
            // }}
            >
              <Link className="w-4 h-4 mr-2" />
              Insert Link
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
};
