import { createClient } from "@/lib/supabase/client";
import type { NoteFile } from "@/lib/types";

const FILE_BUCKET = "note-files";

interface UploadFileParams {
  noteId?: string | null;
  userId?: string;
}

function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  const ext = parts.length > 1 ? parts.pop() : undefined;
  return ext?.trim().toLowerCase() || "bin";
}

export async function uploadFileAndSaveMetadata(
  file: File,
  params: UploadFileParams = {},
): Promise<NoteFile> {
  const supabase = createClient();
  let userId = params.userId;

  if (!userId) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!user) {
      throw new Error("Oturum bulunamadı");
    }

    userId = user.id;
  }

  const fileExt = getFileExtension(file.name);
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { data: storageData, error: storageError } = await supabase.storage
    .from(FILE_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (storageError) {
    throw storageError;
  }

  const { data: dbData, error: dbError } = await supabase
    .from("files")
    .insert({
      user_id: userId,
      note_id: params.noteId ?? null,
      name: file.name,
      size: file.size,
      mime_type: file.type,
      storage_path: storageData.path,
    })
    .select()
    .single();

  if (dbError) {
    await supabase.storage.from(FILE_BUCKET).remove([filePath]);
    throw dbError;
  }

  return dbData as NoteFile;
}

export async function getFileSignedUrl(
  storagePath: string,
  expiresInSeconds = 60,
): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(FILE_BUCKET)
    .createSignedUrl(storagePath, expiresInSeconds);

  if (error) {
    throw error;
  }

  return data?.signedUrl ?? null;
}
