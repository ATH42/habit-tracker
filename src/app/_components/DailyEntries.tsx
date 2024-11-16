"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

// Type for the possible values that can be stored
type FieldValue =
  | { type: "number"; value: number | null }
  | { type: "boolean"; value: boolean | null }
  | { type: "text"; value: string }
  | { type: "choice"; value: string }
  | { type: "datetime"; value: string };

// Define the field types
type FieldType = FieldValue["type"];

interface BaseField {
  id: string;
  name: string;
}

// Discriminated union for field types
type CustomField =
  | (BaseField & { type: "number" })
  | (BaseField & { type: "boolean" })
  | (BaseField & { type: "text" })
  | (BaseField & { type: "choice"; options: string[] })
  | (BaseField & { type: "datetime" });

// Type for a single day's entries
type DailyEntry = Record<string, FieldValue>;

interface DailyEntriesProps {
  fields: CustomField[];
  entries: Record<string, DailyEntry>;
  setEntriesAction: (entries: Record<string, DailyEntry>) => void;
}

export function DailyEntries({
  fields,
  entries,
  setEntriesAction,
}: DailyEntriesProps) {
  const today = new Date().toISOString().split("T")[0];

  const handleEntryUpdate = (
    fieldId: string,
    field: CustomField,
    newValue: string,
  ) => {
    // Create empty DailyEntry if today's entries don't exist
    const todayEntries =
      today && today in entries ? entries[today] : ({} as DailyEntry);

    let typedValue: FieldValue;

    switch (field.type) {
      case "number":
        typedValue = {
          type: "number",
          value: newValue === "" ? null : parseFloat(newValue),
        };
        break;
      case "boolean":
        typedValue = {
          type: "boolean",
          value: newValue === "" ? null : newValue === "true",
        };
        break;
      case "choice":
        typedValue = {
          type: "choice",
          value: newValue,
        };
        break;
      case "datetime":
        typedValue = {
          type: "datetime",
          value: newValue,
        };
        break;
      case "text":
        typedValue = {
          type: "text",
          value: newValue,
        };
        break;
      default:
        throw new Error(`Unhandled field type encountered`);
    }

    setEntriesAction({
      ...entries,
      [today!]: {
        ...todayEntries,
        [fieldId]: typedValue,
      },
    });
  };

  const getCurrentValue = (
    field: CustomField,
    fieldEntry?: FieldValue,
  ): string => {
    if (!fieldEntry) return "";

    if (fieldEntry.type !== field.type) {
      console.error(`Type mismatch for field ${field.id}`);
      return "";
    }

    if (fieldEntry.value === null) return "";
    return fieldEntry.value.toString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Entries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fields.map((field) => {
            const fieldEntry =
              today && today in entries
                ? entries[today]?.[field.id]
                : undefined;

            return (
              <div key={field.id}>
                <label className="mb-2 block font-medium">{field.name}</label>
                {field.type === "number" ? (
                  <Input
                    type="number"
                    value={getCurrentValue(field, fieldEntry)}
                    onChange={(e) =>
                      handleEntryUpdate(field.id, field, e.target.value)
                    }
                    className="w-full"
                  />
                ) : field.type === "boolean" ? (
                  <Select
                    value={getCurrentValue(field, fieldEntry)}
                    onValueChange={(value) =>
                      handleEntryUpdate(field.id, field, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                ) : field.type === "choice" ? (
                  <Select
                    value={getCurrentValue(field, fieldEntry)}
                    onValueChange={(value) =>
                      handleEntryUpdate(field.id, field, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option..." />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={getCurrentValue(field, fieldEntry)}
                    onChange={(e) =>
                      handleEntryUpdate(field.id, field, e.target.value)
                    }
                    className="w-full"
                    type={field.type === "datetime" ? "datetime-local" : "text"}
                  />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
