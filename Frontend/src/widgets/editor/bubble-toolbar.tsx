
import { BubbleMenu, type Editor } from "@tiptap/react"
import { Bold, Italic, Underline, Strikethrough, LinkIcon, ImageIcon } from "lucide-react"


import { useState } from "react"
// import { ImageUpload } from "./image-upload"
import { Toggle } from "@/Components/ui/toggle"
import { Input } from "@/Components/ui/input"
import { Button } from "@/Components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/Components/ui/popover"
import { ImageUpload } from "./image-upload"

interface BubbleToolbarProps {
  editor: Editor
}

export function BubbleToolbar({ editor }: BubbleToolbarProps) {
  const [linkUrl, setLinkUrl] = useState("")
  const [imagePopoverOpen, setImagePopoverOpen] = useState(false)

  const setLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
      setLinkUrl("")
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
    }
  }

  const handleImageInsert = (url: string) => {
    editor.chain().focus().setImage({ src: url }).run()
    setImagePopoverOpen(false)
  }

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="flex items-center bg-white p-1 rounded-md shadow-md border"
    >
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus()?.toggleBold().run()}
        aria-label="Toggle bold"
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus()?.toggleItalic().run()}
        aria-label="Toggle italic"
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("underline")}
        onPressedChange={() => editor.chain().focus()?.toggleUnderline().run()}
        aria-label="Toggle underline"
      >
        <Underline className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus()?.toggleStrike().run()}
        aria-label="Toggle strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
   
      <Popover>
        <PopoverTrigger asChild>
          <Toggle size="sm" pressed={editor.isActive("link")} aria-label="Toggle link">
            <LinkIcon className="h-4 w-4" />
          </Toggle>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="flex-1"
            />
            <Button size="sm" onClick={setLink}>
              Set Link
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Popover open={imagePopoverOpen} onOpenChange={setImagePopoverOpen}>
        <PopoverTrigger asChild>
          <Toggle size="sm" aria-label="Add image">
            <ImageIcon className="h-4 w-4" />
          </Toggle>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3">
          <ImageUpload onImageUpload={handleImageInsert} onClose={() => setImagePopoverOpen(false)} />
        </PopoverContent>
      </Popover>
    </BubbleMenu>
  )
}
