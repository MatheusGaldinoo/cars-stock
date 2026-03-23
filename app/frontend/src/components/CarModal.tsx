import React, { useState, useEffect, useRef } from 'react';
import type { Car } from '../services/api';

interface CarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (carData: any) => Promise<void>;
  initialData?: Car | null;
}

export const CarModal: React.FC<CarModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Car>>({
    plate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    photo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        plate: '', brand: '', model: '', year: new Date().getFullYear(), price: 0, photo: ''
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('A photo é muito grande. O limite é 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao salvar o veículo. Verifique se a placa já existe.');
    } finally {
      setLoading(false);
    }
  };

  const isEdit = !!initialData;

  // Basic styling for modal wrapper without assuming heavy Tailwind config
  const overlayStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)', zIndex: 9999,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: '#fff', borderRadius: '8px', width: '100%', maxWidth: '600px',
    maxHeight: '90vh', overflowY: 'auto', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #ebebeb', paddingBottom: '1rem' }}>
          <h2 style={{ margin: 0, color: '#333' }}>
            {isEdit ? 'Editar Veículo' : 'Cadastrar Novo Veículo'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#888' }}>&times;</button>
        </div>
        
        {error && (
          <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Foto do Veículo</label>
            {formData.photo && (
              <div style={{ marginBottom: '1rem' }}>
                <img src={formData.photo} alt="Preview" style={{ maxWidth: '200px', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: 'block' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Placa do Carro</label>
              <input 
                type="text" required disabled={isEdit}
                value={formData.plate}
                onChange={e => setFormData({...formData, plate: e.target.value.toUpperCase()})}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
                placeholder="Ex: ABC1234"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Marca</label>
              <input 
                type="text" required
                value={formData.brand}
                onChange={e => setFormData({...formData, brand: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
                placeholder="Ex: Toyota"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Modelo</label>
              <input 
                type="text" required
                value={formData.model}
                onChange={e => setFormData({...formData, model: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
                placeholder="Ex: Corolla"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Ano</label>
              <input 
                type="number" required min="1900" max="2100"
                value={formData.year}
                onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Preço (R$)</label>
            <input 
              type="number" required min="0" step="0.01"
              value={formData.price}
              onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
              placeholder="Ex: 50000.00"
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '2rem', borderTop: '1px solid #ebebeb', paddingTop: '1rem' }}>
            <button 
              type="button" onClick={onClose}
              style={{ padding: '0.75rem 1.5rem', background: '#f5f5f5', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: '#333' }}
            >
              Cancelar
            </button>
            <button 
              type="submit" disabled={loading}
              style={{ padding: '0.75rem 1.5rem', background: '#0A58CA', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {loading ? 'Salvando...' : 'Salvar Veículo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
