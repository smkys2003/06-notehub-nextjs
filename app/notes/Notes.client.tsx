"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import css from "./page.module.css";

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes({ page, perPage: 12, search }),
    placeholderData: keepPreviousData,
  });
  return (
    <main className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          onChange={(value) => {
            setInputValue(value);
            debouncedSearch(value);
          }}
          value={inputValue}
        />
        {data && data.totalPages > 1 ? (
          <Pagination
            currentPage={page}
            onPageChange={setPage}
            totalPages={data.totalPages}
          />
        ) : (
          <div className={css.spacer} />
        )}
        <button
          className={css.button}
          onClick={() => setIsModalOpen(true)}
          type="button"
        >
          Create note +
        </button>
      </header>
      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Error: {error.message}</p>}
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}{" "}
      {data && !data.notes.length && !isLoading && <p>No notes found.</p>}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </main>
  );
}
