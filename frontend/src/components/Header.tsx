import React, { useState, useEffect } from 'react';

interface HeaderProps {
  onSearch: (searchTerm: string, minPrice?: number, maxPrice?: number) => void;
}

interface CompanySettings {
  name: string;
  logo_url?: string | null;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [companySettings, setCompanySettings] = useState<CompanySettings>({ name: '' });
  const [hasLogo, setHasLogo] = useState(true);

  // Estados do Filtro de Preço
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { fetchCompanySettings } = await import('../services/api');
        const settings = await fetchCompanySettings();
        setCompanySettings({ name: settings.name || '', logo_url: settings.logo_url });
      } catch (err) {
        console.error('Erro ao carregar configurações:', err);
      }
    };
    loadSettings();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const min = minPrice ? parseFloat(minPrice) : undefined;
    const max = maxPrice ? parseFloat(maxPrice) : undefined;
    onSearch(value, min, max);
  };

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const min = minPrice ? parseFloat(minPrice) : undefined;
    const max = maxPrice ? parseFloat(maxPrice) : undefined;
    onSearch(searchTerm, min, max);
    setIsFilterOpen(false);
  };

  const handleClearFilter = () => {
    setMinPrice('');
    setMaxPrice('');
    onSearch(searchTerm, undefined, undefined);
    setIsFilterOpen(false);
  };

  const hasActiveFilter = Boolean(minPrice || maxPrice);

  return (
    <header className="search-header">
      <div className="grid-container">
        <div className="grid-x grid-margin-x align-middle">
          {/* Logo Section */}
          <div className="cell small-12 medium-4">
            <div className="logo-container" style={{ minHeight: '3rem', display: 'flex', alignItems: 'center' }}>
              {hasLogo && companySettings.logo_url ? (
                <img 
                  src={companySettings.logo_url} 
                  alt={`${companySettings.name} Logo`} 
                  className="header-logo"
                  onError={() => setHasLogo(false)}
                />
              ) : null}
            </div>
          </div>

          {/* Search Bar + Filter Button Section */}
          <div className="cell small-12 medium-8">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
              <div className="search-container" style={{ position: 'relative', flex: 1, margin: 0 }}>
                <input 
                  type="text" 
                  placeholder="Pesquisar por placa, modelo ou marca..." 
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{ width: '100%' }}
                />
                <span 
                  style={{
                    position: 'absolute',
                    right: '1.25rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'rgba(255, 255, 255, 0.65)'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </div>

              {/* Botão de Filtro proporcional à barra de busca */}
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                title="Filtrar por faixa de preço"
                style={{
                  height: '42px',
                  width: '42px',
                  borderRadius: '24px',
                  border: hasActiveFilter ? '1px solid #0A58CA' : '1px solid rgba(255, 255, 255, 0.2)',
                  background: hasActiveFilter ? 'rgba(10, 88, 202, 0.35)' : 'rgba(255, 255, 255, 0.05)',
                  color: hasActiveFilter ? '#60A5FA' : 'rgba(255, 255, 255, 0.85)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>

              {/* Dropdown Popover de Filtro */}
              {isFilterOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '115%',
                    right: 0,
                    width: '300px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
                    padding: '1.25rem',
                    zIndex: 1001,
                    border: '1px solid #E9ECEF'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#121212' }}>
                      Filtrar por Preço
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsFilterOpen(false)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6C757D', padding: 0 }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleApplyFilter}>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#495057', marginBottom: '0.25rem' }}>
                        Preço Mínimo (R$)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        placeholder="Ex: 40000"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '6px',
                          border: '1px solid #DEE2E6',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#495057', marginBottom: '0.25rem' }}>
                        Preço Máximo (R$)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        placeholder="Ex: 120000"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '6px',
                          border: '1px solid #DEE2E6',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      {hasActiveFilter && (
                        <button
                          type="button"
                          onClick={handleClearFilter}
                          style={{
                            padding: '0.45rem 0.75rem',
                            borderRadius: '6px',
                            border: '1px solid #DEE2E6',
                            background: '#F8F9FA',
                            color: '#6C757D',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Limpar
                        </button>
                      )}
                      <button
                        type="submit"
                        style={{
                          padding: '0.45rem 1rem',
                          borderRadius: '6px',
                          border: 'none',
                          background: '#0A58CA',
                          color: '#FFFFFF',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Aplicar
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
