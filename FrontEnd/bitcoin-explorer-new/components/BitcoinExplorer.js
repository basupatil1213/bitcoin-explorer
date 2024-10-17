import React, { useState, useEffect } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Info } from 'lucide-react';

const BlockInfo = {
  height: { 
    value: 123456, 
    video: "https://www.youtube.com/watch?v=0r4dvEUJtpw",
    description: "Block height represents the number of blocks preceding a particular block on a blockchain."
  },
  hash: { 
    value: "000000000000000000024bead8df69990852c202db0e0097c1a12ea637d7e96d", 
    video: "https://www.youtube.com/watch?v=2X9nAcoqArY",
    description: "A unique identifier for this block, created by hashing the block's contents."
  },
  timestamp: { 
    value: "2021-09-22 15:35:24", 
    video: "https://www.youtube.com/watch?v=iDMJng42ejw",
    description: "The time when this block was mined."
  },
  transactions: { 
    value: 2130, 
    video: "https://www.youtube.com/watch?v=BudG7FwnUWs",
    description: "The number of transactions included in this block."
  },
  size: { 
    value: "1.2 MB", 
    video: "https://www.youtube.com/watch?v=I-rGq0ya7dw",
    description: "The total size of the block in megabytes."
  },
};

const generateMockPriceData = () => {
  const data = [];
  let price = 30000;
  for (let i = 0; i < 30; i++) {
    price += Math.random() * 1000 - 500;
    data.push({
      date: `2024-${String(i + 1).padStart(2, '0')}-01`,
      price: Math.max(0, price.toFixed(2))
    });
  }
  return data;
};

const BitcoinExplorer = () => {
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [priceData, setPriceData] = useState([]);

  useEffect(() => {
    setPriceData(generateMockPriceData());
  }, []);

  const handleAttributeClick = (key) => {
    setSelectedAttribute(key);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-purple-800">Bitcoin Block Explorer</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-purple-700 mb-3">Block Information</h2>
          <TooltipProvider>
            {Object.entries(BlockInfo).map(([key, { value, description }]) => (
              <div 
                key={key} 
                className="flex justify-between items-center p-3 bg-white hover:bg-purple-100 rounded-lg transition-colors duration-200 shadow-sm cursor-pointer"
                onClick={() => handleAttributeClick(key)}
              >
                <span className="font-semibold capitalize text-purple-700">{key}:</span>
                <Tooltip>
                  <TooltipTrigger className="flex items-center">
                    <span className="text-gray-600 max-w-[200px] truncate mr-2">
                      {typeof value === 'string' && value.length > 30 
                        ? value.substring(0, 30) + '...' 
                        : value}
                    </span>
                    <Info size={16} className="text-purple-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{description}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}
          </TooltipProvider>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-purple-700 mb-3">Bitcoin Price (Last 30 Days)</h2>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Line type="monotone" dataKey="price" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {selectedAttribute && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-purple-700 mb-2">
            Learn more about {selectedAttribute}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {BlockInfo[selectedAttribute].description}
          </p>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={BlockInfo[selectedAttribute].video.replace('watch?v=', 'embed/')}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default BitcoinExplorer;