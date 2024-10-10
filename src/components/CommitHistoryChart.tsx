// src/CommitHistoryChart.tsx

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

interface Commit {
  date: string; // Commit date in string format
  message: string; // Commit message
}

// Sample data format to use for the chart
interface ChartData {
  date: string;
  count: number;
}

interface CommitHistoryChartProps {
  commits: Commit[];
}

const CommitHistoryChart: React.FC<CommitHistoryChartProps> = ({ commits }) => {
  // Convert commit dates to a format suitable for the chart
  const chartData: ChartData[] = [];
  const dateCountMap: Record<string, number> = {};

  // Count commits by date
  commits.forEach((commit) => {
    const date = new Date(commit.date).toLocaleDateString(); // Format date
    dateCountMap[date] = (dateCountMap[date] || 0) + 1;
  });

  // Convert the dateCountMap to chart data
  for (const [date, count] of Object.entries(dateCountMap)) {
    chartData.push({ date, count });
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date">
          <Label value="Date" offset={-5} position="insideBottom" />
        </XAxis>
        <YAxis>
          <Label value="Commits" angle={-90} position="insideLeft" />
        </YAxis>
        <Tooltip formatter={(value) => [`Commits: ${value}`, ""]} />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CommitHistoryChart;
