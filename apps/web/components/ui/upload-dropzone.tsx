"use client";

import {
  getFileSignedUrl,
  uploadFileAndSaveMetadata,
} from "@/lib/supabase/storage";
import type { NoteFile } from "@/lib/types";
import { cn } from "@workspace/ui/lib/utils";
import {
  CheckCircle,
  FileText,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";

interface UploadDropzoneProps {
  onUploaded?: (file: NoteFile) => void;
  noteId?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface UploadItem {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
  result?: NoteFile;
}

export function UploadDropzone({ onUploaded, noteId }: UploadDropzoneProps) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragging, setDragging] = useState(false);

  const uploadFile = async (file: File, index: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, status: "uploading", progress: 0 } : item,
      ),
    );

    // Simulate progress (Supabase Storage doesn't expose upload progress)
    const progressInterval = setInterval(() => {
      setItems((prev) =>
        prev.map((item, i) =>
          i === index && item.progress < 85
            ? { ...item, progress: item.progress + 15 }
            : item,
        ),
      );
    }, 200);

    try {
      const result = await uploadFileAndSaveMetadata(file, {
        noteId: noteId ?? null,
      });

      clearInterval(progressInterval);

      setItems((prev) =>
        prev.map((item, i) =>
          i === index
            ? { ...item, status: "done", progress: 100, result }
            : item,
        ),
      );

      onUploaded?.(result);
    } catch (e) {
      clearInterval(progressInterval);
      setItems((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                status: "error",
                error: e instanceof Error ? e.message : "Yükleme başarısız",
              }
            : item,
        ),
      );
    }
  };

  const handleOpenSignedUrl = async (index: number) => {
    const item = items[index];
    if (!item?.result) return;

    try {
      const signedUrl = await getFileSignedUrl(item.result.storage_path, 60);
      if (!signedUrl) {
        throw new Error("Signed URL oluşturulamadı");
      }

      window.open(signedUrl, "_blank", "noopener,noreferrer");
    } catch (e) {
      setItems((prev) =>
        prev.map((current, i) =>
          i === index
            ? {
                ...current,
                error:
                  e instanceof Error
                    ? e.message
                    : "Signed URL alınamadı",
              }
            : current,
        ),
      );
    }
  };

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const accepted = Array.from(files).filter((f) => {
        const ok = ["application/pdf", "image/png", "image/jpeg", "image/webp"].includes(f.type);
        return ok && f.size <= 50 * 1024 * 1024;
      });

      const startIndex = items.length;
      const newItems: UploadItem[] = accepted.map((f) => ({
        file: f,
        progress: 0,
        status: "pending",
      }));

      setItems((prev) => [...prev, ...newItems]);

      accepted.forEach((acceptedFile, i) => {
        setTimeout(() => uploadFile(acceptedFile, startIndex + i), i * 300);
      });
    },
    [items.length], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200",
          dragging
            ? "border-primary bg-primary/10 scale-[1.01]"
            : "border-border bg-muted/20 hover:border-primary/40 hover:bg-primary/5",
        )}
      >
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-transform",
            dragging && "scale-110",
          )}
        >
          <Upload className="h-7 w-7 text-primary" />
        </div>

        <div>
          <p className="text-sm font-semibold">
            {dragging
              ? "Dosyayı bırakın"
              : "Dosyaları sürükleyin veya seçin"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PDF, PNG, JPG, WEBP • Maks. 50 MB
          </p>
        </div>

        <label className="cursor-pointer">
          <input
            type="file"
            multiple
            accept=".pdf,image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => e.target.files && addFiles(e.target.files)}
          />
          <span className="rounded-xl border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors">
            Dosya Seç
          </span>
        </label>
      </div>

      {/* Upload list */}
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
            >
              {/* Icon */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                {item.status === "done" ? (
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-500" />
                ) : item.status === "error" ? (
                  <X className="h-4.5 w-4.5 text-destructive" />
                ) : item.status === "uploading" ? (
                  <Loader2 className="h-4.5 w-4.5 animate-spin text-primary" />
                ) : (
                  <FileText className="h-4.5 w-4.5 text-muted-foreground" />
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{item.file.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {formatBytes(item.file.size)}
                  {item.status === "error" && (
                    <span className="ml-1 text-destructive">— {item.error}</span>
                  )}
                </p>
                {item.status === "uploading" && (
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {item.status === "done" && item.result && (
                  <button
                    onClick={() => handleOpenSignedUrl(i)}
                    className="rounded-md border border-border px-2 py-1 text-[10px] font-medium hover:bg-muted"
                  >
                    Goruntule
                  </button>
                )}

                {/* Remove */}
                <button
                  onClick={() => removeItem(i)}
                  className="rounded-md p-1 hover:bg-muted"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
