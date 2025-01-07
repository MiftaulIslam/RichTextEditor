import { useRef } from "react";

interface EditorProps {
  handleContent: (content: string) => void;
}

const Editor = ({ handleContent }: EditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      handleContent(content);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const parentElement = selection.getRangeAt(0).startContainer.parentElement;
      const parentTag = parentElement ? parentElement.tagName : ""; // Get the parent tag name

      // Check if typing is inside an <ol> or <li>
      if (parentTag !== "OL" && parentTag !== "LI" && parentTag !== "UL") {
        // If it's not inside <ol> or <li>, prevent the default behavior
        e.preventDefault();
        // Insert a <p> tag instead
        document.execCommand("formatBlock", false, "p");
        return
      }
    }
  };


  return (
    <div
      ref={editorRef}
        className="flex-1 p-4 overflow-auto focus:outline-none"
      onInput={handleInput}
      onKeyUp={handleKeyDown}
      contentEditable
    >start typing...</div>
  );
};

export default Editor;
