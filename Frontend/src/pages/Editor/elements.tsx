/* eslint-disable @typescript-eslint/no-explicit-any */

import { useSelected, useFocused } from "slate-react"

// Custom element renderer
export const renderElement = (props:any) => {
  const { attributes, children, element } = props

  switch (element.type) {
    case "heading-one":
      return (
        <h1 {...attributes} className="text-2xl font-bold mb-2">
          {children}
        </h1>
      )
    case "heading-two":
      return (
        <h2 {...attributes} className="text-xl font-bold mb-2">
          {children}
        </h2>
      )
    case "heading-three":
      return (
        <h3 {...attributes} className="text-lg font-bold mb-2">
          {children}
        </h3>
      )
    case "block-quote":
      return (
        <blockquote {...attributes} className="border-l-4 border-gray-300 pl-4 italic">
          {children}
        </blockquote>
      )
    case "numbered-list":
      return (
        <ol {...attributes} className="list-decimal ml-6">
          {children}
        </ol>
      )
    case "bulleted-list":
      return (
        <ul {...attributes} className="list-disc ml-6">
          {children}
        </ul>
      )
    case "list-item":
      return <li {...attributes}>{children}</li>
    case "image":
      return <ImageElement attributes={attributes} element={element} children={children} />
    case "code":
      return (
        <pre {...attributes} className="bg-gray-100 p-2 rounded font-mono">
          {children}
        </pre>
      )
    default:
      return (
        <p {...attributes} className="mb-2">
          {children}
        </p>
      )
  }
}

// Enhanced Image Element with selection indicator
const ImageElement = ({ attributes, children, element }:{attributes:any, children:any, element:any}) => {
  const selected = useSelected()
  const focused = useFocused()

  return (
    <div {...attributes} contentEditable={false} className="my-2 relative">
      <div className={`relative inline-block max-w-full ${selected && focused ? "ring-2 ring-blue-500" : ""}`}>
        <img
          src={element.url || "/placeholder.svg"}
          alt="Uploaded content"
          className="max-w-full rounded"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=300"
          }}
        />
      </div>
      {children}
    </div>
  )
}

