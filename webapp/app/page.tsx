"use client";

import React, { useEffect, useState } from "react";
import {
    ArrowRight,
    Clock,
    Database,
    Link,
    Users,
    Menu,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

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
    price: number;
    time: string;
    transactions?: Transaction[];
};

// Mock data for demonstration
const mockBlocks: BlockData[] = Array.from({ length: 10 }, (_, i) => ({
    id: 10 - i,
    height: `${1000000 - i}`,
    hash: `0x${Math.random().toString(16).substr(2, 64)}`,
    latest_url: "#",
    previous_hash: `0x${Math.random().toString(16).substr(2, 64)}`,
    previous_url: "#",
    peer_count: `${Math.floor(Math.random() * 1000)}`,
    high_fee_per_kb: `${Math.floor(Math.random() * 100)}`,
    medium_fee_per_kb: `${Math.floor(Math.random() * 50)}`,
    low_fee_per_kb: `${Math.floor(Math.random() * 25)}`,
    price: Math.random() * 10000 + 30000,
    time: new Date(Date.now() - i * 600000).toISOString(),
    transactions: Array.from({ length: 5 }, (_, j) => ({
        id: `0x${Math.random().toString(16).substr(2, 64)}`,
        from: `0x${Math.random().toString(16).substr(2, 40)}`,
        to: `0x${Math.random().toString(16).substr(2, 40)}`,
        amount: Math.random() * 10,
        fee: Math.random() * 0.1,
    })),
}));

// Generate mock price change data
const mockPriceChangeData = mockBlocks
    .map((block, index) => ({
        time: new Date(block.time).toLocaleTimeString(),
        price: block.price,
        change:
            index === 0
                ? 0
                : ((block.price - mockBlocks[index - 1].price) /
                      mockBlocks[index - 1].price) *
                  100,
    }))
    .reverse();

export default function BlockchainExplorer() {
    const [recentBlocks, setRecentBlocks] = useState<BlockData[] | undefined>(
        undefined
    );
    const [selectedBlock, setSelectedBlock] = useState<BlockData | undefined>(
        undefined
    );
    const [expandedTransactions, setExpandedTransactions] = useState<string[]>(
        []
    );

    const handleBlockClick = (block: BlockData) => {
        setSelectedBlock(block);
        setExpandedTransactions([]);
    };

    const toggleTransaction = (transactionId: string) => {
        setExpandedTransactions((prev) =>
            prev.includes(transactionId)
                ? prev.filter((id) => id !== transactionId)
                : [...prev, transactionId]
        );
    };

    useEffect(() => {
        const fetchBlockHeight = () => {
            fetch("http://localhost:3000/api/blocks")
                .then((response) => response.json())
                .then((data) => {
                    setRecentBlocks(data.message);
                    setSelectedBlock(data.message[0]);
                });
        };

        fetchBlockHeight();
    });

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-400">
                        BlockChain Explorer
                    </h1>
                    <nav>
                        <ul className="flex space-x-4">
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-blue-400">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-blue-400">
                                    Blocks
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-blue-400">
                                    Transactions
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-blue-400">
                                    About
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-8">
                {/* Chain Visualization */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-xl text-blue-400">
                            Latest 10 Blocks
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
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
                                                        selectedBlock &&
                                                        selectedBlock.id ===
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
                                            {index < mockBlocks.length - 1 && (
                                                <ArrowRight className="mx-2 self-center text-gray-600" />
                                            )}
                                        </React.Fragment>
                                    ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </CardContent>
                </Card>

                

                {/* Selected Block Details */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-xl text-blue-400">
                            Block Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {selectedBlock && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p>
                                        <strong className="text-gray-400">
                                            Height:
                                        </strong>{" "}
                                        <span className="text-blue-300">
                                            {selectedBlock.height}
                                        </span>
                                    </p>
                                    <p>
                                        <strong className="text-gray-400">
                                            Hash:
                                        </strong>{" "}
                                        <span className="font-mono text-sm text-green-400">
                                            {selectedBlock.hash}
                                        </span>
                                    </p>
                                    <p>
                                        <strong className="text-gray-400">
                                            Previous Hash:
                                        </strong>{" "}
                                        <span className="font-mono text-sm text-green-400">
                                            {selectedBlock.previous_hash}
                                        </span>
                                    </p>
                                    <p>
                                        <strong className="text-gray-400">
                                            Time:
                                        </strong>{" "}
                                        <span className="text-blue-300">
                                            {new Date(
                                                selectedBlock.time
                                            ).toLocaleString()}
                                        </span>
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p>
                                        <strong className="text-gray-400">
                                            Price:
                                        </strong>{" "}
                                        <span className="text-blue-300">
                                            ${selectedBlock.price.toFixed(2)}
                                        </span>
                                    </p>
                                    <p>
                                        <strong className="text-gray-400">
                                            Peer Count:
                                        </strong>{" "}
                                        <span className="text-blue-300">
                                            {selectedBlock.peer_count}
                                        </span>
                                    </p>
                                    <p>
                                        <strong className="text-gray-400">
                                            High Fee/KB:
                                        </strong>{" "}
                                        <span className="text-blue-300">
                                            {selectedBlock.high_fee_per_kb}
                                        </span>
                                    </p>
                                    <p>
                                        <strong className="text-gray-400">
                                            Medium Fee/KB:
                                        </strong>{" "}
                                        <span className="text-blue-300">
                                            {selectedBlock.medium_fee_per_kb}
                                        </span>
                                    </p>
                                    <p>
                                        <strong className="text-gray-400">
                                            Low Fee/KB:
                                        </strong>{" "}
                                        <span className="text-blue-300">
                                            {selectedBlock.low_fee_per_kb}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Transactions */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-xl text-blue-400">
                            Transactions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockBlocks && mockBlocks[0].transactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="border border-gray-700 rounded-lg p-4">
                                    <div
                                        className="flex justify-between items-center cursor-pointer"
                                        onClick={() =>
                                            toggleTransaction(transaction.id)
                                        }>
                                        <span className="font-mono text-sm text-green-400">
                                            {transaction.id}
                                        </span>
                                        {expandedTransactions.includes(
                                            transaction.id
                                        ) ? (
                                            <ChevronUp className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-gray-400" />
                                        )}
                                    </div>
                                    {expandedTransactions.includes(
                                        transaction.id
                                    ) && (
                                        <div className="mt-2 space-y-2 text-sm">
                                            <p>
                                                <strong className="text-gray-400">
                                                    From:
                                                </strong>{" "}
                                                <span className="text-blue-300">
                                                    {transaction.from}
                                                </span>
                                            </p>
                                            <p>
                                                <strong className="text-gray-400">
                                                    To:
                                                </strong>{" "}
                                                <span className="text-blue-300">
                                                    {transaction.to}
                                                </span>
                                            </p>
                                            <p>
                                                <strong className="text-gray-400">
                                                    Amount:
                                                </strong>{" "}
                                                <span className="text-blue-300">
                                                    {transaction.amount.toFixed(
                                                        8
                                                    )}{" "}
                                                    BTC
                                                </span>
                                            </p>
                                            <p>
                                                <strong className="text-gray-400">
                                                    Fee:
                                                </strong>{" "}
                                                <span className="text-blue-300">
                                                    {transaction.fee.toFixed(8)}{" "}
                                                    BTC
                                                </span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Bitcoin Price Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-xl text-blue-400">
                                Bitcoin Price History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={{
                                    price: {
                                        label: "Price",
                                        color: "hsl(var(--chart-1))",
                                    },
                                }}
                                className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={mockPriceChangeData}>
                                        <XAxis
                                            dataKey="time"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) =>
                                                `$${value.toLocaleString()}`
                                            }
                                        />
                                        <ChartTooltip
                                            content={<ChartTooltipContent />}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="price"
                                            stroke="var(--color-price)"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-xl text-blue-400">
                                Bitcoin Price Change (%)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={{
                                    change: {
                                        label: "Change (%)",
                                        color: "hsl(var(--chart-2))",
                                    },
                                }}
                                className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={mockPriceChangeData}>
                                        <XAxis
                                            dataKey="time"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) =>
                                                `${value.toFixed(2)}%`
                                            }
                                        />
                                        <ChartTooltip
                                            content={<ChartTooltipContent />}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="change"
                                            stroke="var(--color-change)"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">
                                Total Blocks
                            </CardTitle>
                            <Database className="h-4 w-4 text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-300">
                                {parseInt(
                                    mockBlocks[0].height
                                ).toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">
                                Network Peers
                            </CardTitle>
                            <Users className="h-4 w-4 text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-300">
                                {selectedBlock && parseInt(
                                    selectedBlock.peer_count
                                ).toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">
                                Latest Price
                            </CardTitle>
                            <Link className="h-4 w-4 text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-300">
                                ${selectedBlock && selectedBlock.price.toFixed(2)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">
                                Block Time
                            </CardTitle>
                            <Clock className="h-4 w-4 text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-300">
                                {selectedBlock && new Date(
                                    selectedBlock.time
                                ).toLocaleTimeString()}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
