import React, { useEffect, useState } from 'react';
import { fetchCars, createCar, updateCar, deleteCar, type Car } from '../services/api';
import { Header } from '../components/Header';
import { CarCard } from '../components/CarCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { CarModal } from '../components/CarModal';
import { AdminAuthModal } from '../components/AdminAuthModal';
import { FloatingActions } from '../components/FloatingActions';

export const Home: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('stock_auth') === 'true'
  );

  // Carregar configurações
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { fetchCompanySettings } = await import('../services/api');
        const settings = await fetchCompanySettings();
        if (settings.admin_password) {
          setAdminPassword(settings.admin_password);
        }
      } catch (err) {
        console.error('Erro ao carregar configurações:', err);
      }
    };
    loadSettings();
  }, []);

  // Carregar carros
  const loadCars = async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 500));

      const data = await fetchCars();
      setCars(data);
    } catch {
      setError('Erro ao carregar o catálogo de veículos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  const [isFiltering, setIsFiltering] = useState(false);

  // Busca
  const handleSearch = async (searchTerm: string, minPrice?: number, maxPrice?: number) => {
    const hasSearchActive = Boolean(searchTerm.trim() || minPrice !== undefined || maxPrice !== undefined);
    setIsFiltering(hasSearchActive);

    try {
      setLoading(true);
      setError(null);
      const data = await fetchCars({
        q: searchTerm.trim() || undefined,
        min_price: minPrice,
        max_price: maxPrice
      });
      setCars(data);

      if (data.length === 0 && hasSearchActive) {
        setError('Nenhum veículo encontrado para os critérios de busca selecionados.');
      }
    } catch {
      setError('Ocorreu um erro ao realizar a busca.');
    } finally {
      setLoading(false);
    }
  };

  // Executa ação protegida verificando autenticação
  const executeWithAuth = (action: () => void) => {
    if (isAuthenticated) {
      action();
    } else {
      setPendingAction(() => action);
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  // Handlers
  const handleAddClick = () => {
    executeWithAuth(() => {
      setEditingCar(null);
      setIsModalOpen(true);
    });
  };

  const handleEditClick = (car: Car) => {
    executeWithAuth(() => {
      setEditingCar(car);
      setIsModalOpen(true);
    });
  };

  const handleDeleteClick = async (plate: string) => {
    executeWithAuth(async () => {
      if (window.confirm(`Confirma a exclusão do veículo com a placa ${plate}?`)) {
        try {
          setLoading(true);
          await deleteCar(plate);
          await loadCars();
        } catch {
          alert('Erro ao excluir veículo.');
          setLoading(false);
        }
      }
    });
  };

  const handleSaveCar = async (carData: Partial<Car>) => {
    try {
      if (editingCar) {
        await updateCar(editingCar.plate, carData);
      } else {
        await createCar(carData);
      }
      await loadCars();
    } catch (err) {
      console.error('Erro ao salvar:', err);
      throw err;
    }
  };

  // Métricas executivas
  const totalVehicles = cars.length;
  const totalStockValue = cars.reduce((acc, car) => acc + (car.price || 0), 0);
  const averagePrice = totalVehicles > 0 ? totalStockValue / totalVehicles : 0;

  return (
    <>
      <Header onSearch={handleSearch} />

      <main className="grid-container relative pb-32">
        {/* Barra de Métricas Rápidas (oculta durante busca/filtros para foco nos resultados) */}
        {!loading && !isFiltering && cars.length > 0 && (
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}
          >
            <div 
              style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '1.25rem',
                border: '1px solid #E9ECEF',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)'
              }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6C757D', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Estoque Atual
              </span>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.75rem', fontWeight: 800, color: '#121212' }}>
                {totalVehicles} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#6C757D' }}>veículos</span>
              </p>
            </div>

            <div 
              style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '1.25rem',
                border: '1px solid #E9ECEF',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)'
              }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6C757D', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Patrimônio em Estoque
              </span>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.75rem', fontWeight: 800, color: '#0A58CA' }}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalStockValue)}
              </p>
            </div>

            <div 
              style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '1.25rem',
                border: '1px solid #E9ECEF',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)'
              }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6C757D', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Ticket Médio
              </span>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.75rem', fontWeight: 800, color: '#121212' }}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(averagePrice)}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="callout alert border-l-4 border-red-500 bg-red-50 text-red-700 p-4 rounded-md shadow-sm mb-6">
            <p className="font-medium m-0 flex items-center">
              {error}
            </p>
          </div>
        )}

        <div className="grid-x grid-margin-x grid-margin-y small-up-1 medium-up-2 large-up-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div className="cell" key={index}>
                <SkeletonCard />
              </div>
            ))
          ) : (
            <>
              {cars.map((car) => (
                <div className="cell" key={car.plate}>
                  <CarCard
                    car={car}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                </div>
              ))}

              {cars.length === 0 && !error && (
                <div className="cell small-12 text-center mt-12">
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <div 
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: '#E9ECEF',
                        color: '#6C757D',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.4-1.7-1.1-2.2l-3.4-2.6A2 2 0 0016.3 8H7.7a2 2 0 00-1.2.2L3.1 10.8C2.4 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2m14 0a2 2 0 11-4 0m4 0a2 2 0 10-4 0m-8 0a2 2 0 11-4 0m4 0a2 2 0 10-4 0m2-5h10" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-gray-500 font-semibold mb-2">
                    Nenhum veículo disponível no momento.
                  </h4>
                  <p className="text-gray-400">
                    Tente buscar por outra placa ou adicione um novo carro ao estoque.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <FloatingActions onAddClick={handleAddClick} />

      <CarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCar}
        initialData={editingCar}
      />

      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handleAuthSuccess}
        adminPassword={adminPassword}
      />
    </>
  );
};