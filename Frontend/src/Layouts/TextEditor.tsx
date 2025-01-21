import { useEffect, useState } from "react";
import Editor from "@/Components/TextEditor/Editor";
import Toolbar from "@/Components/TextEditor/Toolbar";
import { useNavigate } from "react-router-dom";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import useTokenStore from "@/store/TokenStore";
interface article {
  id: string;
  author_id: string;
  title: string;
  content: string;
  created_at: string;
  is_published: boolean;
  publishedAt: string | null;
  slug: string;
  thumbnail: string | null;
  updated_at: string;
  views: number;
}
interface articleResponse {
  message: string;
  statusCode: number;
  success: boolean;
  data: article;
}
const TextEditor = () => {
  const [content, setContent] = useState<string>('');
  const [isBoldActive, setIsBoldActive] = useState(false);
  const [isUnderlineActive, setIsUnderlineActive] = useState(false);
  const [isItalicActive, setIsItalicActive] = useState(false);

  const { fetchRequest } = useFetchQuery<articleResponse>();
  const navigate = useNavigate();
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

  const token = useTokenStore((state) => state.token);
  const handleSubmit = async () => {
    const body = { "content": content };
    const headers = { Authorization: `Bearer ${token}` };

    const response = await fetchRequest("articles/p", "POST", body, { headers })
    navigate(`publish/p/${response?.data.id}`)

  }

  return (
    <div className="flex bg-gray-100 h-screen">
      <main className="flex flex-col flex-1 overflow-hidden">
        <div className="flex justify-between items-center gap-4 bg-white px-4 py-2 border-b">
          <Toolbar
            isboldactive={isBoldActive}
            isunderlineactive={isUnderlineActive}
            isitalicactive={isItalicActive}
            handlebold={handleBold}
            handleunderline={handleUnderline}
            handleitalic={handleItalic}
            handlecontentleft={() => document.execCommand('justifyLeft')}
            handlecontentcenter={() => document.execCommand('justifyCenter')}
            handlecontentright={() => document.execCommand('justifyRight')}
            handleorderlist={handleOrderList}
            handleunorderlist={handleUnorderList}
            handleheading1={handleHeading1}
            handleheading2={handleHeading2}
            handleheading3={handleHeading3}
          />
          
          <button
            onClick={handleSubmit}
            disabled={!content}
            className="bg-green-600 hover:bg-green-800 px-8 py-2 rounded font-semibold text-white"
          >
            Proceed to Publish
          </button>

        </div>


        <Editor handleContent={setContent} />

      </main>
    </div>
  );
};
export default TextEditor;