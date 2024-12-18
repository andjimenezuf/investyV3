"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  time: string;
  price: number;
}

function calculateSMA(data: DataPoint[], period = 5): DataPoint[] {
  if (data.length < period) return [];
  const smaData: DataPoint[] = [];
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const avg = slice.reduce((acc, val) => acc + val.price, 0) / period;
    smaData.push({ time: data[i].time, price: avg });
  }
  return smaData;
}

export default function StockChart({
  data,
  showMA,
}: {
  data: DataPoint[];
  showMA: boolean;
}) {
  const smaData = showMA ? calculateSMA(data, 5) : [];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip />
        <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
        {showMA && smaData.length > 0 && (
          <Line
            type="monotone"
            data={smaData}
            dataKey="price"
            stroke="#82ca9d"
            dot={false}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
