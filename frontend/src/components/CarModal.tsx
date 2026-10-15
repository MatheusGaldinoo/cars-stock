import React, { useState, useEffect, useRef } from 'react';
import type { Car } from '../services/api';

interface CarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (carData: Partial<Car>) => Promise<void>;
  initialData?: Car | null;
}

export const CarModal: React.FC<CarModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Car>>({
    plate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    photo: '',
    available: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados de ajuste fino e enquadramento da foto
  const [zoom, setZoom] = useState<number>(1);
  const [posX, setPosX] = useState<number>(50); // %
  const [posY, setPosY] = useState<number>(50); // %
  const [isRepositioning, setIsRepositioning] = useState<boolean>(false);
  const isDragging = useRef<boolean>(false);
  const dragStart = useRef<{ x: number; y: number; startPosX: number; startPosY: number }>({
    x: 0,
    y: 0,
    startPosX: 50,
    startPosY: 50
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        available: initialData.available !== undefined ? initialData.available : true
      });
    } else {
      setFormData({
        plate: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: 0,
        photo: '',
        available: true
      });
    }
    setZoom(1);
    setPosX(50);
    setPosY(50);
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Processa a foto final aplicando o zoom e reposicionamento em um Canvas
  const generateFramedImage = async (): Promise<string | undefined> => {
    if (!formData.photo) return undefined;
    
    // Se não houve alteração no enquadramento padrão, mantém original
    if (zoom === 1 && posX === 50 && posY === 50) {
      return formData.photo;
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Resolução padrão 16:9 de catálogo (800x450)
        canvas.width = 800;
        canvas.height = 450;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(formData.photo || undefined);
          return;
        }

        ctx.fillStyle = '#121212';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Dimensões da imagem após o zoom
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height) * zoom;
        const drawnWidth = img.width * scale;
        const drawnHeight = img.height * scale;

        // Posição baseada nas porcentagens de ajuste (0% a 100%)
        const offsetX = (canvas.width - drawnWidth) * (posX / 100);
        const offsetY = (canvas.height - drawnHeight) * (posY / 100);

        ctx.drawImage(img, offsetX, offsetY, drawnWidth, drawnHeight);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      };
      img.onerror = () => resolve(formData.photo || undefined);
      img.src = formData.photo || '';
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('A imagem é muito grande. O limite máximo é 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
        setZoom(1);
        setPosX(50);
        setPosY(50);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!formData.photo) return;
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      startPosX: posX,
      startPosY: posY
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;

    // Sensibilidade de arrasto
    const newX = Math.min(100, Math.max(0, dragStart.current.startPosX - deltaX * 0.25));
    const newY = Math.min(100, Math.max(0, dragStart.current.startPosY - deltaY * 0.25));

    setPosX(Math.round(newX));
    setPosY(Math.round(newY));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      let finalPhoto = formData.photo;
      if (formData.photo) {
        const framed = await generateFramedImage();
        if (framed) finalPhoto = framed;
      }

      await onSave({
        ...formData,
        photo: finalPhoto
      });
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Erro ao salvar o veículo. Verifique os dados informados.');
      } else {
        setError('Erro ao salvar o veículo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isEdit = !!initialData;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(18, 18, 18, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '640px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E9ECEF'
        }}
      >
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            borderBottom: '1px solid #E9ECEF',
            paddingBottom: '1rem'
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#121212' }}>
              {isEdit ? 'Editar Veículo' : 'Cadastrar Novo Veículo'}
            </h2>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#6C757D' }}>
              Preencha os detalhes e ajuste a foto para exibição no catálogo
            </p>
          </div>
          <button 
            onClick={onClose} 
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6C757D',
              display: 'flex'
            }}
            aria-label="Fechar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div 
            style={{
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              borderLeft: '4px solid #DC2626'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Seção de Foto com Reposicionamento */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#212529' }}>
                Foto do Veículo
              </label>
              {formData.photo && (
                <button
                  type="button"
                  onClick={() => setIsRepositioning(!isRepositioning)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0A58CA',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  {isRepositioning ? 'Ocultar Ajustes' : 'Ajustar / Reposicionar'}
                </button>
              )}
            </div>

            {formData.photo ? (
              <div style={{ marginBottom: '1rem' }}>
                {/* Visualizador / Área de Reposicionamento */}
                <div
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{
                    width: '100%',
                    height: '240px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundColor: '#121212',
                    cursor: isDragging.current ? 'grabbing' : 'grab',
                    border: '2px solid #DEE2E6',
                    userSelect: 'none'
                  }}
                >
                  <img
                    src={formData.photo}
                    alt="Preview"
                    draggable={false}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: `${posX}% ${posY}%`,
                      transform: `scale(${zoom})`,
                      transition: isDragging.current ? 'none' : 'transform 0.1s ease',
                      pointerEvents: 'none'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      background: 'rgba(0, 0, 0, 0.65)',
                      color: '#FFF',
                      fontSize: '0.75rem',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      pointerEvents: 'none'
                    }}
                  >
                    Arraste para reposicionar
                  </div>
                </div>

                {/* Controles de Zoom e Posição */}
                {isRepositioning && (
                  <div 
                    style={{
                      marginTop: '0.75rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#F8F9FA',
                      borderRadius: '8px',
                      border: '1px solid #E9ECEF'
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: '#495057', marginBottom: '0.25rem' }}>
                          <span>Zoom</span>
                          <span>{zoom.toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="2.5"
                          step="0.05"
                          value={zoom}
                          onChange={(e) => setZoom(parseFloat(e.target.value))}
                          style={{ width: '100%', cursor: 'pointer' }}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setZoom(1);
                            setPosX(50);
                            setPosY(50);
                          }}
                          style={{
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.75rem',
                            borderRadius: '6px',
                            border: '1px solid #DEE2E6',
                            background: '#FFF',
                            color: '#495057',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Centralizar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (fileInputRef.current) fileInputRef.current.value = '';
                            setFormData({ ...formData, photo: '' });
                            setZoom(1);
                            setPosX(50);
                            setPosY(50);
                          }}
                          style={{
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.75rem',
                            borderRadius: '6px',
                            border: '1px solid #FEE2E2',
                            background: '#FFF',
                            color: '#DC2626',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Remover Foto
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />

            {!formData.photo && (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed #0A58CA',
                  borderRadius: '12px',
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  backgroundColor: 'rgba(10, 88, 202, 0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem', color: '#0A58CA' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#121212' }}>
                  Clique para selecionar a foto do veículo
                </p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#6C757D' }}>
                  PNG, JPG ou WEBP de até 5MB
                </p>
              </div>
            )}

            {formData.photo && (
              <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #DEE2E6',
                    backgroundColor: '#FFFFFF',
                    color: '#0A58CA',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Trocar Imagem
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.85rem', color: '#212529' }}>
                Placa do Veículo
              </label>
              <input
                type="text"
                required
                disabled={isEdit}
                value={formData.plate}
                onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #DEE2E6',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                  textTransform: 'uppercase'
                }}
                placeholder="Ex: ABC1234"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.85rem', color: '#212529' }}>
                Marca
              </label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #DEE2E6',
                  borderRadius: '8px',
                  boxSizing: 'border-box'
                }}
                placeholder="Ex: Toyota"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.85rem', color: '#212529' }}>
                Modelo
              </label>
              <input
                type="text"
                required
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #DEE2E6',
                  borderRadius: '8px',
                  boxSizing: 'border-box'
                }}
                placeholder="Ex: Corolla XEi"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.85rem', color: '#212529' }}>
                Ano de Fabricação
              </label>
              <input
                type="number"
                required
                min="1950"
                max="2030"
                value={formData.year || ''}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #DEE2E6',
                  borderRadius: '8px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.85rem', color: '#212529' }}>
                Preço (R$)
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price ?? ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #DEE2E6',
                  borderRadius: '8px',
                  boxSizing: 'border-box'
                }}
                placeholder="Ex: 85000.00"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.85rem', color: '#212529' }}>
                Status no Estoque
              </label>
              <select
                value={formData.available !== false ? 'available' : 'sold'}
                onChange={(e) => setFormData({ ...formData, available: e.target.value === 'available' })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #DEE2E6',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                  backgroundColor: '#FFF'
                }}
              >
                <option value="available">Em Estoque</option>
                <option value="sold">Reservado / Vendido</option>
              </select>
            </div>
          </div>

          <div 
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '2rem',
              borderTop: '1px solid #E9ECEF',
              paddingTop: '1.25rem'
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: '1px solid #DEE2E6',
                background: '#F8F9FA',
                color: '#495057',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem 1.75rem',
                borderRadius: '8px',
                border: 'none',
                background: '#0A58CA',
                color: '#FFFFFF',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(10, 88, 202, 0.3)'
              }}
            >
              {loading ? 'Salvando...' : 'Salvar Veículo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
