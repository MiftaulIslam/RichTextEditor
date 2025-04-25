/* eslint-disable @typescript-eslint/no-explicit-any */
import { extensions } from "@/utils/editor/available-extensions"
import { useEditor } from "@tiptap/react"
interface editorProps {
    content?:string,
    setContent?:any
    
}

export const Editor = ({content, setContent}:editorProps) => useEditor({
    extensions: [
        ...extensions
    ],
    content,
    onUpdate: ({ editor }) => {
        setContent?.(editor.getHTML())
    },
  })


