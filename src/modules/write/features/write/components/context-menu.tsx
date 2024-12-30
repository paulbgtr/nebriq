import {
  File,
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
  Code,
  Sigma,
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
import { useRef } from "react";
import { useToast } from "@/shared/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { upload } from "@/app/actions/supabase/storage";
import { Bucket } from "@/types/bucket";

type Props = {
  editor: Editor | null;
  children: React.ReactNode;
};

export const EditorContextMenu = ({ children, editor }: Props) => {
  if (!editor) {
    return null;
  }

  const { user } = useUser();

  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    bucket: Bucket
  ) => {
    const file = e.target.files?.[0];
    const userId = user?.id;

    if (!file || !userId) {
      toast({
        title: "Error",
        description: "File not found",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      const { url } = await upload(file, userId, bucket);

      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleFileUpload(e, "images")
        }
        accept="image/*"
        className="hidden"
      />
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
                onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
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
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
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

          <ContextMenuItem
            onClick={() => editor.chain().focus().setCodeBlock().run()}
          >
            <Code className="w-4 h-4 mr-2" />
            Code Block
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              editor
                .chain()
                .focus()
                .insertContent("$$")
                .setTextSelection(editor.state.selection.from + 1)
                .run();
            }}
          >
            <Sigma className="w-4 h-4 mr-2" />
            Math Expression
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <Paperclip className="w-4 h-4 mr-2" />
              Insert
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem onClick={() => fileInputRef.current?.click()}>
                <ImagePlus className="w-4 h-4 mr-2" />
                Upload Image
              </ContextMenuItem>
              <ContextMenuItem>
                <File className="w-4 h-4 mr-2" />
                Add Document
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
    </>
  );
};
