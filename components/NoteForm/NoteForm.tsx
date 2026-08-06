"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import { createNote } from "@/lib/api";
import css from "./NoteForm.module.css";

export interface NoteFormProps {
  onCancel: () => void;
}

const schema = Yup.object({
  title: Yup.string()
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters")
    .required("Required"),
  content: Yup.string().max(500, "Maximum 500 characters"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Required"),
});
const initialValues = { title: "", content: "", tag: "Todo" as const };

export default function NoteForm({ onCancel }: { onCancel: () => void }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => mutation.mutate(values)}
      validationSchema={schema}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field className={css.input} id="title" name="title" type="text" />
            <ErrorMessage className={css.error} component="span" name="title" />
          </div>
          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              className={css.textarea}
              id="content"
              name="content"
              rows={8}
            />
            <ErrorMessage
              className={css.error}
              component="span"
              name="content"
            />
          </div>
          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" className={css.select} id="tag" name="tag">
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
          </div>
          <div className={css.actions}>
            <button
              className={css.cancelButton}
              onClick={onCancel}
              type="button"
            >
              Cancel
            </button>
            <button
              className={css.submitButton}
              disabled={isSubmitting || mutation.isPending}
              type="submit"
            >
              {mutation.isPending ? "Creating..." : "Create note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
