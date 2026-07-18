export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ─── Domain Types ──────────────────────────────────────────────

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  category_id: string | null;
  title: string;
  content: string;
  summary: string | null;
  keywords: string[] | null;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface NoteFile {
  id: string;
  user_id: string;
  note_id: string | null;
  name: string;
  size: number;
  mime_type: string;
  storage_path: string;
  created_at: string;
}

export type AIResultType = "summary" | "keywords" | "questions" | "quiz";

export interface AIResult {
  id: string;
  note_id: string;
  user_id: string;
  type: AIResultType;
  result: Json;
  created_at: string;
}

// ─── AI Response Shapes ────────────────────────────────────────

export interface SummaryResult {
  text: string;
}

export interface KeywordsResult {
  keywords: string[];
}

export interface QuestionsResult {
  questions: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number; // 0-indexed
  explanation?: string;
}

export interface QuizResult {
  questions: QuizQuestion[];
}

// ─── Form Types ────────────────────────────────────────────────

export interface NoteFormData {
  title: string;
  content: string;
  category_id: string | null;
}

export interface CategoryFormData {
  name: string;
  color: string;
}

// ─── User Stats ────────────────────────────────────────────────

export interface UserStats {
  noteCount: number;
  categoryCount: number;
  fileCount: number;
  aiUsageCount: number;
}
