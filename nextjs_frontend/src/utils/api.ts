// utils/api.ts
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export interface StockData {
  [symbol: string]: number;
}

export interface CandlestickDataPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export const fetchStocks = async (): Promise<StockData> => {
  const response = await axios.get<StockData>(`${API_URL}/stocks`);
  return response.data;
};

export const addAlert = async (symbol: string, alertPrice: number): Promise<void> => {
  await axios.post(`${API_URL}/alerts`, {
    symbol,
    alert_price: alertPrice,
  });
};

export const removeAlert = async (symbol: string): Promise<void> => {
  await axios.delete(`${API_URL}/alerts/${symbol}`);
};

export const viewAlerts = async (): Promise<{ [symbol: string]: number }> => {
  const response = await axios.get<{ [symbol: string]: number }>(`${API_URL}/alerts`);
  return response.data;
};

export const fetchHistoricalData = async (symbol: string): Promise<CandlestickDataPoint[]> => {
  const response = await axios.get<{ data: CandlestickDataPoint[] }>(
    `${API_URL}/stocks/${symbol}/history`
  );
  return response.data.data;
};
