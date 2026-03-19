import React from 'react';
import type { Car } from '../services/api';

interface CarCardProps {
  car: Car;
  onEdit: (car: Car) => void;
  onDelete: (placa: string) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onEdit, onDelete }) => {
  return (
    <div className="car-card">
      <div className="car-image-container">
        {car.foto ? (
          <img src={car.foto} alt={`${car.marca} ${car.modelo}`} />
        ) : (
          <div className="no-image">🚗</div>
        )}
      </div>
      <div className="car-content">
        <h3 className="car-title">{car.marca} {car.modelo}</h3>
        <p className="car-subtitle">Ano: {car.ano} • Placa: <span style={{ textTransform: 'uppercase' }}>{car.placa}</span></p>
        
        <div className="car-attributes">
          <span className={`label ${car.disponibilidade ? 'success' : 'sold'}`}>
            {car.disponibilidade ? 'Disponível' : 'Vendido'}
          </span>
        </div>
        
        <div className="car-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="car-price">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(car.preco)}
          </p>

          <div className="car-actions" style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => onEdit(car)}
              title="Editar Carro"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#0A58CA', padding: '4px' }}
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
            <button 
              onClick={() => onDelete(car.placa)}
              title="Excluir Carro"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#DC3545', padding: '4px' }}
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
