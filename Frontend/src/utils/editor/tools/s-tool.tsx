/* eslint-disable @typescript-eslint/no-explicit-any */
import { Editor } from "@tiptap/react"
import { uploadImageToEditor } from "../upload-image-to-editor"

const handleImageUpload = async ({ editor, range }: { editor: Editor, range: { from: number, to: number } }) => {
    // Handle image upload via Cloudinary
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"

    input.onchange = async (e) => {
        const target = e.target as HTMLInputElement
        if (!target.files || !target.files[0]) return;


        try {
            uploadImageToEditor(target?.files[0], editor, range)

        } catch (error) {
            console.error("Error uploading image:", error)
            // You might want to show an error message to the user
            alert("Failed to upload image. Please try again.")
        }

    }

    input.click()
}



/* eslint-disable @typescript-eslint/no-explicit-any */
export const slashTools = [
    {
        title: "Text",
        description: "Just start typing with plain text",
        icon: 'text',
        command: ({ editor, range }: any) => {
            editor.chain().focus().deleteRange(range).setParagraph().run()
        },
    },
    {
        title: "Heading 1",
        description: "Large section heading",
        icon: 'heading1',
        command: ({ editor, range }: any) => {
            editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run()
        },
    },
    {
        title: "Heading 2",
        description: "Medium section heading",
        icon: 'heading2',
        command: ({ editor, range }: any) => {
            editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run()
        },
    },
    {
        title: "Heading 3",
        description: "Small section heading",
        icon: 'heading3',
        command: ({ editor, range }: any) => {
            editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run()
        },
    },
    {
        title: "Bullet List",
        description: "Create a simple bullet list",
        icon: 'list',
        command: ({ editor, range }: any) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run()
        },
    },
    {
        title: "Numbered List",
        description: "Create a numbered list",
        icon: 'listOrdered',
        command: ({ editor, range }: any) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run()
        },
    },
    {
        title: "Quote",
        description: "Capture a quote",
        icon: 'quote',
        command: ({ editor, range }: any) => {
            editor.chain().focus().deleteRange(range).toggleBlockquote().run()
        },
    },
    {
        title: "Code",
        description: "Add a code block",
        icon: 'code',
        command: ({ editor, range }: any) => {
            editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
        },
    },
    {
        title: "Image",
        description: "Add an image",
        icon: 'imgIcon',
        command: async ({ editor, range }: any) => {
            handleImageUpload({ editor, range })
        },
    },
]