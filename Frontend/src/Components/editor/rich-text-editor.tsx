
import {  EditorContent } from "@tiptap/react"
import { useState, useCallback, useEffect, useRef } from "react"
import { EditorToolbar } from "./editor-toolbar"
import { Card, CardContent } from "@/Components/ui/card"
import { BubbleToolbar } from "../../widgets/editor/bubble-toolbar"
import { Button } from "@/Components/ui/button"
import { ArrowBigRight, Plus } from "lucide-react"
import { Editor } from "../../utils/editor/editor"

export function RichTextEditor() {
  const [content, setContent] = useState("")
  const [position, setPosition] = useState<{
    top: number
  } >({top:0})
const containerRef = useRef<HTMLElement|null>(null);
const editor = Editor({
  content, setContent
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


  return (
    <Card className="border shadow-sm relative">
      <EditorToolbar editor={editor} addImage={addImage} />
      {/* send button */}
      <Button size={'icon'} className='absolute -right-6 top-2 bg-green-600 shadow rounded-full border text-white z-50'><ArrowBigRight className='!w-6 !h-6'/></Button>
      <CardContent className="px-4 py-2 relative" ref={containerRef as React.RefObject<HTMLDivElement>}>
        {/* new line button */}
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
