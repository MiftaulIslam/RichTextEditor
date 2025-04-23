/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Extension } from "@tiptap/core"
import Suggestion from "@tiptap/suggestion"
import { ReactRenderer } from "@tiptap/react"
import tippy from "tippy.js"
import { Heading1, Heading2, Heading3, List, ListOrdered, Text, ImageIcon, Code, Quote, Table } from "lucide-react"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"


export const SlashCommands = Extension.create({
  name: "slash-commands",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range })
        },
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        items: ({ query }: { query: string }) => {
          return [
            {
              title: "Text",
              description: "Just start typing with plain text",
              icon: <Text size={18} />,
              command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).setParagraph().run()
              },
            },
            {
              title: "Heading 1",
              description: "Large section heading",
              icon: <Heading1 size={18} />,
              command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run()
              },
            },
            {
              title: "Heading 2",
              description: "Medium section heading",
              icon: <Heading2 size={18} />,
              command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run()
              },
            },
            {
              title: "Heading 3",
              description: "Small section heading",
              icon: <Heading3 size={18} />,
              command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run()
              },
            },
            {
              title: "Bullet List",
              description: "Create a simple bullet list",
              icon: <List size={18} />,
              command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).toggleBulletList().run()
              },
            },
            {
              title: "Numbered List",
              description: "Create a numbered list",
              icon: <ListOrdered size={18} />,
              command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).toggleOrderedList().run()
              },
            },
            {
              title: "Quote",
              description: "Capture a quote",
              icon: <Quote size={18} />,
              command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).toggleBlockquote().run()
              },
            },
            {
              title: "Code",
              description: "Add a code block",
              icon: <Code size={18} />,
              command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
              },
            },
            {
              title: "Image",
              description: "Add an image",
              icon: <ImageIcon size={18} />,
              command: async ({ editor, range }: any) => {
                // Handle image upload via Cloudinary
                const input = document.createElement("input")
                input.type = "file"
                input.accept = "image/*"

                input.onchange = async (e) => {
                  const target = e.target as HTMLInputElement
                  if (target.files && target.files[0]) {
                    const file = target.files[0]

                    try {
                      
                        // If Cloudinary is not configured, use local preview
                        const reader = new FileReader()
                        reader.onload = (readerEvent) => {
                          const imageUrl = readerEvent.target?.result as string
                          editor.chain().focus().deleteRange(range).setImage({ src: imageUrl }).run()
                        }
                        reader.readAsDataURL(file)
                      
                    } catch (error) {
                      console.error("Error uploading image:", error)
                      // You might want to show an error message to the user
                      alert("Failed to upload image. Please try again.")
                    }
                  }
                }

                input.click()
              },
            },
            {
              title: "Table",
              description: "Add a table",
              icon: <Table size={18} />,
              command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
              },
            },
          ].filter((item) => {
            if (typeof query === "string" && query.length > 0) {
              return item.title.toLowerCase().includes(query.toLowerCase())
            }
            return true
          })
        },
        render: () => {
          let component: ReactRenderer
          let popup: any

          return {
            onStart: (props: any) => {
              component = new ReactRenderer(CommandsList, {
                props,
                editor: props.editor,
              })

              popup = tippy("body", {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
              })
            },
            onUpdate(props: any) {
              component.updateProps(props)

              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              })
            },
            onKeyDown(props: any) {
              if (props.event.key === "Escape") {
                popup[0].hide()
                return true
              }

              return component.ref?.onKeyDown(props)
            },
            onExit() {
              popup[0].destroy()
              component.destroy()
            },
          }
        },
      }),
    ]
  },
})

interface CommandsListProps {
  items: any[]
  command: (item: any) => void
}

interface CommandsListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

const CommandsList = forwardRef<CommandsListRef, CommandsListProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = props.items[index]
    if (item) {
      props.command(item)
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        upHandler()
        return true
      }

      if (event.key === "ArrowDown") {
        downHandler()
        return true
      }

      if (event.key === "Enter") {
        enterHandler()
        return true
      }

      return false
    },
  }))

  if (props.items.length === 0) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-md border overflow-hidden p-1 max-h-80 overflow-y-auto">
      {props.items.map((item, index) => (
        <button
          key={index}
          className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md ${
            index === selectedIndex ? "bg-muted" : "hover:bg-muted"
          }`}
          onClick={() => selectItem(index)}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted-foreground/10">{item.icon}</div>
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </div>
        </button>
      ))}
    </div>
  )
})

CommandsList.displayName = "CommandsList"
