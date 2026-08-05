"use client";

import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <ReactPaginate
      activeClassName={css.active}
      containerClassName={css.pagination}
      forcePage={currentPage - 1}
      marginPagesDisplayed={1}
      nextLabel="»"
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      pageCount={totalPages}
      pageRangeDisplayed={5}
      previousLabel="«"
    />
  );
}
