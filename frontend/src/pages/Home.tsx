import React, { useEffect, useState } from 'react';
import { fetchCars, createCar, updateCar, deleteCar, type Car } from '../services/api';
import { Header } from '../components/Header';
import { CarCard } from '../components/CarCard';
import { CarModal } from '../components/CarModal';
import { FloatingActions } from '../components/FloatingActions';

export const Home: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState<string>('');

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

  // Modal and Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  
  // Utilizando sessionStorage para manter a senha apenas durante a sessão ativa.
  const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('stock_auth') === 'true');

  const loadCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCars();
      setCars(data);
    } catch {
      setError('Erro ao carregar os carros.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  const handleSearch = async (plate: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCars(plate.toUpperCase());
      setCars(data);
      
      if (data.length === 0 && plate.trim() !== '') {
        setError(`Nenhum carro encontrado com a placa ${plate.toUpperCase()}`);
      }
    } catch {
      setError('Ocorreu um erro ao buscar os dados.');
    } finally {
      setLoading(false);
    }
  };

  // Simple Authentication Verification
  const checkAuth = (): boolean => {
    if (isAuthenticated) return true;
    
    const pwd = window.prompt('Acesso Restrito: Digite a senha do administrador:');
    
    if (pwd !== null && pwd === adminPassword) {
      sessionStorage.setItem('stock_auth', 'true');
      setIsAuthenticated(true);
      return true;
    }
    
    if (pwd !== null) {
      alert('Senha incorreta!');
    }
    return false;
  };

  // Action Handlers
  const handleAddClick = () => {
    if (checkAuth()) {
      setEditingCar(null);
      setIsModalOpen(true);
    }
  };

  const handleEditClick = (car: Car) => {
    if (checkAuth()) {
      setEditingCar(car);
      setIsModalOpen(true);
    }
  };

  const handleDeleteClick = async (plate: string) => {
    if (checkAuth()) {
      if (window.confirm(`ATENÇÃO! Deseja remover o carro ${plate}?`)) {
        try {
          setLoading(true);
          await deleteCar(plate);
          await loadCars();
        } catch {
          alert('Erro ao excluir carro.');
          setLoading(false);
        }
      }
    }
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

  return (
    <>
      <Header onSearch={handleSearch} />
      
      <main className="grid-container relative pb-32">
        {error && (
          <div className="callout alert border-l-4 border-red-500 bg-red-50 text-red-700 p-4 rounded-md shadow-sm mb-6">
            <p className="font-medium m-0 flex items-center">
              <svg style={{width: '1.25rem', height: '1.25rem', marginRight: '0.5rem'}} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              {error}
            </p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <p className="text-gray-500 font-medium">Carregando veículos...</p>
          </div>
        ) : (
          <div className="grid-x grid-margin-x grid-margin-y small-up-1 medium-up-2 large-up-3">
            {cars.map((car) => (
              <div className="cell" key={car.plate}>
                <CarCard 
                  car={car} 
                  onEdit={handleEditClick} 
                  onDelete={handleDeleteClick} 
                />
              </div>
            ))}
            
            {!loading && cars.length === 0 && !error && (
              <div className="cell small-12 text-center mt-12">
                <div className="text-6xl mb-4 opacity-50">🚗</div>
                <h4 className="text-gray-500 font-semibold mb-2">Nenhum veículo disponível no momento.</h4>
                <p className="text-gray-400">Tente buscar por outra placa ou adicione um novo carro ao estoque.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <FloatingActions onAddClick={handleAddClick} />
      
      <CarModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveCar} 
        initialData={editingCar} 
      />
    </>
  );
};
