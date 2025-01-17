import { useEffect, useState } from "react";
import { Sidebar } from "../Components/TextEditor/Sidebar";
// import { Toolbar } from "../Components/TextEditor/Toolbar";
import Editor from "@/Components/TextEditor/Editor";
import Toolbar from "@/Components/TextEditor/Toolbar";

const TextEditor = () => {
  const [content, setContent] = useState("<p style='font-size: 12px;'>Start typing...</p>");
  const [isBoldActive, setIsBoldActive] = useState(false);
  const [isUnderlineActive, setIsUnderlineActive] = useState(false);
  const [isItalicActive, setIsItalicActive] = useState(false);
  
  useEffect(() => {
    // Check if bold, italic, or underline is active when the editor is updated
    setIsBoldActive(document.queryCommandState('bold'));
    setIsUnderlineActive(document.queryCommandState('underline'));
    setIsItalicActive(document.queryCommandState('italic'));
  }, [content]);

  const handleBold = () => {
    document.execCommand('bold');
    setIsBoldActive(document.queryCommandState('bold'));
  };
  const handleUnderline = () => {
    document.execCommand('underline');
    setIsBoldActive(document.queryCommandState('underline'));
  };
  const handleItalic = () => {
    document.execCommand('italic');
    setIsBoldActive(document.queryCommandState('italic'));
  };
  const handleOrderList = () => {
    document.execCommand('insertOrderedList');

  };

  const handleUnorderList = () => {
    document.execCommand('insertUnorderedList');
  };
  const handleHeading1 = () => {
    document.execCommand("formatBlock", false, "h1");
  };
  const handleHeading2 = () => {
    document.execCommand("formatBlock", false, "h2");
  };
  const handleHeading3 = () => {
    document.execCommand("formatBlock", false, "h3");
  };
const [fontSize, setFontSize] = useState(12);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar content={content} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Toolbar 
        isboldactive={isBoldActive} 
        isunderlineactive = {isUnderlineActive} 
        isitalicactive={isItalicActive} 
        fontsize={fontSize}
        handlebold={handleBold} 
        handleunderline={handleUnderline} 
        handleitalic={handleItalic} 
        handlecontentleft={()=>document.execCommand('justifyLeft')} 
        handlecontentcenter={()=>document.execCommand('justifyCenter')} 
        handlecontentright={()=>document.execCommand('justifyRight')} 
        handleorderlist={handleOrderList }
        handleunorderlist={handleUnorderList }
        handleheading1 = {handleHeading1}
        handleheading2= {handleHeading2}
        handleheading3= {handleHeading3}
        handlefontsize={setFontSize}
        />
      
        <Editor  handleContent ={setContent}/>
        {/* <div dangerouslySetInnerHTML={{ __html: content }}/> */}
 
      </main>
    </div>
  );
};
export default TextEditor;