/* eslint-disable @typescript-eslint/no-explicit-any */

import { Editor, Element as SlateElement, Transforms } from "slate"

// Toggle mark utility
export const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format)
  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

// Check if mark is active
export const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor)
  return marks ? Object.prototype.hasOwnProperty.call(marks, format) && (marks as Record<string, boolean>)[format] === true : false
}

// Toggle block utility
export const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format)
  const isList = ["numbered-list", "bulleted-list"].includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && ["numbered-list", "bulleted-list"].includes(n?.type as any),
    split: true,
  })

  const newProperties = {
    type: isActive ? "paragraph" : isList ? "list-item" : format,
  }

Transforms.setNodes<SlateElement>(editor, newProperties as Partial<SlateElement>)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

// Check if block is active
export const isBlockActive = (editor: Editor, format: string) => {
  try {
    const [match] = Editor.nodes(editor, {
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    }) || [false]
    return !!match
  } catch (error) {
    console.error("Error checking if block is active:", error)
    return false
  }
}

