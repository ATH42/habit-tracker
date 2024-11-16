// components/WeeklyOverview.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { CustomField, DailyEntry } from "~/types/habit-tracker";

interface WeeklyOverviewProps {
  fields: CustomField[];
  entries: Record<string, DailyEntry>;
}

export function WeeklyOverview({ fields, entries }: WeeklyOverviewProps) {
  const getWeekDates = () => {
    const dates: string[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      // Ensure dateStr is not undefIned before pushing
      if (dateStr) {
        dates.push(dateStr);
      }
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const chartData = weekDates.map((date) => {
    if (!(date in entries)) {
      return {
        date,
        ...fields.reduce<Record<string, number>>((acc, field) => {
          if (field.type === "number") {
            acc[field.name] = 0;
          }
          return acc;
        }, {}),
      };
    }

    const entry = entries[date];
    return {
      date,
      ...fields.reduce<Record<string, number>>((acc, field) => {
        if (field.type === "number") {
          const fieldValue = entry?.[field.id];
          acc[field.name] =
            fieldValue?.type === "number" &&
            typeof fieldValue.value === "number"
              ? fieldValue.value
              : 0;
        }
        return acc;
      }, {}),
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              {fields
                .filter(
                  (field): field is CustomField & { type: "number" } =>
                    field.type === "number",
                )
                .map((field) => (
                  <Line
                    key={field.id}
                    type="monotone"
                    dataKey={field.name}
                    stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
