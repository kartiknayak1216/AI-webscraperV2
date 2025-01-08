"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Period = {
  month: number;
  year: number;
};

const monthToNumber: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

const numberToMonth = Object.entries(monthToNumber).reduce(
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {} as Record<number, string>
);

const numberToMonthName = (month: number): string =>
  numberToMonth[month] || "Invalid month";

export default function Periodselection({
  period,
  selected,
}: {
  period: Period[];
  selected: Period;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedMonthName = numberToMonthName(selected.month);
  const monthString = `${selectedMonthName}-${selected.year}`;

  return (
    <Select
      onValueChange={(value) => {
        const [month, year] = value.split("-");
        const monthInt = monthToNumber[month];
        if (!monthInt) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set("month", monthInt.toString());
        params.set("year", year);
        router.push(`?${params.toString()}`);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={monthString} />
      </SelectTrigger>
      <SelectContent>
        {period.map((per) => {
          const month = numberToMonthName(per.month);
          const year = per.year;
          const valueString = `${month}-${year}`;
          return (
            <SelectItem value={valueString} key={valueString}>
              {valueString}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
