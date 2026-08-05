import axios from "axios";
import type { Note } from "@/types/note";

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}` },
});

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
export interface FetchNotesParams {
  page: number;
  perPage?: number;
  search?: string;
}

export async function fetchNotes({
  page,
  perPage = 12,
  search = "",
}: FetchNotesParams) {
  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: { page, perPage, ...(search && { search }) },
  });
  return data;
}

export async function fetchNoteById(id: string) {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(
  noteData: Omit<Note, "id" | "createdAt" | "updatedAt">,
) {
  const { data } = await api.post<Note>("/notes", noteData);
  return data;
}

export async function deleteNote(id: string) {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}
