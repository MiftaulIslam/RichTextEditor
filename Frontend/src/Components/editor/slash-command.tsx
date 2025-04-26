/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Extension } from "@tiptap/core"
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react"

import getIcon from "@/utils/iconConverter"
import { SlashConfig } from "@/utils/editor/config/slashConfig"

interface CommandsListProps {
  items: any[]
  command: (item: any) => void
}

interface CommandsListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

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
    const suggestionConfig = new SlashConfig(this.editor, this.options.suggestion);
    return [suggestionConfig.getPlugin()];
  },
})

export const CommandsList = forwardRef<CommandsListRef, CommandsListProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    if (!props.items[index]) return;
    props.command(props.items[index])
  }


  const keyHandlers = useMemo(
    () =>
      ({
        ArrowUp: () => {
          setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
          return true;
        },
        ArrowDown: () => {
          setSelectedIndex((selectedIndex + 1) % props.items.length)
          return true;
        },
        Enter: () => {
          if (!props.items[selectedIndex]) return false;
          props.command(props.items[selectedIndex])
          return true;
        },
      }) as Record<string, () => boolean>,
    [selectedIndex, props]
  );

  useImperativeHandle(
    ref,
    () => ({
      onKeyDown: ({ event }) => {
        const handler = keyHandlers[event.key];
        return handler ? handler() : false;
      },
    }),
    [keyHandlers]
  );

  useEffect(() => setSelectedIndex(0), [props.items])

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
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted-foreground/10">{getIcon(item.icon, 'w-5, h-5')}</div>
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
