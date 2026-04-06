import * as React from "react"
import { useRef, useState, useEffect } from 'react'
import { ImagePlus, X, UploadCloud, RefreshCw, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface FileUploadProps {
    value?: File | string | null;
    onChange?: (file: File | null) => void;
    onRemove?: () => void;
    className?: string;
    accept?: string;
    id?: string;
}

export function FileUpload({
    value,
    onChange,
    onRemove,
    className,
    accept = 'image/*',
    id,
}: FileUploadProps) {
    const [preview, setPreview] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!value) {
            setPreview(null)
            return
        }

        if (typeof value === 'string') {
            setPreview(value)
        } else if (value instanceof File) {
            const objectUrl = URL.createObjectURL(value)
            setPreview(objectUrl)
            return () => URL.revokeObjectURL(objectUrl)
        }
    }, [value])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        if (onChange) onChange(file)
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    };

    const handleDragLeave = () => {
        setIsDragging(false)
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0] || null
        if (onChange) onChange(file)
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    };

    return (
        <div 
            className={cn(
                "relative group w-full min-h-[160px] rounded-xl border-2 border-dashed transition-all duration-300 ease-in-out flex flex-col items-center justify-center overflow-hidden bg-muted/30 hover:bg-muted/50",
                isDragging ? "border-primary bg-primary/5 shadow-inner" : "border-muted-foreground/20",
                className
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                type="file"
                id={id}
                ref={fileInputRef}
                className="hidden"
                accept={accept}
                onChange={handleFileChange}
            />

            {preview ? (
                <div className="absolute inset-0 w-full h-full animate-in fade-in zoom-in duration-500">
                    <img 
                        src={preview} 
                        alt="Preview" 
                        className="w-full h-full object-contain bg-background/50 backdrop-blur-sm"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <Button 
                            type="button"
                            variant="secondary" 
                            size="sm"
                            onClick={triggerFileInput}
                            className="h-10 px-4 gap-2 backdrop-blur-md bg-white/20 hover:bg-white/30 text-white border-white/20"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Ubah
                        </Button>
                        <Button 
                            type="button"
                            variant="destructive" 
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onRemove) onRemove();
                            }}
                            className="h-10 px-4 gap-2 shadow-lg"
                        >
                            <X className="w-4 h-4" />
                            Hapus
                        </Button>
                    </div>
                </div>
            ) : (
                <div 
                    className="flex flex-col items-center justify-center p-6 cursor-pointer w-full h-full"
                    onClick={triggerFileInput}
                >
                    <div className={cn(
                        "w-14 h-14 rounded-2xl bg-background flex items-center justify-center mb-4 shadow-sm border border-border transition-all duration-500 group-hover:shadow-md group-hover:-translate-y-1",
                        isDragging ? "scale-110 border-primary shadow-primary/20" : ""
                    )}>
                        <UploadCloud className={cn(
                            "w-7 h-7 transition-colors duration-300",
                            isDragging ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                        )} />
                    </div>
                    <p className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        Klik atau seret foto ke sini
                    </p>
                    <p className="text-xs text-muted-foreground/80">
                        PNG, JPG atau WEBP (Maks. 2MB)
                    </p>
                </div>
            )}
        </div>
    );
}
