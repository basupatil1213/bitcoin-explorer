"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components for usage
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define the structure of the CoinGecko API response for chart data
interface CoinGeckoPriceResponse {
  prices: number[][];
}

// Define the structure of the CoinGecko API response for off-chain data
interface CoinGeckoDataResponse {
  market_data: {
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    circulating_supply: number;
    market_cap_change_percentage_24h: number;
    market_cap_rank: number;
    market_cap_dominance: number;
    ath: {
      usd: number;
    };
  };
}

// Define the state for chart data
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    fill: boolean;
    tension: number;
  }[];
}

type Transaction = {
  id: string;
  from: string;
  to: string;
  amount: number;
  fee: number;
};

type BlockData = {
  id: number;
  height: string;
  hash: string;
  latest_url: string;
  previous_hash: string;
  previous_url: string;
  peer_count: string;
  high_fee_per_kb: string;
  medium_fee_per_kb: string;
  low_fee_per_kb: string;
  time: string;
  last_fork_height: string;
  timestamp: string;
};

export default function BlockchainExplorer() {
  const [recentBlocks, setRecentBlocks] = useState<BlockData[] | undefined>(
    undefined
  );
  const [selectedBlock, setSelectedBlock] = useState<string | undefined>(
    undefined
  );
  const [selectedBlockDetails, setSelectedBlockDetails] = useState<
    BlockData | undefined
  >(undefined);

  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Off-chain data state
  const [marketCap, setMarketCap] = useState<number | null>(null);
  const [tradingVolume, setTradingVolume] = useState<number | null>(null);
  const [priceChange24h, setPriceChange24h] = useState<number | null>(null);
  const [priceChange7d, setPriceChange7d] = useState<number | null>(null);
  const [circulatingSupply, setCirculatingSupply] = useState<number | null>(
    null
  );
  const [marketDominance, setMarketDominance] = useState<number | null>(null);
  const [allTimeHigh, setAllTimeHigh] = useState<number | null>(null);

  const [darkMode, setDarkMode] = useState<boolean>(true);

  const handleBlockClick = (block: BlockData) => {
    setSelectedBlock(block.hash);
    if (selectedBlock != undefined) {
      fetchBlockDetails(selectedBlock);
    }
  };

  const fetchBlockDetails = async (hash: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/blocks/block?hash=${encodeURIComponent(
          hash
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setSelectedBlockDetails(data.data);
    } catch (error) {
      console.error("Error fetching block details:", error);
    }
  };

  useEffect(() => {
    const fetchBlockHeight = () => {
      fetch("http://localhost:3000/api/blocks")
        .then((response) => response.json())
        .then((data) => {
          setRecentBlocks(data.message);
          setSelectedBlock(data.message[0].hash);
        });
    };

    const fetchCoinData = async () => {
      try {
        // Fetch chart data for Bitcoin prices over the last 30 days
        const priceResponse = await axios.get<CoinGeckoPriceResponse>(
          "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart",
          {
            params: {
              vs_currency: "usd",
              days: 30,
            },
          }
        );

        const prices = priceResponse.data.prices;
        const labels = prices.map((price: number[]) => {
          const date = new Date(price[0]);
          return date.toLocaleDateString();
        });
        const data = prices.map((price: number[]) => price[1]);

        setChartData({
          labels,
          datasets: [
            {
              label: "Bitcoin Price (USD)",
              data,
              borderColor: "rgba(75, 192, 192, 1)",
              fill: false,
              tension: 0.1,
            },
          ],
        });

        // Fetch off-chain data for Bitcoin market cap, volume, and price changes
        const offChainResponse = await axios.get<CoinGeckoDataResponse>(
          "https://api.coingecko.com/api/v3/coins/bitcoin"
        );

        const offChainData = offChainResponse.data.market_data;
        setMarketCap(offChainData.market_cap.usd);
        setTradingVolume(offChainData.total_volume.usd);
        setPriceChange24h(offChainData.price_change_percentage_24h);
        setPriceChange7d(offChainData.price_change_percentage_7d);
        setCirculatingSupply(offChainData.circulating_supply);
        setMarketDominance(offChainData.market_cap_dominance);
        setAllTimeHigh(offChainData.ath.usd);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching coin data:", error);
        setLoading(false);
      }
    };

    fetchBlockHeight();
    fetchCoinData();
  }, []);

  useEffect(() => {
    if (selectedBlock != undefined) {
      fetchBlockDetails(selectedBlock);
    }
  }, [selectedBlock]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"} min-h-screen`}>
      <header className={`${darkMode ? "bg-gray-800" : "bg-gray-100"} border-b border-gray-700 sticky top-0 z-10`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-400">BlockChain Explorer</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="#" className={`${darkMode ? "text-gray-300 hover:text-blue-400" : "text-gray-800 hover:text-blue-600"}`}>Home</a>
              </li>
              <li>
                <a href="#" className={`${darkMode ? "text-gray-300 hover:text-blue-400" : "text-gray-800 hover:text-blue-600"}`}>Blocks</a>
              </li>
              <li>
                <a href="#" className={`${darkMode ? "text-gray-300 hover:text-blue-400" : "text-gray-800 hover:text-blue-600"}`}>Transactions</a>
              </li>
              <li>
                <a href="#" className={`${darkMode ? "text-gray-300 hover:text-blue-400" : "text-gray-800 hover:text-blue-600"}`}>About</a>
              </li>
            </ul>
          </nav>
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {darkMode ? <Sun className="h-6 w-6 text-yellow-400" /> : <Moon className="h-6 w-6 text-blue-800" />}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
      <ScrollArea className="w-full whitespace-nowrap rounded-md border border-gray-700">
                            <div className="flex p-4">
                                {recentBlocks &&
                                    recentBlocks.map((block, index) => (
                                        <React.Fragment key={block.id}>
                                            <div
                                                className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
                                                onClick={() =>
                                                    handleBlockClick(block)
                                                }>
                                                <div
                                                    className={`w-20 h-20 border-2 rounded-lg flex items-center justify-center ${
                                                      selectedBlockDetails &&
                                                      selectedBlockDetails.id ===
                                                          block.id
                                                          ? "bg-blue-500/30 border-blue-500"
                                                          : "bg-blue-500/10 border-blue-500/50"
                                                  }`}>
                                                    <span className="text-sm font-medium text-blue-400">
                                                        {block.height}
                                                    </span>
                                                </div>
                                                <span className="mt-2 text-xs text-gray-400">
                                                    {new Date(
                                                        block.time
                                                    ).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            {recentBlocks &&
                                                index <
                                                    recentBlocks.length - 1 && (
                                                    <ArrowRight className="mx-2 self-center text-gray-600" />
                                                )}
                                        </React.Fragment>
                                    ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>

        {/* Block Details Section */}
        {selectedBlockDetails && (
          <Card className="mt-8 bg-gray-800 border-gray-700 text-gray-200">
            <CardHeader>
              <CardTitle className="text-xl text-blue-400">Block Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Block Height: {selectedBlockDetails.height}</p>
              <p>Block Hash: {selectedBlockDetails.hash}</p>
              <p>Peer Count: {selectedBlockDetails.peer_count}</p>
              <p>Last Fork Height: {selectedBlockDetails.last_fork_height}</p>
              <p>Time: {new Date(selectedBlockDetails.time).toLocaleTimeString()}</p>
              <p>High Fee per KB: {selectedBlockDetails.high_fee_per_kb}</p>
              <p>Timestamp: {new Date(selectedBlockDetails.timestamp).toLocaleDateString()} : {new Date(selectedBlockDetails.timestamp).toLocaleTimeString()}</p>
            </CardContent>
          </Card>
        )}

        {/* Off-chain Bitcoin Data */}
        {!loading && (
          <Card className="mt-8 bg-gray-800 border-gray-700 text-gray-200">
            <CardHeader>
              <CardTitle className="text-xl text-blue-400">Bitcoin Market Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Market Cap: ${marketCap?.toLocaleString()}</p>
              <p>24h Trading Volume: ${tradingVolume?.toLocaleString()}</p>
              <p>24h Price Change: {priceChange24h?.toFixed(2)}%</p>
              <p>7d Price Change: {priceChange7d?.toFixed(2)}%</p>
              <p>Market Dominance: {marketDominance?.toFixed(2)}%</p>
              <p>Circulating Supply: {circulatingSupply?.toLocaleString()}</p>
              <p>All-Time High: ${allTimeHigh?.toLocaleString()}</p>
            </CardContent>
          </Card>
        )}

        {/* Chart Section */}
        <Card className="mt-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-blue-400">Bitcoin Price (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData ? (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
                      position: "top",
                    },
                  },
                }}
              />
            ) : (
              <p>Loading chart data...</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
