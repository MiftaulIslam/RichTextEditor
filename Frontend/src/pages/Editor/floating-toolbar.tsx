/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef, useEffect } from "react"
import { useSlate } from "slate-react"
import { createPortal } from "react-dom"
import { Bold, Italic, Underline, Code, Strikethrough } from "lucide-react"

import { isMarkActive, toggleMark } from "./utils"

// Floating toolbar that appears when text is selected
export const FloatingToolbar = ({ editorRef }:{editorRef:any}) => {
  const ref = useRef()
  const editor = useSlate()

  useEffect(() => {
    const el = ref.current
    const editorEl = editorRef.current

    if (!el || !editorEl) return

    const { selection } = editor

    if (!selection || !window.getSelection()) {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.pointerEvents = "none"
      return
    }

    const domSelection = window.getSelection()
    if (domSelection?.rangeCount === 0) return

    const domRange = domSelection?.getRangeAt(0)
    const rect = domRange?.getBoundingClientRect()

    if (!rect) return

    const editorRect = editorEl.getBoundingClientRect();

    (el as HTMLElement).style.opacity = "1";
    (el as HTMLElement).style.pointerEvents = "auto";
    (el as HTMLElement).style.top = `${rect.top - editorRect.top - (el as HTMLElement).offsetHeight - 10}px`;
    (el as HTMLElement).style.left = `${rect.left - editorRect.left + rect.width / 2 - (el as HTMLElement).offsetWidth / 2}px`;
  })

  return createPortal(
    <div
      ref={ref as any}
      className="absolute z-10 p-1 bg-white shadow-md rounded-md border transition-opacity duration-200 opacity-0 pointer-events-none flex"
      style={{
        transform: "translateY(-8px)",
      }}
    >
      <button
        className={`p-1 mx-0.5 rounded ${isMarkActive(editor, "bold") ? "bg-gray-300" : "hover:bg-gray-100"}`}
        onMouseDown={(e) => {
          e.preventDefault()
          toggleMark(editor, "bold")
        }}
      >
        <Bold size={16} />
      </button>

      <button
        className={`p-1 mx-0.5 rounded ${isMarkActive(editor, "italic") ? "bg-gray-300" : "hover:bg-gray-100"}`}
        onMouseDown={(e) => {
          e.preventDefault()
          toggleMark(editor, "italic")
        }}
      >
        <Italic size={16} />
      </button>

      <button
        className={`p-1 mx-0.5 rounded ${isMarkActive(editor, "underline") ? "bg-gray-300" : "hover:bg-gray-100"}`}
        onMouseDown={(e) => {
          e.preventDefault()
          toggleMark(editor, "underline")
        }}
      >
        <Underline size={16} />
      </button>

      <button
        className={`p-1 mx-0.5 rounded ${isMarkActive(editor, "code") ? "bg-gray-300" : "hover:bg-gray-100"}`}
        onMouseDown={(e) => {
          e.preventDefault()
          toggleMark(editor, "code")
        }}
      >
        <Code size={16} />
      </button>

      <button
        className={`p-1 mx-0.5 rounded ${isMarkActive(editor, "strikethrough") ? "bg-gray-300" : "hover:bg-gray-100"}`}
        onMouseDown={(e) => {
          e.preventDefault()
          toggleMark(editor, "strikethrough")
        }}
      >
        <Strikethrough size={16} />
      </button>

      <div className="absolute w-2 h-2 bg-white border-b border-r transform rotate-45 left-1/2 -bottom-1 -ml-1"></div>
    </div>,
    editorRef.current || document.body,
  )
}

