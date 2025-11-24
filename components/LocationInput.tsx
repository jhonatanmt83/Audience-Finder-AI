
import React from 'react';

interface LocationInputProps {
  location: string;
  setLocation: (location: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const SearchIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
    </svg>
);


export const LocationInput: React.FC<LocationInputProps> = ({
  location,
  setLocation,
  onSubmit,
  isLoading,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g., Madison Square Garden, NYC"
        className="flex-grow w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none transition duration-200 disabled:opacity-50"
        disabled={isLoading}
      />
      <button
        onClick={onSubmit}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          'Analyzing...'
        ) : (
          <>
            <SearchIcon className="w-5 h-5"/>
            <span>Find Audience</span>
          </>
        )}
      </button>
    </div>
  );
};
