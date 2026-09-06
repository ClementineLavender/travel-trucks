"use client";

import { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { createBooking } from "@/lib/api";
import styles from "./BookingForm.module.css";

export default function BookingForm({ camperId }: { camperId: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const nextErrors: Record<string, string> = {};

    if (!name) nextErrors.name = "Please enter your name.";
    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      nextErrors.email = "Please enter your email.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      await createBooking(camperId, { name, email });
      form.reset();
      setErrors({});
      toast.success("Your booking request has been sent!");
    } catch {
      toast.error("We couldn't send your booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <h2>Book your campervan now</h2>
      <p>Stay connected! We are always ready to help you.</p>
      <label className={styles.field}>
        <span>Name*</span>
        <input
          name="name"
          autoComplete="name"
          placeholder="Name*"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "booking-name-error" : undefined}
        />
        {errors.name && <small id="booking-name-error">{errors.name}</small>}
      </label>
      <label className={styles.field}>
        <span>Email*</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Email*"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "booking-email-error" : undefined}
        />
        {errors.email && <small id="booking-email-error">{errors.email}</small>}
      </label>
      <button type="submit" disabled={submitting}>
        {submitting ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
