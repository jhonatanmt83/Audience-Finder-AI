
import React, { useState, useCallback } from 'react';
import { getAdjacentStates } from './services/geminiService';
import { Header } from './components/Header';
import { LocationInput } from './components/LocationInput';
import { StateCard } from './components/StateCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { MapComponent } from './components/MapComponent';
import { StateInfo, ShowLocation } from './types';

const App: React.FC = () => {
  const [location, setLocation] = useState<string>('');
  const [primaryState, setPrimaryState] = useState<StateInfo | null>(null);
  const [nearbyStates, setNearbyStates] = useState<StateInfo[]>([]);
  const [showLocation, setShowLocation] = useState<ShowLocation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFindStates = useCallback(async () => {
    if (!location.trim()) {
      setError('Please enter a location.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrimaryState(null);
    setNearbyStates([]);
    setShowLocation(null);

    try {
      const response = await getAdjacentStates(location);
      setPrimaryState(response.primaryState);
      setNearbyStates(response.nearbyStates);
      setShowLocation(response.showLocation);
    } catch (err) {
      console.error(err);
      setError('Could not fetch audience data. The location might be invalid or there was a network error.');
    } finally {
      setIsLoading(false);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-5xl mx-auto">
        <Header />

        <main className="mt-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 md:p-8 shadow-2xl shadow-slate-950/50">
          <LocationInput
            location={location}
            setLocation={setLocation}
            onSubmit={handleFindStates}
            isLoading={isLoading}
          />

          {isLoading && (
            <div className="flex justify-center items-center mt-8">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <div className="mt-8 text-center bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          {primaryState && !isLoading && (
            <div className="mt-8 flex flex-col gap-8">
              <div className="h-[450px] w-full rounded-lg overflow-hidden border border-slate-700 bg-slate-900 p-1">
                <MapComponent 
                  center={showLocation} 
                  primaryState={primaryState} 
                  nearbyStates={nearbyStates} 
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Primary State Column */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-fuchsia-900/50">
                    <h2 className="text-lg font-semibold text-center text-fuchsia-300 mb-4">Event Location</h2>
                    <div className="flex justify-center">
                        <StateCard stateName={primaryState.name} stateAbbreviation={primaryState.abbreviation} />
                    </div>
                </div>

                {/* Nearby States Column */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-cyan-900/50">
                    <h2 className="text-lg font-semibold text-center text-cyan-300 mb-4">Recommended Targets</h2>
                    <div className="flex flex-wrap justify-center gap-3">
                    {nearbyStates.map((state, index) => (
                        <StateCard key={index} stateName={state.name} stateAbbreviation={state.abbreviation} />
                    ))}
                    </div>
                </div>
              </div>
            </div>
          )}
        </main>
        
        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p>Powered by <a href="https://github.com/jhonatanmt83" target="_blank">jhonatanmt83</a>. Audience suggestions are for marketing reference only.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
