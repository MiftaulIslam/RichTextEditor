
import { useState } from "react"
import { useSlate } from "slate-react"
import { Transforms } from "slate"
import {
  Camera,
  Bold,
  Italic,
  Underline,
  Code,
  Strikethrough,
  Superscript,
  Subscript,
  List,
  ListOrdered,
} from "lucide-react"

import { FormatButton } from "./format-button"
import { BlockButton } from "./block-button"
import { HeadingDropdown } from "./heading-dropdown"
import { ImageUploadModal } from "./image-upload-modal"

// Main toolbar component
export const Toolbar = () => {
  const editor = useSlate()
  const [showImageModal, setShowImageModal] = useState(false)

  const insertImage = (url: string) => {
    if (!url) return

    const image = { type: "image", url, children: [{ text: "" }] }
    Transforms.insertNodes(editor, image)
    Transforms.move(editor)
  }

  return (
    <>
      <div className="flex flex-wrap items-center p-2 mb-2 border border-gray-300 rounded bg-gray-50">
        <FormatButton format="bold" icon={<Bold size={16} />} />
        <FormatButton format="italic" icon={<Italic size={16} />} />
        <FormatButton format="underline" icon={<Underline size={16} />} />
        <FormatButton format="code" icon={<Code size={16} />} />
        <FormatButton format="strikethrough" icon={<Strikethrough size={16} />} />
        <FormatButton format="superscript" icon={<Superscript size={16} />} />
        <FormatButton format="subscript" icon={<Subscript size={16} />} />

        <div className="mx-1 h-6 border-l border-gray-300"></div>

        {/* Heading Dropdown */}
        <HeadingDropdown />

        <BlockButton format="block-quote" icon="&quot;" />
        <BlockButton format="numbered-list" icon={<ListOrdered size={16} />} />
        <BlockButton format="bulleted-list" icon={<List size={16} />} />

        <div className="mx-1 h-6 border-l border-gray-300"></div>

        {/* Image Upload Button */}
        <button
          className="p-2 mx-1 bg-gray-100 hover:bg-gray-200 rounded flex items-center"
          onClick={() => setShowImageModal(true)}
        >
          <Camera size={16} className="mr-1" /> Image
        </button>
      </div>

      {/* Enhanced Image Upload Modal with Cropping */}
      <ImageUploadModal isOpen={showImageModal} onClose={() => setShowImageModal(false)} onInsert={insertImage} />
    </>
  )
}

