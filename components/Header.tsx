
import React from 'react';

const MapPinIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 005.16-4.242 12.082 12.082 0 00.678-12.448 12.25 12.25 0 00-8.912-8.912 12.083 12.083 0 00-12.447.678 16.975 16.975 0 00-4.242 5.16c-.317.606.096 1.363.723 1.634l.028.012a.759.759 0 01.12.031l.028-.012.071-.041a15.409 15.409 0 014.242-4.16v6.255a2.25 2.25 0 001.529 2.162l.287.095a.75.75 0 01.386.611V21a.75.75 0 00.75.75h.5a.75.75 0 00.75-.75v-2.175a.75.75 0 01.386-.61l.287-.096a2.25 2.25 0 001.529-2.162V8.84a15.409 15.409 0 014.16 4.242l.04.07.016.028a.759.759 0 01.03.12l.013-.028a.76.76 0 001.634-.723 16.975 16.975 0 00-4.242-5.16 12.083 12.083 0 00-12.447-.678 12.25 12.25 0 00-8.912 8.912 12.082 12.082 0 00.678 12.448 16.975 16.975 0 005.16 4.242z" clipRule="evenodd" />
    </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="flex items-center justify-center gap-3">
        <MapPinIcon className="w-10 h-10 text-cyan-400"/>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-transparent bg-clip-text">
          Audience Finder AI
        </h1>
      </div>
      <p className="mt-4 max-w-xl mx-auto text-slate-400">
        Enter the location of your show, and our AI will suggest nearby states to target for your email campaigns, helping you reach a wider, relevant audience.
      </p>
    </header>
  );
};
