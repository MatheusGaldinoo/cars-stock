import React, { useState } from 'react';

interface HeaderProps {
  onSearch: (plate: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [plate, setPlate] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPlate(value);
    onSearch(value);
  };

  const [hasLogo, setHasLogo] = useState(true);

  return (
    <header className="search-header">
      <div className="grid-container">
        <div className="grid-x grid-margin-x align-middle">
          <div className="cell small-12 medium-4">
            <div className="logo-container">
              {hasLogo ? (
                <img 
                  src="/logo.png" 
                  alt="Leal Car Logo" 
                  className="header-logo"
                  onError={() => setHasLogo(false)}
                />
              ) : (
                <h1 className="logo">Leal<span>Car</span></h1>
              )}
            </div>
          </div>
          <div className="cell small-12 medium-8">
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Pesquisar Carro por Placa..." 
                value={plate}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
