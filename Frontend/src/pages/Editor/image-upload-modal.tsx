/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef } from "react"
import { ImageCropper } from "./image-cropper"

// Enhanced Image Upload Modal with Cropping
export const ImageUploadModal = ({ 
  isOpen, 
  onClose, 
  onInsert 
}: {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (imageUrl: string) => void;
}) => {
  const [imageUrl, setImageUrl] = useState("")
  const [uploadedImage, setUploadedImage] = useState(null)
  const [activeTab, setActiveTab] = useState("url")
  const [showCropper, setShowCropper] = useState(false)
  const [cropSrc, setCropSrc] = useState(null)
  const fileInputRef = useRef(null)

  const handleUrlInsert = () => {
    if (imageUrl.trim()) {
      onInsert(imageUrl)
      setImageUrl("")
      onClose()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setCropSrc(event.target.result as any)
        setShowCropper(true)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleCropComplete = (croppedImageUrl: any) => {
    setUploadedImage(croppedImageUrl)
    setShowCropper(false)
  }

  const handleCropCancel = () => {
    setShowCropper(false)
    setCropSrc(null)
    if (fileInputRef.current) {
      (fileInputRef.current as HTMLInputElement).value = ""
    }
  }

  const handleFileInsert = () => {
    if (uploadedImage) {
      onInsert(uploadedImage)
      setUploadedImage(null)
      if (fileInputRef.current) {
        (fileInputRef.current as HTMLInputElement).value = ""
      }
      onClose()
    }
  }

  const handleClose = () => {
    setImageUrl("")
    setUploadedImage(null)
    setCropSrc(null)
    setShowCropper(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Insert Image</h3>
        </div>

        {showCropper ? (
          <ImageCropper
            src={cropSrc || "/placeholder.svg"}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
          />
        ) : (
          <div className="p-4">
            <div className="flex border-b mb-4">
              <button
                className={`px-4 py-2 ${activeTab === "url" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
                onClick={() => setActiveTab("url")}
              >
                URL
              </button>
              <button
                className={`px-4 py-2 ${activeTab === "upload" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
                onClick={() => setActiveTab("upload")}
              >
                Upload
              </button>
            </div>

            {activeTab === "url" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                {imageUrl && (
                  <div className="border rounded-md p-2 mt-2">
                    <p className="text-sm text-gray-500 mb-2">Preview:</p>
                    <div className="flex justify-center">
                      <img
                        src={imageUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="max-h-[200px] max-w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=300"
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Upload Image</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                {uploadedImage && (
                  <div className="border rounded-md p-2 mt-2">
                    <p className="text-sm text-gray-500 mb-2">Preview:</p>
                    <div className="flex justify-center">
                      <img
                        src={uploadedImage || "/placeholder.svg"}
                        alt="Preview"
                        className="max-h-[200px] max-w-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!showCropper && (
          <div className="flex justify-end gap-2 p-4 border-t">
            <button onClick={handleClose} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={activeTab === "url" ? handleUrlInsert : handleFileInsert}
              disabled={activeTab === "url" ? !imageUrl : !uploadedImage}
              className={`px-4 py-2 rounded-md text-white ${
                (activeTab === "url" && imageUrl) || (activeTab === "upload" && uploadedImage)
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-blue-300 cursor-not-allowed"
              }`}
            >
              Insert
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

