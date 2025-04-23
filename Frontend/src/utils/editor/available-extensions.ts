/* eslint-disable @typescript-eslint/no-explicit-any */
import { SlashCommands } from "@/widgets/editor/slash-command";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Image from "@tiptap/extension-image"
export const availableExtensions:any = [
    {
        extension: StarterKit,
        config: {
          heading: false,
        },
      },
      {
        extension: Heading,
        config: {
          levels: [1, 2, 3],
        },
      },
      {
        extension: Link,
        config: {
          openOnClick: false,
        },
      },
      {
        extension: Underline,
      },
      {
        extension: TextAlign,
        config: {
          types: ['heading', 'paragraph'],
        },
      },
      {
        extension: Image,
        config: {
          allowBase64: true,
          inline: false,
          HTMLAttributes: {
            class: 'editor-image',
          },
        },
      },
      {
        extension: SlashCommands,
      },
     
]
export const extensions:any = []

for(const extension of availableExtensions){
    extensions.push(extension.config ? extension.extension.configure(extension?.config) : extension.extension )
}
