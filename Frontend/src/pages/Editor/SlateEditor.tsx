/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback, useMemo, useRef } from "react"
import { createEditor } from "slate"
import { Slate, Editable, withReact } from "slate-react"
import { withHistory } from "slate-history"
import { Range } from "slate"

import { Toolbar } from "./toolbar"
import { FloatingToolbar } from "./floating-toolbar"
import { renderElement } from "./elements"
import { renderLeaf } from "./leaf"

const RichTextEditor = () => {
  // Define initialValue here to ensure it's available
  const initialValue = [
    {
      type: "paragraph",
      children: [{ text: "Start typing here..." }],
    },
  ]

  // Create a Slate editor object with withReact and withHistory plugins
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  // Initialize the state with our initial value
  const [value, setValue] = useState(initialValue)
  const [selection, setSelection] = useState(null)
  const editorRef = useRef(null)

  // Save selection when it changes
  const onChangeHandler = useCallback(
    (newValue: any[]) => {
      setValue(newValue)
      setSelection(editor.selection as any)
    },
    [editor],
  )

  return (
    <div className="relative mx-auto p-4" ref={editorRef}>
      <div className="border border-gray-300 rounded shadow-sm min-h-96 bg-white">
        <Slate editor={editor} initialValue={initialValue} value={value} onChange={onChangeHandler}>
          <Toolbar />

          <div className="px-4 py-2">
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder="Start typing..."
              className="min-h-64 focus:outline-none"
              spellCheck
            />
          </div>

          {/* Floating toolbar that appears when text is selected */}
          {selection && !Range.isCollapsed(selection) && <FloatingToolbar editorRef={editorRef} />}
        </Slate>
      </div>
    </div>
  )
}

export default RichTextEditor

