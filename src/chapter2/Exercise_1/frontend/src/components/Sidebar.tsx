// src/components/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../types';
import styled from 'styled-components';

const SidebarContainer = styled.aside`
  width: 220px;
  background: #ffffff;
  border-right: 2px solid #6b7c93;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative; /* Важно! */
`;

const NavItem = styled(Link)<{ $active: boolean }>`
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${props => props.$active ? '#4a90d9' : '#6b7c93'};
  text-decoration: none;
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
  font-size: 14px;
  
  &:hover {
    background: #f0f8ff;
    color: #4a90d9;
  }
`;

// Кнопка внизу sidebar (не fixed, чтобы не обрезалась)
const LogoutButton = styled.button`
  margin-top: auto;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  border-top: 1px solid #eee;
  color: #6b7c93;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #f0f8ff;
    color: #4a90d9;
  }
`;

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const menuItems = user?.role === 'employer' 
    ? [
        { path: '/vacancies', label: 'Vacancies', icon: '📄' },
        { path: '/active-vacancies', label: 'Active vacancies', icon: '📋' },
        { path: '/create-vacancy', label: 'Create vacancy', icon: '✏️' },
      ]
    : [
        { path: '/vacancies', label: 'Vacancies', icon: '📄' },
        { path: '/my-vacancies', label: 'My vacancies', icon: '📁' },
      ];

  return (
    <SidebarContainer>
      {menuItems.map(item => (
        <NavItem 
          key={item.path} 
          to={item.path} 
          $active={location.pathname.startsWith(item.path)}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </NavItem>
      ))}
      <LogoutButton onClick={onLogout}>
        <span>🚪</span>
        <span>Logout</span>
      </LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar;