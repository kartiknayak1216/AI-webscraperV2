"use client";

import React from "react";
import { getstatsForday } from "./server/server";
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

type stats = Awaited<ReturnType<typeof getstatsForday>>;

const config = {
  creditConsumed: {
    label: "Credits Consumed",
    color: "hsl(var(--chart-4))",
  },
};

export default function CreditConsumedChart({ stats }: { stats: stats }) {
  const chartData = Object.entries(stats).map(([date, values]) => ({
    date,
    creditConsumed: values.creditConsumed,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Layers2 className="w-6 h-6 text-primary" />
          Credit Consumption
        </CardTitle>
        <CardDescription>
          Daily credits consumed for workflow executions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="max-h-[300px] w-full" config={config}>
          <BarChart
            data={chartData}
            height={300}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis />
            <ChartLegend />
            <ChartTooltip />
            <Bar
              dataKey="creditConsumed"
              fill="var(--color-creditConsumed)"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
