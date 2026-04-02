import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.BACKEND_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Car {
  plate: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  photo?: string | null;
}

export interface CompanySettings {
  id: number;
  name: string;
  logo_url?: string | null;
  admin_password?: string | null;
}

export const fetchCars = async (plate?: string): Promise<Car[]> => {
  const response = await api.get('/cars/', {
    params: { plate }
  });
  return response.data;
};

export const fetchCarByPlate = async (plate: string): Promise<Car> => {
  const response = await api.get(`/cars/${plate}`);
  return response.data;
};

export const createCar = async (carData: Omit<Car, "photo"> & { photo?: string | null }): Promise<Car> => {
  const response = await api.post('/cars/', carData);
  return response.data;
};

export const updateCar = async (plate: string, carData: Partial<Car>): Promise<Car> => {
  const response = await api.patch(`/cars/${plate}`, carData);
  return response.data;
};

export const deleteCar = async (plate: string): Promise<void> => {
  await api.delete(`/cars/${plate}`);
};

export const fetchCompanySettings = async (): Promise<CompanySettings> => {
  const response = await api.get('/settings');
  return response.data;
};

export default api;
