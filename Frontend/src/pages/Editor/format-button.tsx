/* eslint-disable @typescript-eslint/no-explicit-any */

import { useSlate } from "slate-react"
import { ToolbarButton } from "./toolbar-button"
import { isMarkActive, toggleMark } from "./utils"

// Format button component
export const FormatButton = ({ format, icon }:{format:any, icon:any}) => {
  const editor = useSlate()

  return (
    <ToolbarButton
      icon={icon}
      isActive={isMarkActive(editor, format)}
      onMouseDown={(event:any) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    />
  )
}

