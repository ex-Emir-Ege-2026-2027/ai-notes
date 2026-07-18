"use client";

import { UploadDropzone } from "@/components/ui/upload-dropzone";
import { FileText, FileUp, Info } from "lucide-react";

export default function UploadPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <FileUp className="h-4 w-4 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Dosya Yükle</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          PDF ve görsel dosyalarınızı Supabase Storage'a yükleyin
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div className="text-sm">
          <p className="font-medium text-primary">Yapay Zeka Analizi</p>
          <p className="text-muted-foreground">
            Yüklenen PDF dosyaları, not detay sayfasında AI asistanı tarafından
            analiz edilebilir. Backend API hazır olduğunda otomatik olarak
            aktif hale gelecek.
          </p>
        </div>
      </div>

      {/* Dropzone */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <FileText className="h-4 w-4 text-muted-foreground" />
          Dosya Yükleme Alanı
        </h2>
        <UploadDropzone />
      </div>

      {/* Supported formats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { ext: "PDF", desc: "Ders notları, kitaplar", color: "#ef4444" },
          { ext: "PNG", desc: "Ekran görüntüleri", color: "#3b82f6" },
          { ext: "JPG", desc: "Fotoğraflar", color: "#10b981" },
          { ext: "WEBP", desc: "Web görselleri", color: "#8b5cf6" },
        ].map(({ ext, desc, color }) => (
          <div
            key={ext}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white"
              style={{ backgroundColor: color }}
            >
              {ext}
            </div>
            <div>
              <p className="text-xs font-semibold">.{ext.toLowerCase()}</p>
              <p className="text-[10px] text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
