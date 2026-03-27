import React, { useState, useEffect } from 'react';

interface FloatingActionsProps {
  onAddClick: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({ onAddClick }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="floating-actions-container">
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fab-button scroll-top"
          aria-label="Voltar ao topo"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      <button 
        onClick={onAddClick}
        className="fab-button add-car"
        aria-label="Adicionar Novo Carro"
      >
        <span className="fab-label">Novo Veículo</span>
        <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};
