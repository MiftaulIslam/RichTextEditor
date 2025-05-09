import { EditorContent } from "@tiptap/react"
import { useState, useEffect, useRef } from "react"
import { EditorToolbar } from "./editor-toolbar"
import { Card, CardContent } from "@/Components/ui/card"
import { BubbleToolbar } from "../../widgets/editor/bubble-toolbar"
import { Button } from "@/Components/ui/button"
import { ArrowBigRight, Plus } from "lucide-react"
import { Editor } from "../../utils/editor/editor"
import { toast } from "sonner"
import useTokenStore from "@/store/TokenStore"
import { useUserInfo } from "@/hooks/useUserInfo"
import { useNavigate } from "react-router-dom"
import { useFetchQuery } from "@/hooks/useFetchQuery"
import { articleResponse } from "@/pages/editor/type"

export function RichTextEditor() {
  
  const userInfo = useUserInfo();
  const { fetchRequest } = useFetchQuery<articleResponse>();
  const navigate = useNavigate();
  
  const [content, setContent] = useState("")
  const [position, setPosition] = useState<{
    top: number
  }>({ top: 0 })
  const containerRef = useRef<HTMLElement | null>(null);
  const editor = Editor({
    content, setContent
  })

  useEffect(() => {
    const updatePosition = () => {
      if (!editor) return;
      if (!containerRef.current) return;
      const container = containerRef.current;
      const { view } = editor;
      const { from } = editor.state.selection;
      const buttonPosition = view.coordsAtPos(from).top - container?.getBoundingClientRect()?.top;
      setPosition({
        top: buttonPosition,
      })
    }

    editor?.on("selectionUpdate", updatePosition)
    editor?.on("update", updatePosition)

    return () => {
      editor?.on("selectionUpdate", updatePosition)
      editor?.on("update", updatePosition)
    }
  }, [editor])

  
  const token = useTokenStore((state) => state.token);
  const handleSubmit = async () => {
    if (!token ) {
      toast("Unauthorize action detected", {
        description: "Please login to access this feature.",
        cancel: {
          label: "close",
          onClick: () => console.log("close"),
        },
      })
      return;
    }
    else if(userInfo?.data.isActive == false){
      toast("Unauthorize action detected", {
        description: "Please verify your email to access this feature.",
        cancel: {
          label: "close",
          onClick: () => console.log("close"),
        },
      })
      return;
    }else if(!content){
      toast("Empty content", {
        description: "Please write something before proceeding.",
        cancel: {
          label: "close",
          onClick: () => console.log("close"),
        },
      })
      return
    }

    
    const body = { "content": content };
    const headers = { Authorization: `Bearer ${token}` };

    const response = await fetchRequest("articles/p", "POST", body, { headers })
    navigate(`/editor/publish/p/${response?.data.id}`)

  }
  
  return (
    <Card className="border shadow-sm relative">
      <EditorToolbar editor={editor} />
      {/* send button */}
      <Button size={'icon'}
      onClick={handleSubmit}
      className='absolute -right-6 top-2 bg-green-600 shadow rounded-full border text-white z-50'>
        <ArrowBigRight className='!w-6 !h-6' />
        </Button>
      <CardContent className="px-4 py-2 relative" ref={containerRef as React.RefObject<HTMLDivElement>}>
        {/* new line button */}
        <Button
          variant="outline"
          size="icon"
          className="shadow rounded-full border"
          onClick={() => editor?.chain().selectParentNode().createParagraphNear().focus().run()}
          style={{
            position: "absolute",
            top: position.top,
            left: `-20px`
          }}
        >
          <Plus width={40} height={40} />
        </Button>
        <div className="prose prose-sm sm:prose-base max-w-none  pl-6">
          {editor && <BubbleToolbar editor={editor} />}
          <EditorContent editor={editor} className="focus:outline-none" />
        </div>
      </CardContent>
    </Card>
  )
}

