import React, { useState, useEffect } from 'react';

interface HeaderProps {
  onSearch: (plate: string) => void;
}

interface CompanySettings {
  name: string;
  logo_url?: string | null;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [plate, setPlate] = useState('');
  const [companySettings, setCompanySettings] = useState<CompanySettings>({ name: 'Estoque' });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { fetchCompanySettings } = await import('../services/api');
        const settings = await fetchCompanySettings();
        setCompanySettings({ name: settings.name, logo_url: settings.logo_url });
      } catch (err) {
        console.error('Erro ao carregar configurações:', err);
      }
    };
    loadSettings();
  }, []);

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
              {hasLogo && companySettings.logo_url ? (
                <img 
                  src={companySettings.logo_url} 
                  alt={`${companySettings.name} Logo`} 
                  className="header-logo"
                  onError={() => setHasLogo(false)}
                />
              ) : (
                <h1 className="logo">{companySettings.name}</h1>
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
