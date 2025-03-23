/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef, useCallback } from "react"
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"

// Image Cropper Component
export const ImageCropper = ({ 
  src, 
  onCropComplete,
  onCancel 
}: { 
  src: string;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
}) => {
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState(null)
  const imgRef = useRef(null)

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget

    // Initialize with a centered square crop
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        16 / 9,
        width,
        height,
      ),
      width,
      height,
    )

    setCrop(crop as any)
  }

  const getCroppedImg = useCallback(() => {
    if (!completedCrop || !imgRef.current) return

    const image = imgRef.current
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      return
    }

    // Set canvas dimensions to cropped image size
    const scaleX = (image as HTMLImageElement).naturalWidth / (image as HTMLImageElement).width
    const scaleY = (image as HTMLImageElement).naturalHeight / (image as HTMLImageElement).height
    canvas.width = (completedCrop as any).width * scaleX
    canvas.height = (completedCrop as any).height * scaleY

    // Draw the cropped image
    ctx.drawImage(
      image,
      (completedCrop as any).x * scaleX,
      (completedCrop as any).y * scaleY,
      (completedCrop as any).width * scaleX,
      (completedCrop as any).height * scaleY,
      0,
      0,
      (completedCrop as any).width * scaleX,
      (completedCrop as any).height * scaleY,
    )

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (!blob) return
      const croppedImageUrl = URL.createObjectURL(blob)
      onCropComplete(croppedImageUrl)
    })
  }, [completedCrop, onCropComplete])

  return (
    <div className="p-4 flex flex-col gap-4">
      <ReactCrop crop={crop} onChange={(c) => setCrop(c as any)} onComplete={(c) => setCompletedCrop(c as any)} aspect={16 / 9}>
        <img
          ref={imgRef}
          src={src || "/placeholder.svg"}
          onLoad={onImageLoad}
          className="max-h-[400px] max-w-full object-contain"
        />
      </ReactCrop>

      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
          Cancel
        </button>
        <button onClick={getCroppedImg} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
          Apply Crop
        </button>
      </div>
    </div>
  )
}

