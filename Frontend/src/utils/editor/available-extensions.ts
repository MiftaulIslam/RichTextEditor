/* eslint-disable @typescript-eslint/no-explicit-any */
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Image from "@tiptap/extension-image"
import { Paragraph } from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import { SlashConfig } from "@/lib/editor/config/slashConfig";

import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
const slashExtension = new SlashConfig();

export const availableExtensions: any = [
  {
    extension: StarterKit,
    config: {
      heading: false,
      bulletList: false,
      orderedList:false,
    },
  }, 
  {
    extension: Paragraph,
  }, 
  {
    extension: Placeholder,
    config: {
      placeholder: `Type '/' for commands`,
      showOnlyWhenEditable: true,
    }
  },
  {
    extension: Heading,
    config: {
      levels: [1, 2, 3],
      HTMLAttributes: {
        'data-editor-heading': 'heading',
      },
    },
  },
  {
    extension: BulletList,
    config:{
      HTMLAttributes: {
        'data-editor-bullet-list': 'bullet-list',
      }
    }
  },
  {
    extension: OrderedList,
    config:{
      HTMLAttributes: {
        'data-editor-ordered-list': 'ordered-list',
      }
    }
  },
  {
    extension: Link,
    config: {
      openOnClick: true, 
      HTMLAttributes: {
        'data-editor-link': 'link',
      },
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
    extension: slashExtension.slashCommand(),
  },
  // {
  //   extension: SlashCommands,
  // },

]
export const extensions: any = []

for (const extension of availableExtensions) {
  extensions.push(extension.config ? extension.extension.configure(extension?.config) : extension.extension)
}
