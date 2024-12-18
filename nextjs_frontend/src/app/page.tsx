"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import Dashboard from "@/components/dashboard";
import { addAlert, fetchStocks, viewAlerts } from "@/utils/api";
import { Toaster, toast } from 'react-hot-toast';

export default function Home() {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [showMA, setShowMA] = useState(false);

  // Add new symbol
  const handleSearch = (symbol: string) => {
    if (!symbols.includes(symbol)) {
      setSymbols((prev) => [...prev, symbol]);
    }
  };

  // Remove symbol
  const handleRemoveSymbol = (symbol: string) => {
    setSymbols((prev) => prev.filter((s) => s !== symbol));
  };

  const handleToggleMA = (show: boolean) => {
    setShowMA(show);
  };

  const handleAddAlert = async (symbol: string, price: number) => {
    try {
      await addAlert(symbol, price);
    } catch (error) {
      console.error("Error adding alert:", error);
    }
  };

  // OPTIONAL: Poll for alert triggers (just a simple example)
  // This would require a known set of alerts and logic to show toast once.
  // For now, we show a toast if we see a price above alert for demonstration.
  useEffect(() => {
    const interval = setInterval(async () => {
      const alerts = await viewAlerts();
      const stocks = await fetchStocks();
      for (const [symbol, alertPrice] of Object.entries(alerts)) {
        const currentPrice = stocks[symbol];
        if (currentPrice && currentPrice >= alertPrice) {
          toast(`ALERT: ${symbol} hit $${alertPrice}`, { icon: '🚀' });
        }
      }
    }, 10000); // every 10 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <Toaster position="top-right" />
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onSearch={handleSearch}
          onToggleMA={handleToggleMA}
          onAddAlert={handleAddAlert}
        />
        <div className="flex-1 overflow-y-auto">
          {symbols.length === 0 ? (
            <div className="p-4">No charts. Search for a stock symbol to add one.</div>
          ) : (
            symbols.map((symbol) => (
              <Dashboard
                key={symbol}
                symbol={symbol}
                showMA={showMA}
                onRemoveSymbol={handleRemoveSymbol}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
