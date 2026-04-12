import React, { useEffect, useState } from 'react';
import { fetchCars, createCar, updateCar, deleteCar, type Car } from '../services/api';
import { Header } from '../components/Header';
import { CarCard } from '../components/CarCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { CarModal } from '../components/CarModal';
import { FloatingActions } from '../components/FloatingActions';

export const Home: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('stock_auth') === 'true'
  );

  // 🔹 Carregar configurações
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

  // 🔹 Carregar carros
  const loadCars = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simular um carregamento leve para garantir que o skeleton seja visível
      // O usuário pediu especificamente para ver a animação funcionando
      await new Promise(resolve => setTimeout(resolve, 800));

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

  // 🔹 Busca
  const handleSearch = async (plate: string) => {
    try {
      setLoading(true);
      setError(null);

      // Pequeno delay para feedback visual do skeleton
      await new Promise(resolve => setTimeout(resolve, 500));

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

  // 🔹 Auth simples
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

  // 🔹 Handlers
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
    if (!checkAuth()) return;

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
              {error}
            </p>
          </div>
        )}

        <div className="grid-x grid-margin-x grid-margin-y small-up-1 medium-up-2 large-up-3">
          {loading ? (
            // 🔹 Skeleton real
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
                  <div className="text-6xl mb-4 opacity-50">🚗</div>
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
    </>
  );
};