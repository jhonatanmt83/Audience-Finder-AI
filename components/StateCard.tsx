
import React from 'react';

interface StateCardProps {
  stateName: string;
  stateAbbreviation: string;
}

export const StateCard: React.FC<StateCardProps> = ({ stateName, stateAbbreviation }) => {
  return (
    <div className="flex items-center gap-2 bg-slate-700 text-slate-200 font-medium py-2 pl-2 pr-4 rounded-full shadow-md transition-transform transform hover:scale-105 hover:bg-slate-600 cursor-default">
      <span className="flex items-center justify-center w-6 h-6 bg-slate-800 text-cyan-400 text-xs font-bold rounded-full">
        {stateAbbreviation}
      </span>
      <span>{stateName}</span>
    </div>
  );
};
