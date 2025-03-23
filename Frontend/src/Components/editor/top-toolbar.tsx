"use client";
import type { Editor } from "slate";
import {
  Bold,
  Italic,
  Underline,
  Code,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Save,
  FileText,
  Settings,
  Undo,
  Redo,
  Image,
  Table,
  ChevronDown,
  Heading3,
  Text,
  CloudUpload
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Separator } from "@/Components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";
import { Input } from "@/Components/ui/input"; // Assuming you have an Input component
import { useState } from "react";

interface TopToolbarProps {
  editor: Editor;
  toggleStyle: (type: "mark" | "block", format: string) => void;
  isActive: (type: "mark" | "block", format: string) => boolean;
  insertImageWithUrl: (url: string) => void; // New prop for URL insertion
  handleFileUpload: () => void;              // New prop for file upload
  insertTable: () => void;
}

const TopToolbar = ({
  toggleStyle,
  isActive,
  insertImageWithUrl,
  handleFileUpload,
  insertTable,
}: TopToolbarProps) => {
  const [imageUrl, setImageUrl] = useState(""); // State for URL input

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      insertImageWithUrl(imageUrl);
      setImageUrl(""); // Clear input after submission
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center bg-gray-50 border-b p-2 gap-1 overflow-x-auto">
        <div className="flex items-center mr-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <FileText className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>New Document</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Save className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Undo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Redo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <DropdownMenu >
          <DropdownMenuTrigger asChild >
            <Button variant="ghost" size="sm" className="h-8">
              <Heading1 className="h-4 w-4 mr-1" />
              <span>Heading</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => toggleStyle("block", "heading-one")}>
              <Heading1 className="mr-2 h-4 w-4" />
              <span>Heading 1</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleStyle("block", "heading-two")}>
              <Heading2 className="mr-2 h-4 w-4" />
              <span>Heading 2</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleStyle("block", "heading-three")}>
              <Heading3 className="mr-2 h-4 w-4"/>
              <span>Heading 3</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleStyle("block", "paragraph")}>
              <Text className="mr-2 h-4 w-4"/>
              <span>Paragraph</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${isActive("mark", "bold") ? "bg-muted" : ""}`}
              onClick={() => toggleStyle("mark", "bold")}
            >
              <Bold className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bold</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${isActive("mark", "italic") ? "bg-muted" : ""}`}
              onClick={() => toggleStyle("mark", "italic")}
            >
              <Italic className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Italic</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${isActive("mark", "underline") ? "bg-muted" : ""}`}
              onClick={() => toggleStyle("mark", "underline")}
            >
              <Underline className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Underline</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${isActive("mark", "code") ? "bg-muted" : ""}`}
              onClick={() => toggleStyle("mark", "code")}
            >
              <Code className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Code</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${isActive("block", "align-left") ? "bg-muted" : ""}`}
              onClick={() => toggleStyle("block", "align-left")}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Left</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${isActive("block", "align-center") ? "bg-muted" : ""}`}
              onClick={() => toggleStyle("block", "align-center")}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Center</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${isActive("block", "align-right") ? "bg-muted" : ""}`}
              onClick={() => toggleStyle("block", "align-right")}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Right</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${isActive("block", "align-justify") ? "bg-muted" : ""}`}
              onClick={() => toggleStyle("block", "align-justify")}
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Justify</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${isActive("block", "bulleted-list") ? "bg-muted" : ""}`}
              onClick={() => toggleStyle("block", "bulleted-list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bulleted List</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${isActive("block", "numbered-list") ? "bg-muted" : ""}`}
              onClick={() => toggleStyle("block", "numbered-list")}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Numbered List</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${isActive("block", "block-quote") ? "bg-muted" : ""}`}
              onClick={() => toggleStyle("block", "block-quote")}
            >
              <Quote className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Quote</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Updated Image Button with Dropdown */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 ">
                  <Image className="h-4 w-4" />
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>Insert Image</TooltipContent>
          </Tooltip>
          <DropdownMenuContent className="w-64">
          <div className="flex flex-col gap-2 p-2">
              <label htmlFor="image-url" className="text-sm font-medium">
                URL
              </label>
              <div className="flex gap-2">
                <Input
                  id="image-url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL"
                  className="h-8"
                />
                <Button size="sm" onClick={handleUrlSubmit} disabled={!imageUrl.trim()}>
                  Add
                </Button>
              </div>
            </div>
            <div  onClick={handleFileUpload}>
              <Button className="hover:bg-gray-50  w-full border-t " variant={'link'}>
              <CloudUpload />
              <span>Upload from Computer</span>
              </Button>
            </div>
         
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={insertTable}>
              <Table className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Insert Table</TooltipContent>
        </Tooltip>

        <div className="ml-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TopToolbar;