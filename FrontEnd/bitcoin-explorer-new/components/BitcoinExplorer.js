import React, { useState } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './ui/tooltip';

const BlockInfo = {
  height: { 
    value: 123456, 
    video: "https://www.youtube.com/watch?v=example1",
    description: "Block height represents the number of blocks preceding a particular block on a blockchain."
  },
  hash: { 
    value: "000000000000000000024bead8df69990852c202db0e0097c1a12ea637d7e96d", 
    video: "https://www.youtube.com/watch?v=example2",
    description: "A unique identifier for this block, created by hashing the block's contents."
  },
  timestamp: { 
    value: "2021-09-22 15:35:24", 
    video: "https://www.youtube.com/watch?v=example3",
    description: "The time when this block was mined."
  },
  transactions: { 
    value: 2130, 
    video: "https://www.youtube.com/watch?v=example4",
    description: "The number of transactions included in this block."
  },
  size: { 
    value: "1.2 MB", 
    video: "https://www.youtube.com/watch?v=example5",
    description: "The total size of the block in megabytes."
  },
};

const BitcoinExplorer = () => {
  const [hoveredAttribute, setHoveredAttribute] = useState(null);

  return (
    <TooltipProvider>
      <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-lg space-y-4">
        <h1 className="text-2xl font-bold text-center mb-6">Bitcoin Block Explorer</h1>
        
        {Object.entries(BlockInfo).map(([key, { value, video, description }]) => (
          <div 
            key={key} 
            className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            onMouseEnter={() => setHoveredAttribute(key)}
            onMouseLeave={() => setHoveredAttribute(null)}
          >
            <span className="font-semibold capitalize text-gray-700">{key}:</span>
            <Tooltip>
              <TooltipTrigger>
                <span className="text-gray-600 max-w-md truncate">
                  {typeof value === 'string' && value.length > 30 
                    ? value.substring(0, 30) + '...' 
                    : value}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-xs">
                  <p className="mb-2">{description}</p>
                  <a 
                    href={video} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Watch tutorial →
                  </a>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
        
        {hoveredAttribute && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              {BlockInfo[hoveredAttribute].description}
            </p>
            <a 
              href={BlockInfo[hoveredAttribute].video}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:text-blue-700 flex items-center"
            >
              Learn more about {hoveredAttribute} →
            </a>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default BitcoinExplorer;