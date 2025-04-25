/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { ImageUpload } from "@/Components/editor/image-upload";
import { useCallback, useState } from "react";

export const Tools = ({ editor }: any) => {

    const [linkUrl, setLinkUrl] = useState("");

    const setLink =useCallback( () => {
        if (linkUrl) {
            editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
            setLinkUrl("")
        } else {
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
        }
    },[linkUrl, editor])

    const handleImageInsert = (url: string) => {
        editor.chain().focus().setImage({ src: url }).run()
        // setImagePopoverOpen(false)
    }
    return [
        {
            name: 'bold',
            icon: 'bold',
            label: 'Toggle bold',
            action: () => editor.chain().focus()?.toggleBold().run()
        },
        {
            name: 'italic',
            icon: 'italic',
            label: 'Toggle italic',
            size: "sm",
            action: () => editor.chain().focus()?.toggleItalic().run()
        }, {
            name: 'underline',
            icon: 'underline',
            label: 'Toggle underline', size: "sm",
            action: () => editor.chain().focus()?.toggleUnderline().run()
        }, {
            name: 'strike',
            icon: 'strike',
            label: 'Toggle strikethrough', size: "sm",
            action: () => editor.chain().focus()?.toggleStrike().run()
        },
        {
            name: "link",
            icon: "link",
            label: "Toggle link", size: "sm",
            isWrapper: true,
            content: (
                <div className="flex items-center space-x-2">
                    <Input
                        placeholder="https://example.com"
                        value={linkUrl}
                        onChange={(e: any) => setLinkUrl(e.target.value)}
                        className="flex-1"
                    />
                    <Button size="sm" onClick={setLink}>
                        Set Link
                    </Button>
                </div>
            ),
        },
        {
            name: "image",
            icon: "imgIcon",
            label: "Add image", size: "sm",
            isWrapper: true,
            content: (
                <ImageUpload
                    onImageUpload={handleImageInsert}
                />
            ),
        },
    ]
}
