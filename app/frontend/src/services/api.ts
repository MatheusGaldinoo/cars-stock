import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
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
  disponibilidade: boolean;
  foto?: string | null;
}

export const fetchCars = async (): Promise<Car[]> => {
  const response = await api.get('/cars/');
  return response.data;
};

export const fetchCarByPlaca = async (placa: string): Promise<Car> => {
  const response = await api.get(`/cars/${placa}`);
  return response.data;
};

// Optionally if the user wants to mark it as sold:
export const sellCar = async (placa: string): Promise<Car> => {
  const response = await api.post(`/cars/${placa}/sell`);
  return response.data;
};

export const createCar = async (carData: Omit<Car, "foto" | "disponibilidade"> & { foto?: string | null, disponibilidade?: boolean }): Promise<Car> => {
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
