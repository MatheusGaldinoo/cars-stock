import React from 'react';
import type { Car } from '../services/api';

interface CarCardProps {
  car: Car;
  onEdit: (car: Car) => void;
  onDelete: (plate: string) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onEdit, onDelete }) => {
  return (
    <div className="car-card">
      <div className="car-image-container">
        {car.photo ? (
          <img src={car.photo} alt={`${car.brand} ${car.model}`} />
        ) : (
          <div className="no-image">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.4-1.7-1.1-2.2l-3.4-2.6A2 2 0 0016.3 8H7.7a2 2 0 00-1.2.2L3.1 10.8C2.4 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2m14 0a2 2 0 11-4 0m4 0a2 2 0 10-4 0m-8 0a2 2 0 11-4 0m4 0a2 2 0 10-4 0m2-5h10" />
            </svg>
          </div>
        )}
      </div>
      <div className="car-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <h3 className="car-title" style={{ margin: 0 }}>{car.brand} {car.model}</h3>
          <span 
            style={{
              padding: '0.2rem 0.6rem',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              whiteSpace: 'nowrap',
              backgroundColor: car.available !== false ? 'rgba(25, 135, 84, 0.12)' : 'rgba(108, 117, 125, 0.15)',
              color: car.available !== false ? '#198754' : '#6C757D',
              border: `1px solid ${car.available !== false ? 'rgba(25, 135, 84, 0.25)' : 'rgba(108, 117, 125, 0.25)'}`
            }}
          >
            {car.available !== false ? 'Em Estoque' : 'Reservado'}
          </span>
        </div>
        <p className="car-subtitle">Ano: {car.year} • Placa: <span style={{ textTransform: 'uppercase' }}>{car.plate}</span></p>
        
        
        <div className="car-footer">
          <p className="car-price">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(car.price)}
          </p>

          <div className="car-actions">
            <button 
              className="action-btn"
              onClick={() => onEdit(car)}
              title="Editar Carro"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
            <button 
              className="action-btn delete"
              onClick={() => onDelete(car.plate)}
              title="Excluir Carro"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
