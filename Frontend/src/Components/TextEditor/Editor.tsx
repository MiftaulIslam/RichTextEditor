import { useRef } from "react";

interface EditorProps {
  handleContent: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ handleContent }) => {

  const editorRef = useRef<HTMLDivElement>(null);

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      handleContent(content);
    }
  };
  
  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const parentElement =
        selection.getRangeAt(0).startContainer.parentElement;
      const parentTag = parentElement ? parentElement.tagName : ""; // Get the parent tag name

      // Check if typing is inside an <ol> or <li>
      if (parentTag !== "OL" && parentTag !== "LI" && parentTag !== "UL") {
        // If it's not inside <ol> or <li>, prevent the default behavior
        e.preventDefault();
        // Insert a <p> tag instead
        document.execCommand("formatBlock", false, "p");
        return;
      }
    }
  };
  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent default paste behavior

    // Get the plain text from the clipboard
    const pastedText = e.clipboardData.getData("text/plain");

    // Insert the plain text into the editor
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        selection.deleteFromDocument(); // Remove the current selection
        const textNode = document.createTextNode(pastedText);
        selection.getRangeAt(0).insertNode(textNode);
        selection.collapseToEnd();
      }
    }
  };

  return (
    <div className=" flex-1 p-4 overflow-auto focus:outline-none ">
      <div className="w-full max-w-3xl m-auto h-full ">
        <div
          className="w-full min-h-full editor p-4 overflow-auto focus:outline-none bg-white shadow-xl rounded border-b border-l border-r"
          ref={editorRef}
          onInput={handleInput}
          onKeyUp={handleKeyUp}
          onPaste={handlePaste}
          contentEditable
        />
      </div>
    </div>
  );
};

export default Editor;
