"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StockChart from "@/components/stock-chart";
import { fetchHistoricalData } from "@/utils/api";

interface DataPoint {
  time: string;
  price: number;
}

export default function Dashboard({
  symbol,
  showMA,
  onRemoveSymbol,
}: {
  symbol: string;
  showMA?: boolean;
  onRemoveSymbol?: (symbol: string) => void;
}) {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      try {
        const historicalData = await fetchHistoricalData(symbol);
        const formattedData = historicalData.map((item) => ({
          time: item.time,
          price: (item.open + item.close) / 2,
        }));

        // Data is already sorted by API route
        // The newest data will be at the right side since we sorted ascending
        // If you need to reverse, just ensure API returns oldest first. We did that.

        setData(formattedData);
      } catch (error) {
        console.error("Failed to fetch historical data:", error);
      }
    };

    fetchData();
  }, [symbol]);

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>{symbol}</CardTitle>
          {onRemoveSymbol && (
            <button
              onClick={() => onRemoveSymbol(symbol)}
              className="text-red-500 hover:underline"
            >
              X
            </button>
          )}
        </CardHeader>
        <CardContent>
          <StockChart data={data} showMA={showMA || false} />
        </CardContent>
      </Card>
    </div>
  );
}
