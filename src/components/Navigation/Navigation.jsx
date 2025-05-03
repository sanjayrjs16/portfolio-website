import React from 'react';
import './Navigation.css';

const Navigation = ({ currentPath }) => {
  const navItems = [
    { path: '/work', label: 'Work' },
    { path: '/', label: 'About' },
    { path: '/posts', label: 'Posts' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <nav className="navigation">
      {navItems.map(item => (
        <a
          key={item.path}
          href={item.path}
          className={`nav-item ${currentPath === item.path ? 'active' : ''}`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
};

export default Navigation; 