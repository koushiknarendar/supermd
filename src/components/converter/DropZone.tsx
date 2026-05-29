"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, X } from "lucide-react"
import { cn } from "@/lib/utils"

const ACCEPTED_TYPES = {
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "application/vnd.ms-excel": [".xls", ".csv"],
  "text/csv": [".csv"],
  "application/csv": [".csv"],
  "text/comma-separated-values": [".csv"],
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/tiff": [".tiff", ".tif"],
  "text/html": [".html", ".htm"],
  "text/plain": [".txt", ".md", ".csv"],
}

interface Props {
  onFile: (file: File) => void
  disabled?: boolean
}

export function DropZone({ onFile, disabled }: Props) {
  const [file, setFile] = useState<File | null>(null)

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) {
        setFile(accepted[0])
        onFile(accepted[0])
      }
    },
    [onFile]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled,
  })

  function clear(e: React.MouseEvent) {
    e.stopPropagation()
    setFile(null)
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all cursor-pointer",
        isDragActive && !isDragReject && "border-zinc-900 bg-zinc-50",
        isDragReject && "border-red-400 bg-red-50",
        !isDragActive && !file && "border-zinc-300 hover:border-zinc-500 hover:bg-zinc-50",
        file && "border-zinc-400 bg-zinc-50",
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      <input {...getInputProps()} />

      {file ? (
        <div className="flex flex-col items-center gap-3">
          <FileText className="h-10 w-10 text-zinc-500" />
          <div className="text-sm font-medium text-zinc-800">{file.name}</div>
          <div className="text-xs text-zinc-400">
            {(file.size / 1024).toFixed(1)} KB
          </div>
          <button
            onClick={clear}
            className="mt-1 flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-600"
          >
            <X className="h-3 w-3" /> Remove
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <Upload
            className={cn(
              "h-10 w-10 transition-colors",
              isDragActive ? "text-zinc-800" : "text-zinc-400"
            )}
          />
          <div>
            <p className="text-sm font-medium text-zinc-700">
              {isDragActive ? "Drop it!" : "Drop a file or click to browse"}
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              PDF, DOCX, XLSX, CSV, JPG, PNG — up to 5 MB
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
