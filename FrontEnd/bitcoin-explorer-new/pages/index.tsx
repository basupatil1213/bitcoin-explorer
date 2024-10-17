import BitcoinExplorer from '../components/BitcoinExplorer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <BitcoinExplorer />
      </div>
    </div>
  );
}