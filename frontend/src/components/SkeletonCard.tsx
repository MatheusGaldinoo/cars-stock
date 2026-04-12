import React from 'react';

export const SkeletonCard: React.FC = () => (
  <div className="skeleton-card">
    <div className="skeleton-image skeleton-item"></div>
    <div className="skeleton-content">
      <div className="skeleton-title skeleton-item"></div>
      <div className="skeleton-text skeleton-item"></div>
      <div className="skeleton-footer">
        <div className="skeleton-price skeleton-item"></div>
        <div className="skeleton-btns">
          <div className="skeleton-btn skeleton-item"></div>
          <div className="skeleton-btn skeleton-item"></div>
        </div>
      </div>
    </div>
  </div>
);
