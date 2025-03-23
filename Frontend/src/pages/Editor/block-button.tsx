/* eslint-disable @typescript-eslint/no-explicit-any */

import { useSlate } from "slate-react"
import { ToolbarButton } from "./toolbar-button"
import { isBlockActive, toggleBlock } from "./utils"

// Block button component
export const BlockButton = ({ format, icon }:{format:any, icon:any}) => {
  const editor = useSlate()

  return (
    <ToolbarButton
      icon={icon}
      isActive={isBlockActive(editor, format)}
      onMouseDown={(event:any) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    />
  )
}

