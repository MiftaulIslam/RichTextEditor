/* eslint-disable @typescript-eslint/no-explicit-any */
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Image from "@tiptap/extension-image"
import { Paragraph } from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';

import { SlashConfig } from "./config/slashConfig";
const slashExtension = new SlashConfig();

export const availableExtensions: any = [
  {
    extension: StarterKit,
    config: {
      heading: false,
    },
  }, {
    extension: Paragraph,
  }, {
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
