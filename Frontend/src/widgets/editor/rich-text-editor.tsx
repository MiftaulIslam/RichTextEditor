
import { useEditor, EditorContent } from "@tiptap/react"

import { useState, useCallback } from "react"
import { EditorToolbar } from "./editor-toolbar"
import { Card, CardContent } from "@/Components/ui/card"
import { BubbleToolbar } from "./bubble-toolbar"
import { extensions } from "@/utils/editor/available-extensions"

export function RichTextEditor() {
  const [content, setContent] = useState("<p>Hello, start typing here...</p>")
    
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

  return (
    <Card className="border shadow-sm">
      <EditorToolbar editor={editor} addImage={addImage} />
      <CardContent className="px-4 py-2">
        <div className="prose prose-sm sm:prose-base max-w-none  pl-6">
          {editor && <BubbleToolbar editor={editor} />}
          <EditorContent  editor={editor} className="focus:outline-none" />
        </div>
      </CardContent>
    </Card>
  )
}
