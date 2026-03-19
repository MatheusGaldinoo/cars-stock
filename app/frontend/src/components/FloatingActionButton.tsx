import React from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-[#0A58CA] hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-[0_4px_15px_rgba(10,88,202,0.4)] transition-transform hover:scale-110 z-40 focus:outline-none"
      aria-label="Adicionar Carro"
      title="Adicionar Carro"
    >
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
};
