"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"

interface ImageUploadProps {
  onImageUpload: (url: string) => void
  onClose?: () => void
}

export function ImageUpload({ onImageUpload, onClose }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<File | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.match("image.*")) {
      console.error("Please select an image file")
      return
    }
    fileRef.current = file
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreview(result)
    }
    reader.readAsDataURL(file)
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  const handleInsert = () => {
    if (preview) {
      onImageUpload(preview)
      if (onClose) onClose()
    } else if (imageUrl) {
      onImageUpload(imageUrl)
      if (onClose) onClose()
    }
  }

  const handleClearPreview = () => {
    setPreview(null)
    fileRef.current = null
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="grid gap-4">
      {!preview ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 ${
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-center text-muted-foreground">Drag and drop an image, or click to select</p>
          <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
          <Button type="button" variant="secondary" onClick={handleButtonClick}>
            Select Image
          </Button>
        </div>
      ) : (
        <div className="relative border rounded-lg overflow-hidden">
          <img src={preview || "/placeholder.svg"} alt="Preview" className="max-h-[200px] w-full object-contain" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleClearPreview}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Or use an image URL</p>
        <div className="flex gap-2">
          <Input
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button onClick={handleInsert} disabled={!preview && !imageUrl}>
          Insert Image
        </Button>
      </div>
    </div>
  )
}