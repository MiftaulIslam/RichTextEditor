
import { useEditor, EditorContent } from "@tiptap/react"
import { useState, useCallback, useEffect, useRef } from "react"
import { EditorToolbar } from "./editor-toolbar"
import { Card, CardContent } from "@/Components/ui/card"
import { BubbleToolbar } from "./bubble-toolbar"
import { extensions } from "@/utils/editor/available-extensions"
import { Button } from "@/Components/ui/button"
import { Plus } from "lucide-react"

export function RichTextEditor() {
  const [content, setContent] = useState("<p>Hello, start typing here...</p>")
  const [position, setPosition] = useState<{
    top: number
  } >({top:0})
const containerRef = useRef<HTMLElement|null>(null);
  const editor = useEditor({
    extensions: [
        ...extensions
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    },
  })

  const addImage = useCallback(
    (url: string) => {
      if (url && editor) {
        editor.chain().focus().setImage({ src: url }).run()
      }
    },
    [editor],
  )
  useEffect(() => {
   const updatePosition = ()=>{
    if(!editor) return;
    if(!containerRef.current) return;
    const container = containerRef.current;
    const {view} = editor;
    const {from} = editor.state.selection;
    const buttonPosition = view.coordsAtPos(from).top - container?.getBoundingClientRect()?.top; 
    setPosition({
      top: buttonPosition,
    })
   }
    
      editor?.on("selectionUpdate", updatePosition)
      editor?.on("update", updatePosition)
    
    return () =>{
      editor?.on("selectionUpdate", updatePosition)
      editor?.on("update", updatePosition)  
    }
  }, [editor])


  console.log(()=> editor?.commands.createParagraphNear())
  return (
    <Card className="border shadow-sm">
      <EditorToolbar editor={editor} addImage={addImage} />
      <CardContent className="px-4 py-2 relative" ref={containerRef as React.RefObject<HTMLDivElement>}>
        <Button
           variant="outline"
              size="icon"
        className="shadow rounded-full border"
        onClick={()=> editor?.chain().selectParentNode().createParagraphNear().focus().run()}
        style={{
          position:"absolute",
          top:position.top,
          left:`-20px`
        }}
        >
          <Plus width={40} height={40}/>
        </Button>
        <div className="prose prose-sm sm:prose-base max-w-none  pl-6">
          {editor && <BubbleToolbar editor={editor} />}
          <EditorContent  editor={editor} className="focus:outline-none" />
        </div>
      </CardContent>
    </Card>
  )
}
