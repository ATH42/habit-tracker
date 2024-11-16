// components/FieldCreator.tsx
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { CustomField, FieldType } from "~/types/habit-tracker";

const FIELD_TYPES = {
  number: "Number",
  boolean: "Yes/No",
  choice: "Multiple Choice",
  text: "Text",
  datetime: "Date/Time",
} as const;

interface FieldCreatorProps {
  fields: CustomField[];
  setFields: React.Dispatch<React.SetStateAction<CustomField[]>>;
}

type NewFieldState = {
  name: string;
  type: FieldType;
  options: string[];
};

export function FieldCreator({ fields, setFields }: FieldCreatorProps) {
  const [newField, setNewField] = useState<NewFieldState>({
    name: "",
    type: "number",
    options: [],
  });

  const handleAddField = () => {
    if (!newField.name) return;

    const baseField = {
      id: Date.now().toString(),
      name: newField.name,
    };

    let fieldToAdd: CustomField;

    switch (newField.type) {
      case "number":
        fieldToAdd = { ...baseField, type: "number" };
        break;
      case "boolean":
        fieldToAdd = { ...baseField, type: "boolean" };
        break;
      case "text":
        fieldToAdd = { ...baseField, type: "text" };
        break;
      case "choice":
        fieldToAdd = {
          ...baseField,
          type: "choice",
          options: newField.options,
        };
        break;
      case "datetime":
        fieldToAdd = { ...baseField, type: "datetime" };
        break;
      default:
        throw new Error(`Unhandled field type: ${newField.type as string}`);
    }

    setFields((prev) => [...prev, fieldToAdd]);

    setNewField({
      name: "",
      type: "number",
      options: [],
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Tracking Field</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Input
            placeholder="Field name"
            value={newField.name}
            onChange={(e) =>
              setNewField((prev) => ({ ...prev, name: e.target.value }))
            }
            className="flex-1"
          />
          <Select
            value={newField.type}
            onValueChange={(value: FieldType) =>
              setNewField((prev) => ({
                ...prev,
                type: value,
                // Reset options when changing type
                options: value === "choice" ? prev.options : [],
              }))
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(FIELD_TYPES) as [FieldType, string][]).map(
                ([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
          <Button onClick={handleAddField}>Add Field</Button>
        </div>

        {newField.type === "choice" && (
          <div className="mt-4">
            <div className="flex gap-4">
              <Input
                placeholder="Add option"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    setNewField((prev) => ({
                      ...prev,
                      options: [...prev.options, e.currentTarget.value],
                    }));
                    e.currentTarget.value = "";
                  }
                }}
                className="flex-1"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {newField.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded bg-gray-100 px-2 py-1"
                >
                  <span>{option}</span>
                  <button
                    onClick={() =>
                      setNewField((prev) => ({
                        ...prev,
                        options: prev.options.filter((_, i) => i !== index),
                      }))
                    }
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
