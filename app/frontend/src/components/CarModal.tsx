import React, { useState, useEffect } from 'react';
import type { Car } from '../services/api';

interface CarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (carData: any) => Promise<void>;
  initialData?: Car | null;
}

export const CarModal: React.FC<CarModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Car>>({
    placa: '',
    marca: '',
    modelo: '',
    ano: new Date().getFullYear(),
    preco: 0,
    disponibilidade: true,
    foto: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        placa: '', marca: '', modelo: '', ano: new Date().getFullYear(), preco: 0, disponibilidade: true, foto: ''
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao salvar. Verifique se os dados estão corretos.');
    } finally {
      setLoading(false);
    }
  };

  const isEdit = !!initialData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">{isEdit ? 'Editar Carro' : 'Novo Carro'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Placa *</label>
              <input 
                type="text" 
                required
                disabled={isEdit}
                value={formData.placa}
                onChange={e => setFormData({...formData, placa: e.target.value.toUpperCase()})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A58CA] disabled:bg-gray-100 uppercase"
                placeholder="ABC1234"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca *</label>
              <input 
                type="text" required
                value={formData.marca}
                onChange={e => setFormData({...formData, marca: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A58CA]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modelo *</label>
              <input 
                type="text" required
                value={formData.modelo}
                onChange={e => setFormData({...formData, modelo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A58CA]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ano *</label>
              <input 
                type="number" required min="1900" max="2100"
                value={formData.ano}
                onChange={e => setFormData({...formData, ano: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A58CA]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) *</label>
              <input 
                type="number" required min="0" step="0.01"
                value={formData.preco}
                onChange={e => setFormData({...formData, preco: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A58CA]"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">URL da Foto</label>
              <input 
                type="url" 
                value={formData.foto || ''}
                onChange={e => setFormData({...formData, foto: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A58CA]"
                placeholder="https://exemplo.com/foto.jpg"
              />
            </div>
            
            <div className="col-span-2 flex items-center mt-2">
              <input 
                type="checkbox" 
                id="disponibilidade"
                checked={formData.disponibilidade}
                onChange={e => setFormData({...formData, disponibilidade: e.target.checked})}
                className="h-4 w-4 text-[#0A58CA] focus:ring-[#0A58CA] border-gray-300 rounded"
              />
              <label htmlFor="disponibilidade" className="ml-2 block text-sm font-medium text-gray-900">
                Disponível para Venda
              </label>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 shadow-sm"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-[#0A58CA] border border-transparent rounded-md hover:bg-blue-700 shadow-sm disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
