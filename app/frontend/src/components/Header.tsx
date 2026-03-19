import React, { useState } from 'react';

interface HeaderProps {
  onSearch: (placa: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [placa, setPlaca] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(placa);
  };

  return (
    <header className="search-header">
      <div className="grid-container">
        <div className="grid-x grid-margin-x align-middle">
          <div className="cell small-12 medium-4">
            <h1 className="logo">Leal<span>Car</span></h1>
          </div>
          <div className="cell small-12 medium-8">
            <form onSubmit={handleSubmit}>
              <div className="search-container">
                <input 
                  type="text" 
                  placeholder="Pesquisar Carro por Placa..." 
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value)}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
};
