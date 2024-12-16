import React from 'react';
import { Cobe } from './components/Cobe';
import { VelocityScroll } from './components/VelocityScroll';
import { MorphingText } from './components/ui/MorphingText';
import { TransactionList } from './components/transactions/TransactionList';
import { TokenMonitorList } from './components/transactions/TokenMonitorList';
import { SOLANA_CONFIG } from './lib/constants/solana';

function App() {
  const morphingTexts = [
    "DIGITAL FRONTIER",
    "ENDLESS POSSIBILITIES",
    "FUTURE IS NOW",
    "INNOVATION UNLEASHED"
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="mb-16">
              <MorphingText 
                texts={morphingTexts} 
                className="text-blue-400/90"
              />
            </div>
            
            <div className="relative mb-24">
              <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full"></div>
              <Cobe />
            </div>
          </div>

          <div className="lg:mt-24 space-y-8">
            <TokenMonitorList />
            <TransactionList address={SOLANA_CONFIG.DEFAULT_ADDRESS} />
          </div>
        </div>
        
        <div className="mt-24">
          <VelocityScroll 
            text="EXPLORE • DISCOVER • INNOVATE • " 
            default_velocity={3} 
            className="text-2xl font-bold text-blue-400/80"
          />
        </div>
      </div>
    </div>
  );
}

export default App;