import { Upload, X } from "lucide-react"
import React, { FC, useCallback } from "react"
import { useDropzone } from "react-dropzone"

import { Button } from "./button"

export interface ImageData {
    file: File | null
    image: File | null
}

interface DragAndDropProps {
    imageData: ImageData
    setImageData: (prev: ImageData) => void
}

const DragAndDrop: FC<DragAndDropProps> = ({ imageData, setImageData }) => {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles && acceptedFiles.length > 0) {
                setImageData({
                    ...imageData,
                    image: acceptedFiles[0],
                })
            }
        },
        [setImageData, imageData],
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".gif"],
        },
        multiple: false,
    })

    return (
        <div
            {...getRootProps()}
            className={`relative flex h-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed p-4 text-center ${
                isDragActive ? "border-primary" : "border-gray-300"
            }`}
        >
            <input
                type="file"
                name="image"
                accept="image/*"
                {...getInputProps()}
            />
            {imageData.image ? (
                <div className="flex items-center justify-center">
                    <img
                        src={URL.createObjectURL(imageData.image)}
                        alt="Preview"
                        className="h-full max-w-full rounded-2xl"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-6 top-6 size-9"
                        onClick={(e) => {
                            e.stopPropagation()
                            setImageData({
                                ...imageData,
                                image: null,
                            })
                        }}
                    >
                        <X className="size-4" />
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <Upload className="mb-2 size-8 text-gray-500" />
                    <p className="text-sm text-gray-500">
                        {isDragActive
                            ? "Перетащите изображение сюда"
                            : "Нажмите или перетащите изображение сюда"}
                    </p>
                </div>
            )}
        </div>
    )
}

export default DragAndDrop
