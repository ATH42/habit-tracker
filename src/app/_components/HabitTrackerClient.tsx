// components/HabitTrackerClient.tsx
"use client";

import React, { useState, useEffect } from "react";
import { FieldCreator } from "./FieldCreator";
import { DailyEntries } from "./DailyEntries";
import { WeeklyOverview } from "./WeeklyOverview";
import type {
  CustomField,
  DailyEntry,
  FieldValue,
} from "~/types/habit-tracker";

export default function HabitTrackerClient() {
  const [fields, setFields] = useState<CustomField[]>(() => {
    if (typeof window === "undefined") return [];

    const saved = localStorage.getItem("trackerFields");
    if (!saved) return [];

    try {
      const parsed: unknown = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];

      // Type guard function to validate CustomField
      const isCustomField = (field: unknown): field is CustomField => {
        if (typeof field !== "object" || field === null) return false;

        const f = field as Partial<CustomField>;
        if (typeof f.id !== "string" || typeof f.name !== "string")
          return false;

        switch (f.type) {
          case "number":
          case "boolean":
          case "text":
          case "datetime":
            return true;
          case "choice":
            return (
              Array.isArray(f.options) &&
              f.options.every((opt) => typeof opt === "string")
            );
          default:
            return false;
        }
      };

      return parsed.filter(isCustomField);
    } catch {
      return [];
    }
  });

  const [entries, setEntries] = useState<Record<string, DailyEntry>>(() => {
    if (typeof window === "undefined") return {};

    const saved = localStorage.getItem("trackerEntries");
    if (!saved) return {};

    try {
      const parsed: unknown = JSON.parse(saved);
      if (typeof parsed !== "object" || parsed === null) return {};

      // Type guard for FieldValue
      const isFieldValue = (value: unknown): value is FieldValue => {
        if (typeof value !== "object" || value === null) return false;

        const v = value as { type?: string; value?: unknown };
        if (!("type" in v)) return false;

        switch (v.type) {
          case "number":
            return v.value === null || typeof v.value === "number";
          case "boolean":
            return v.value === null || typeof v.value === "boolean";
          case "text":
          case "choice":
          case "datetime":
            return typeof v.value === "string";
          default:
            return false;
        }
      };

      // Validate the structure of the entries
      const validatedEntries: Record<string, DailyEntry> = {};

      Object.entries(parsed as Record<string, unknown>).forEach(
        ([date, entry]) => {
          if (typeof entry === "object" && entry !== null) {
            const validEntry: DailyEntry = {};
            Object.entries(entry as Record<string, unknown>).forEach(
              ([fieldId, value]) => {
                if (isFieldValue(value)) {
                  validEntry[fieldId] = value;
                }
              },
            );
            if (Object.keys(validEntry).length > 0) {
              validatedEntries[date] = validEntry;
            }
          }
        },
      );

      return validatedEntries;
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("trackerFields", JSON.stringify(fields));
  }, [fields]);

  useEffect(() => {
    localStorage.setItem("trackerEntries", JSON.stringify(entries));
  }, [entries]);

  const setEntriesAction = (newEntries: Record<string, DailyEntry>) => {
    setEntries(newEntries);
  };

  return (
    <div className="space-y-8">
      <FieldCreator fields={fields} setFields={setFields} />
      <DailyEntries
        fields={fields}
        entries={entries}
        setEntriesAction={setEntriesAction}
      />
      <WeeklyOverview fields={fields} entries={entries} />
    </div>
  );
}
