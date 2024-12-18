"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { removeAlert } from "@/utils/api"; // Import removeAlert from your API utils

export default function Sidebar({
  onSearch,
  onToggleMA,
  onAddAlert,
}: {
  onSearch: (symbol: string) => void;
  onToggleMA: (show: boolean) => void;
  onAddAlert: (symbol: string, price: number) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [alertPrice, setAlertPrice] = useState(""); 
  const [showMA, setShowMA] = useState(false);
  const [alerts, setAlerts] = useState<{ symbol: string; price: number }[]>([]);
  const [alertsExpanded, setAlertsExpanded] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      onSearch(searchTerm);
      setSearchTerm("");
    }
  };

  const handleMAToggle = () => {
    const newVal = !showMA;
    setShowMA(newVal);
    onToggleMA(newVal);
  };

  const handleAddAlertClick = async () => {
    if (searchTerm && alertPrice) {
      const price = parseFloat(alertPrice);
      if (!isNaN(price)) {
        await onAddAlert(searchTerm, price);
        setAlerts((prev) => [...prev, { symbol: searchTerm, price }]);
        setSearchTerm("");
        setAlertPrice("");
      }
    }
  };

  const handleDeleteAlert = async (symbol: string) => {
    // Remove locally
    setAlerts(alerts.filter((alert) => alert.symbol !== symbol));
    // Also remove from backend
    try {
      await removeAlert(symbol);
    } catch (error) {
      console.error("Failed to remove alert from backend:", error);
    }
  };

  const handleRemoveAllAlerts = async () => {
    // Loop through all alerts and remove them from backend
    for (const alert of alerts) {
      try {
        await removeAlert(alert.symbol);
      } catch (error) {
        console.error("Failed to remove alert from backend:", error);
      }
    }
    setAlerts([]);
  };

  return (
    <div className="w-64 p-4 bg-gray-50 dark:bg-gray-800 h-full flex flex-col space-y-6">
      {/* Section 1: Stock Search */}
      <div className="border border-gray-300 dark:border-gray-700 p-4 rounded">
        <h2 className="text-lg font-bold mb-4">Search Stock Chart</h2>
        <form onSubmit={handleSearch} className="mb-4">
          <Input
            type="text"
            placeholder="Search stock symbol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toUpperCase())} 
            className="mb-2"
          />
          <Button type="submit" className="w-full">
            Search
          </Button>
        </form>
        <div className="flex items-center space-x-2">
          <Checkbox checked={showMA} onCheckedChange={handleMAToggle} />
          <Label>Show Moving Average</Label>
        </div>
      </div>

      {/* Section 2: Price Alerts */}
      <div className="border border-gray-300 dark:border-gray-700 p-4 rounded">
        <h2
          className="text-lg font-bold mb-2 cursor-pointer"
          onClick={() => setAlertsExpanded(!alertsExpanded)}
        >
          Price Alerts
        </h2>
        {alertsExpanded && (
          <div className="space-y-4">
            {/* Add New Alert */}
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Stock symbol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
              />
              <Input
                type="number"
                placeholder="Set alert price..."
                value={alertPrice}
                onChange={(e) => setAlertPrice(e.target.value)}
              />
              <Button
                className="w-full"
                onClick={handleAddAlertClick}
                disabled={!searchTerm || !alertPrice}
              >
                Add Alert
              </Button>
            </div>

            {/* Existing Alerts */}
            <div>
              <h3 className="text-sm font-bold mb-2 flex justify-between items-center">
                <span>Active Alerts</span>
                {alerts.length > 0 && (
                  <Button variant="outline" size="sm" onClick={handleRemoveAllAlerts}>
                    Remove All
                  </Button>
                )}
              </h3>
              <div className="space-y-2">
                {alerts.length > 0 ? (
                  alerts.map((alert, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded"
                    >
                      <span>
                        {alert.symbol}: ${alert.price}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAlert(alert.symbol)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No active alerts
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
