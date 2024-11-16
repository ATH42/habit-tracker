// types/habit-tracker.ts
export type FieldValue =
  | { type: "number"; value: number | null }
  | { type: "boolean"; value: boolean | null }
  | { type: "text"; value: string }
  | { type: "choice"; value: string }
  | { type: "datetime"; value: string };

export type FieldType = FieldValue["type"];

export interface BaseField {
  id: string;
  name: string;
}

export type CustomField =
  | (BaseField & { type: "number" })
  | (BaseField & { type: "boolean" })
  | (BaseField & { type: "text" })
  | (BaseField & { type: "choice"; options: string[] })
  | (BaseField & { type: "datetime" });

export type DailyEntry = Record<string, FieldValue>;
