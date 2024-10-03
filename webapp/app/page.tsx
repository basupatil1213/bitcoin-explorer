"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [blockHeight, setBlockHeight] = useState<number>(0);

  useEffect(() => {
    fetch("http://localhost:3000/api/blocks/block")
      .then((response) => response.json())
      .then((data) => {
        setBlockHeight(data.message[0].height)
      });
  }, []);

  const handleBtnClick = () => {
    fetch("http://localhost:3000/api/blocks/block")
      .then((response) => response.json())
      .then((data) => {
        setBlockHeight(data.message[0].height)
      });
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <h1>Block Height</h1>
          <p>{blockHeight}</p>
          <button
          onClick={handleBtnClick} 
          >Refresh</button>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a href="https://github.com/joseph-c-c/next-tailwind-starter" target="_blank" rel="noopener noreferrer"></a>
      </footer>
    </div>
  );
}
