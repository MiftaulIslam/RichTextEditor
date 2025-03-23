"use client";

import { useEffect, useState } from "react";
import { Editor, type Range } from "slate";
import {
  Bold,
  Italic,
  Underline,
  Code,
  Strikethrough,
  Superscript,
  Subscript,
  Palette,
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface SelectionToolbarProps {
  editor: Editor;
  selection: Range;
  toggleStyle: (type: "mark" | "block", format: string) => void;
  isActive: (type: "mark" | "block", format: string) => boolean;
}

const SelectionToolbar = ({
  editor,
  selection,
  toggleStyle,
  isActive,
}: SelectionToolbarProps) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Calculate toolbar position based on selection
  useEffect(() => {
    const domSelection = window.getSelection();
    if (domSelection && domSelection.rangeCount > 0) {
      const domRange = domSelection.getRangeAt(0);
      const rect = domRange.getBoundingClientRect();

      if (rect) {
        // Position the toolbar below the selection
        const editorEl = document.querySelector('[data-slate-editor="true"]');
        const editorRect = editorEl?.getBoundingClientRect();

        if (editorRect) {
          setPosition({
            top: rect.bottom - editorRect.top + 30, // 10px below selection
            left: rect.left + rect.width / 2 - editorRect.left, // Centered
          });
        }
      }
    }
  }, [selection]);

  const colorOptions = [
    { name: "Red", value: "#f44336" },
    { name: "Blue", value: "#2196f3" },
    { name: "Green", value: "#4caf50" },
    { name: "Yellow", value: "#ffeb3b" },
    { name: "Purple", value: "#9c27b0" },
    { name: "Orange", value: "#ff9800" },
    { name: "Black", value: "#000000" },
    { name: "Light Yellow", value: "#fff9c4" },
    { name: "Light Blue", value: "#bbdefb" },
    { name: "Light Green", value: "#c8e6c9" },
    { name: "Light Pink", value: "#f8bbd0" },
    { name: "Light Purple", value: "#e1bee7" },
    { name: "Light Orange", value: "#ffe0b2" },
    { name: "White", value: "#ffffff" },
  ];

  const setColor = (color: string) => {
    Editor.addMark(editor, "color", color);
  };


  return (
    <div
      className="absolute z-10 flex items-center bg-white border rounded-md shadow-md p-1"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: "translateX(-50%)",
      }}
    >
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 ${isActive("mark", "bold") ? "bg-muted" : ""}`}
        onClick={() => toggleStyle("mark", "bold")}
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 ${isActive("mark", "italic") ? "bg-muted" : ""}`}
        onClick={() => toggleStyle("mark", "italic")}
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 ${isActive("mark", "underline") ? "bg-muted" : ""}`}
        onClick={() => toggleStyle("mark", "underline")}
      >
        <Underline className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 ${
          isActive("mark", "strikethrough") ? "bg-muted" : ""
        }`}
        onClick={() => toggleStyle("mark", "strikethrough")}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 ${isActive("mark", "code") ? "bg-muted" : ""}`}
        onClick={() => toggleStyle("mark", "code")}
      >
        <Code className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 ${
          isActive("mark", "superscript") ? "bg-muted" : ""
        }`}
        onClick={() => toggleStyle("mark", "superscript")}
      >
        <Superscript className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 ${isActive("mark", "subscript") ? "bg-muted" : ""}`}
        onClick={() => toggleStyle("mark", "subscript")}
      >
        <Subscript className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Palette className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="p-2">
            <div className="mb-2">
              <p className="text-xs font-medium mb-1">Text Color</p>
              <div className="grid grid-cols-5 gap-1">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: color.value }}
                    onClick={() => setColor(color.value)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SelectionToolbar;
