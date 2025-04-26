/* eslint-disable @typescript-eslint/no-explicit-any */

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"

import getIcon from "@/utils/iconConverter"
import { selectionCalc } from "@/utils/selection-move-key-calc"
import { scrollSelectedItemIntoView } from "@/utils/scroll-selected-into-view"

interface CommandsListProps {
  items: any[]
  command: (item: any) => void
}

interface CommandsListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}


export const CommandsList = forwardRef<CommandsListRef, CommandsListProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([])

  const keyHandlers = useMemo(
    () =>
      ({
        ArrowUp: () => {
          setSelectedIndex(selectionCalc(selectedIndex, props.items.length).up)
          return true;
        },
        ArrowDown: () => {
          setSelectedIndex(selectionCalc(selectedIndex, props.items.length).down)
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
  
  // Scroll selected item into view when selectedIndex changes
  useEffect(() => {

    if (!containerRef.current && !itemsRef.current[selectedIndex]) return;

      scrollSelectedItemIntoView(
        containerRef.current,
        itemsRef.current[selectedIndex] as HTMLElement
      );
    
  }, [selectedIndex])

  if (props.items.length === 0) {
    return null
  }

  return (
    <div 
      ref={containerRef}
      className="bg-white dark:bg-gray-800 rounded-md shadow-md border overflow-hidden p-1 max-h-80 overflow-y-auto"
    >
      {props.items.map((item, index) => (
        <button
          key={index}
          ref={el => itemsRef.current[index] = el}
          className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md ${
            index === selectedIndex ? "bg-muted" : "hover:bg-muted"
          }`}
          onClick={() => props.items[index] && props.command(props.items[index])}
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
