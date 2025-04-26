import { Editor } from "@tiptap/react";

/**
 * Reusable function to handle image file upload and insert it into the editor.
 * @param file - The image file to upload.
 * @param editor - The editor instance (e.g., Tiptap editor).
 * @param range - The range to delete before inserting the image (optional).
 */
export const uploadImageToEditor = (
    file: File,
    editor: Editor,
    range?: { from: number; to: number }
  ): void => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const imageUrl = readerEvent.target?.result as string;
      const chain = editor.chain().focus();
      if (range) {
        chain.deleteRange(range);
      }
      chain.setImage({ src: imageUrl }).run();
    };
    reader.readAsDataURL(file);
  };