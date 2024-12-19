import React, { useContext } from 'react';
import { Context } from './Context';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { products, categories, loading } = useContext(Context);
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Total Products',
      count: products.length,
      icon: <i className="fas fa-box-open"></i>,
      color: '#4CAF50',
      bgColor: '#E8F5E9',
      link: '/product'
    },
    {
      title: 'Total Categories',
      count: categories.length,
      icon: <i className="fas fa-tags"></i>,
      color: '#2196F3',
      bgColor: '#E3F2FD',
      link: '/category'
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-loader">
        <i className="fas fa-spinner fa-spin"></i>
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        <i className="fas fa-tachometer-alt"></i>
        Dashboard Overview
      </h1>

      <div className="stats-container">
        {cards.map((card, index) => (
          <div 
            key={index}
            className="stat-card"
            style={{ backgroundColor: card.bgColor }}
            onClick={() => navigate(card.link)}
          >
            <div className="card-icon" style={{ color: card.color }}>
              {card.icon}
            </div>
            <div className="card-content">
              <h3 className="card-title" style={{ color: card.color }}>
                {card.title}
              </h3>
              <p className="card-count">{card.count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;