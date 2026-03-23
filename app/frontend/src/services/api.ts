import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Car {
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  preco: number;
  foto?: string | null;
}

export const fetchCars = async (placa?: string): Promise<Car[]> => {
  const response = await api.get('/cars/', {
    params: { placa }
  });
  return response.data;
};

export const fetchCarByPlaca = async (placa: string): Promise<Car> => {
  const response = await api.get(`/cars/${placa}`);
  return response.data;
};

export const createCar = async (carData: Omit<Car, "foto"> & { foto?: string | null }): Promise<Car> => {
  const response = await api.post('/cars/', carData);
  return response.data;
};

export const updateCar = async (placa: string, carData: Partial<Car>): Promise<Car> => {
  const response = await api.patch(`/cars/${placa}`, carData);
  return response.data;
};

export const deleteCar = async (placa: string): Promise<void> => {
  await api.delete(`/cars/${placa}`);
};

export default api;
