/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/Components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu'
import { Input } from '@/Components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover'
import { Toggle } from '@/Components/ui/toggle'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/Components/ui/tooltip'

import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, ChevronDown, Code, Heading1, Heading2, Heading3, ImageIcon, Italic, LinkIcon, List, ListOrdered, Quote, Redo, Strikethrough, Underline, Undo } from 'lucide-react'
import  { useCallback, useState } from 'react'
import { ImageUpload } from '../image-upload'
const BoldCompo = ({ editor }: any) => {
    return (
        <Tooltip>
            <TooltipTrigger>
                <div>
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive("bold")}
                        onPressedChange={() =>
                            editor.chain().focus().toggleBold().run()
                        }
                    >
                        <Bold className="h-4 w-4" />
                    </Toggle>
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>Bold</p>
            </TooltipContent>
        </Tooltip>
    )
}
const UnderlineCompo = ({ editor }: any) => {
    return (
        <Tooltip>
            <TooltipTrigger>
                <div>
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive("underline")}
                        onPressedChange={() =>
                            editor.chain().focus().toggleUnderline().run()
                        }
                    >
                        <Underline className="h-4 w-4" />
                    </Toggle>
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>Underline</p>
            </TooltipContent>
        </Tooltip>
    )
}
const ItalicCompo = ({ editor }: any) => {
    return (
        <Tooltip>
            <TooltipTrigger>
                <div>

                    <Toggle
                        size="sm"
                        pressed={editor?.isActive("italic")}
                        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    >
                        <Italic className="h-4 w-4" />
                    </Toggle>
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>Italic</p>
            </TooltipContent>
        </Tooltip>
    )
}

const StrikeThroughCompo = ({ editor }: any) => {
    return (
        <Tooltip>
            <TooltipTrigger>
                <div>

                    <Toggle
                        size="sm"
                        pressed={editor?.isActive("strike")}
                        onPressedChange={() =>
                            editor.chain().focus().toggleStrike().run()
                        }
                    >
                        <Strikethrough className="h-4 w-4" />
                    </Toggle>
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>Italic</p>
            </TooltipContent>
        </Tooltip>
    )
}

const HeaderDropDownCompo = ({ editor }: any) => {
    return (

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                    {editor?.isActive("heading", { level: 1 })
                        ? "Heading 1"
                        : editor?.isActive("heading", { level: 2 })
                            ? "Heading 2"
                            : editor?.isActive("heading", { level: 3 })
                                ? "Heading 3"
                                : "Paragraph"}
                    <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem
                    onClick={() => editor.chain().focus().setParagraph().run()}
                >
                    Paragraph
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                >
                    Heading 1
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                >
                    Heading 2
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                >
                    Heading 3
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}

// const HeadingOneCompo = ({ editor }: any) => {
//     return (
//         <Tooltip>
//             <TooltipTrigger>
//                 <div>

//                     <Toggle
//                         size="sm"
//                         pressed={editor?.isActive("heading", { level: 1 })}
//                         onPressedChange={() =>
//                             editor.chain().focus().toggleHeading({ level: 1 }).run()
//                         }
//                     >
//                         <Heading1 className="h-4 w-4" />
//                     </Toggle>
//                 </div>
//             </TooltipTrigger>
//             <TooltipContent>
//                 <p>Italic</p>
//             </TooltipContent>
//         </Tooltip>
//     )
// }

// const HeadingTwoCompo = ({ editor }: any) => {
//     return (
//         <Tooltip>
//             <TooltipTrigger>
//                 <div>

//                     <Toggle
//                         size="sm"
//                         pressed={editor?.isActive("heading", { level: 2 })}
//                         onPressedChange={() =>
//                             editor.chain().focus().toggleHeading({ level: 2 }).run()
//                         }
//                     >
//                         <Heading2 className="h-4 w-4" />
//                     </Toggle>
//                 </div>
//             </TooltipTrigger>
//             <TooltipContent>
//                 <p>Italic</p>
//             </TooltipContent>
//         </Tooltip>
//     )
// }

// const HeadingThreeCompo = ({ editor }: any) => {
//     return (
//         <Tooltip>
//             <TooltipTrigger>
//                 <div>

//                     <Toggle
//                         size="sm"
//                         pressed={editor?.isActive("heading", { level: 3 })}
//                         onPressedChange={() =>
//                             editor.chain().focus().toggleHeading({ level: 3 }).run()
//                         }
//                     >
//                         <Heading3 className="h-4 w-4" />
//                     </Toggle>
//                 </div>
//             </TooltipTrigger>
//             <TooltipContent>
//                 <p>Italic</p>
//             </TooltipContent>
//         </Tooltip>
//     )
// }

const HeaderCompo = ({ editor, level = 1 }: any) => {
    return level == '1' ? (
        <Tooltip>
            <TooltipTrigger>
                <div>

                    <Toggle
                        size="sm"
                        pressed={editor?.isActive("heading", { level: 1 })}
                        onPressedChange={() =>
                            editor.chain().focus().toggleHeading({ level: 1 }).run()
                        }
                    >
                        <Heading1 className="h-4 w-4" />
                    </Toggle>
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>Italic</p>
            </TooltipContent>
        </Tooltip>
    ) : level == '2' ? (
        <Tooltip>
            <TooltipTrigger>
                <div>

                    <Toggle
                        size="sm"
                        pressed={editor?.isActive("heading", { level: 2 })}
                        onPressedChange={() =>
                            editor.chain().focus().toggleHeading({ level: 2 }).run()
                        }
                    >
                        <Heading2 className="h-4 w-4" />
                    </Toggle>
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>Italic</p>
            </TooltipContent>
        </Tooltip>
    ) : (
        <Tooltip>
            <TooltipTrigger>
                <div>

                    <Toggle
                        size="sm"
                        pressed={editor?.isActive("heading", { level: 3 })}
                        onPressedChange={() =>
                            editor.chain().focus().toggleHeading({ level: 3 }).run()
                        }
                    >
                        <Heading3 className="h-4 w-4" />
                    </Toggle>
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>Italic</p>
            </TooltipContent>
        </Tooltip>
    )
}
const ListItemCompo = ({ editor, order = "order" }: any) => {
    return order == "order" ? (
        <Tooltip>
            <TooltipTrigger>
                <div>

                    <Toggle
                        size="sm"
                        pressed={editor?.isActive("orderedList")}
                        onPressedChange={() =>
                            editor.chain().focus().toggleOrderedList().run()
                        }
                    >
                        <ListOrdered className="h-4 w-4" />
                    </Toggle>
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>Ordered List</p>
            </TooltipContent>
        </Tooltip>

    ) : (
        <Tooltip>
            <TooltipTrigger>
                <div>


                    <Toggle
                        size="sm"
                        pressed={editor?.isActive("bulletList")}
                        onPressedChange={() =>
                            editor.chain().focus().toggleBulletList().run()
                        }
                    >
                        <List className="h-4 w-4" />
                    </Toggle>
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>Unordered List</p>
            </TooltipContent>
        </Tooltip>
    )
}

const TextAlignDropdownCompo = ({ editor }: any) => {
    return (

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                    {editor?.isActive({ textAlign: "left" }) ? (
                        <AlignLeft className="h-4 w-4" />
                    ) : editor?.isActive({ textAlign: "center" }) ? (
                        <AlignCenter className="h-4 w-4" />
                    ) : editor?.isActive({ textAlign: "right" }) ? (
                        <AlignRight className="h-4 w-4" />
                    ) : editor?.isActive({ textAlign: "justify" }) ? (
                        <AlignJustify className="h-4 w-4" />
                    ) : (
                        <AlignLeft className="h-4 w-4" />
                    )}
                    <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                >
                    <AlignLeft className="h-4 w-4 mr-2" /> Left
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() =>
                        editor.chain().focus().setTextAlign("center").run()
                    }
                >
                    <AlignCenter className="h-4 w-4 mr-2" /> Center
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                >
                    <AlignRight className="h-4 w-4 mr-2" /> Right
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() =>
                        editor.chain().focus().setTextAlign("justify").run()
                    }
                >
                    <AlignJustify className="h-4 w-4 mr-2" /> Justify
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}

const TextAlignCompo = ({ editor, align }: any) => {
    if (!editor) return null;
    return (
        <Tooltip>
            <TooltipTrigger>
                <div>

                    <Toggle
                        size="sm"
                        pressed={editor?.isActive({ textAlign: align })}
                        onPressedChange={() =>
                            editor.chain().focus().setTextAlign(align).run()
                        }
                    >
                        {align == "left" ? (
                            <AlignLeft className="h-4 w-4" />
                        ) :
                            align == 'right' ? <AlignRight className='h-4 w-4' /> :
                                <AlignCenter className='h-4 w-4' />
                        }
                    </Toggle>
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>{align}</p>
            </TooltipContent>
        </Tooltip>
    )
}

const BlockquoteCompo = ({ editor }: any) => {
    return (
        <Tooltip>
            <TooltipTrigger>
                <div>

                <Toggle
            size="sm"
            pressed={editor?.isActive("blockquote")}
            onPressedChange={() =>
              editor.chain().focus().toggleBlockquote().run()
            }
          >
            <Quote className="h-4 w-4" />
          </Toggle>
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>Blockquote</p>
            </TooltipContent>
        </Tooltip>
    )
}

const CodeBlockCompo = ({ editor }: any) => {
    return (
        <Tooltip>
        <TooltipTrigger>
            <div>

            <Toggle
            size="sm"
            pressed={editor?.isActive("codeBlock")}
            onPressedChange={() =>
              editor.chain().focus().toggleCodeBlock().run()
            }
          >
            <Code className="h-4 w-4" />
          </Toggle>

            </div>
        </TooltipTrigger>
        <TooltipContent>
            <p>Code block</p>
        </TooltipContent>
    </Tooltip>
    )
}

const InsertLinkCompo = ({ editor }: any) => {
    const [linkUrl, setLinkUrl] = useState("");

    if (!editor) {
      return null;
    }
  
    const setLink = () => {
      if (linkUrl) {
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: linkUrl })
          .run();
        setLinkUrl("");
      } else {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
      }
    };
    return (
        <Popover>
        <PopoverTrigger asChild>
          <Toggle size="sm" pressed={editor?.isActive("link")}>
            <LinkIcon className="h-4 w-4" />
          </Toggle>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="flex-1"
            />
            <Button size="sm" onClick={setLink} disabled={!linkUrl}>
              Set Link
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    )
}

const UploadImageCompo= ({ editor }: any) => {
    
  const [imagePopoverOpen, setImagePopoverOpen] = useState(false);
  
  const addImage = useCallback(
    (url: string) => {
      if (url && editor) {
        editor.chain().focus().setImage({ src: url }).run()
      }
    },
    [editor],
  )
  const handleImageInsert = (url: string) => {
    addImage(url);
    setImagePopoverOpen(false);
  };
    return (
        
        <Popover open={imagePopoverOpen} onOpenChange={setImagePopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <ImageIcon className="h-4 w-4 mr-2" /> Image
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3">
            <ImageUpload
              onImageUpload={handleImageInsert}
              onClose={() => setImagePopoverOpen(false)}
            />
          </PopoverContent>
        </Popover>

    )
}
const HistoryCompo = ({ editor, hist }: any) => {
    return hist == 'undo'? (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor?.can().undo()}
            className="h-8 w-8"
          >
            <Undo className="h-4 w-4" />
          </Button>
    ): (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor?.can().redo()}
            className="h-8 w-8"
          >
            <Redo className="h-4 w-4" />
          </Button>
    )
}
export const EditorCompo = ({ editor }: any) => {

  
    return {
        bold: () => <BoldCompo editor={editor} />,
        underline: () => <UnderlineCompo editor={editor} />,
        italic: () => <ItalicCompo editor={editor} />,
        strike: () => <StrikeThroughCompo editor={editor} />,
        heading_dropdown: () => <HeaderDropDownCompo editor={editor} />,
        heading: (level?: string | number) => <HeaderCompo editor={editor} level={level} />,
        list: (order?: "order"|"bullet") => <ListItemCompo editor={editor} order={order} />,
        align: (align?: "left"|"right"|"center") => <TextAlignCompo editor={editor} align={align} />,
        align_dropdown: () => <TextAlignDropdownCompo editor={editor} />,
        blockquote: () => <BlockquoteCompo editor={editor} />,
        code: () => <CodeBlockCompo editor={editor} />,
        link: () => <InsertLinkCompo editor={editor}/>,
        imageUpload: () => <UploadImageCompo editor={editor} />,
        history: (hist?: "undo"|"redo") => <HistoryCompo editor={editor} hist={hist} />,

    }
}

export default EditorCompo