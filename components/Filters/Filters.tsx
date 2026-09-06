"use client";

import { useState } from "react";
import { FaMap } from "react-icons/fa";
import type { CamperFilters } from "@/types/camper";
import styles from "./Filters.module.css";

const bodyTypes = [
  ["alcove", "Alcove"],
  ["panel_truck", "Panel Van"],
  ["integrated", "Integrated"],
  ["semi_integrated", "Semi Integrated"],
];
const engines = [
  ["diesel", "Diesel"],
  ["petrol", "Petrol"],
  ["hybrid", "Hybrid"],
  ["electric", "Electric"],
];
const transmissions = [
  ["automatic", "Automatic"],
  ["manual", "Manual"],
];

function RadioGroup({
  name,
  legend,
  options,
  value,
  onChange,
}: {
  name: string;
  legend: string;
  options: string[][];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.radioList}>
        {options.map(([optionValue, label]) => (
          <label className={styles.radio} key={optionValue}>
            <input
              type="radio"
              name={name}
              value={optionValue}
              checked={value === optionValue}
              onChange={() => onChange(optionValue)}
            />
            <span className={styles.radioMark} aria-hidden="true" />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function Filters({
  initial,
  onApply,
}: {
  initial: CamperFilters;
  onApply: (filters: CamperFilters) => void;
}) {
  const [draft, setDraft] = useState(initial);
  const update = (key: keyof CamperFilters, value: string) =>
    setDraft((current) => ({ ...current, [key]: value }));
  const clear = () => {
    const empty = { location: "", form: "", engine: "", transmission: "" };
    setDraft(empty);
    onApply(empty);
  };

  return (
    <aside className={styles.sidebar} aria-label="Camper filters">
      <label className={styles.locationLabel}>
        <span>Location</span>
        <span className={styles.inputWrap}>
          <FaMap aria-hidden="true" />
          <input
            value={draft.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="City"
            aria-label="Location"
          />
        </span>
      </label>
      <div className={styles.filtersTitle}>Filters</div>
      <RadioGroup
        name="camper-form"
        legend="Camper form"
        options={bodyTypes}
        value={draft.form}
        onChange={(value) => update("form", value)}
      />
      <RadioGroup
        name="engine"
        legend="Engine"
        options={engines}
        value={draft.engine}
        onChange={(value) => update("engine", value)}
      />
      <RadioGroup
        name="transmission"
        legend="Transmission"
        options={transmissions}
        value={draft.transmission}
        onChange={(value) => update("transmission", value)}
      />
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.search}
          onClick={() => onApply(draft)}
        >
          Search
        </button>
        <button type="button" className={styles.clear} onClick={clear}>
          <span aria-hidden="true">×</span>Clear filters
        </button>
      </div>
    </aside>
  );
}
