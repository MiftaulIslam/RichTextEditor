/* eslint-disable @typescript-eslint/no-explicit-any */

// Custom leaf renderer
export const renderLeaf = (props:any) => {
  const { attributes, children, leaf } = props

  let formattedChildren = children

  if (leaf.bold) {
    formattedChildren = <strong>{formattedChildren}</strong>
  }

  if (leaf.italic) {
    formattedChildren = <em>{formattedChildren}</em>
  }

  if (leaf.underline) {
    formattedChildren = <u>{formattedChildren}</u>
  }

  if (leaf.code) {
    formattedChildren = <code className="bg-gray-100 px-1 font-mono rounded">{formattedChildren}</code>
  }

  if (leaf.strikethrough) {
    formattedChildren = <span className="line-through">{formattedChildren}</span>
  }

  if (leaf.superscript) {
    formattedChildren = <sup>{formattedChildren}</sup>
  }

  if (leaf.subscript) {
    formattedChildren = <sub>{formattedChildren}</sub>
  }

  return <span {...attributes}>{formattedChildren}</span>
}

