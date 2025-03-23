
import { useSlate } from "slate-react"
import { ChevronDown } from "lucide-react"
import { isBlockActive, toggleBlock } from "./utils"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/Components/ui/dropdown-menu"

// Heading dropdown component
export const HeadingDropdown = () => {
  const editor = useSlate()

  const headings = [
    { value: "heading-one", label: "H1" },
    { value: "heading-two", label: "H2" },
    { value: "heading-three", label: "H3" },
    { value: "paragraph", label: "Paragraph" },
  ]

  const getCurrentHeading = () => {
    for (const heading of headings) {
      if (heading.value === "paragraph") continue
      if (isBlockActive(editor, heading.value)) {
        return heading
      }
    }
    return headings[3] // Default to paragraph
  }

  const currentHeading = getCurrentHeading()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 mx-1 bg-gray-100 hover:bg-gray-200 rounded flex items-center">
          {currentHeading.label} <ChevronDown size={14} className="ml-1" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {headings.map((heading) => (
          <DropdownMenuItem
            key={heading.value}
            className={isBlockActive(editor, heading.value) ? "bg-gray-100" : ""}
            onSelect={(e) => {
              e.preventDefault()
              toggleBlock(editor, heading.value)
            }}
          >
            {heading.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

