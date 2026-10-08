import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchVacancies } from '../store/vacanciesSlice';
import { Vacancy } from '../types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const List = styled.div`
  display: flex; 
  flex-direction: column; 
  gap: 20px;
`;

const Card = styled.div<{ $active?: boolean }>`
  border: 2px solid #6b7c93;
  border-radius: 4px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  cursor: pointer;
  transition: 0.3s;
  
  &:hover {
    border-color: #4a90d9;
    box-shadow: 0 2px 8px rgba(74, 144, 217, 0.2);
  }
  
  ${props => props.$active && `border-color: #4a90d9; background: #f0f8ff;`}
`;

const Vacancies: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((state) => state.vacancies);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchVacancies());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Vacancies</h2>
      <List>
        {list.map((v: Vacancy) => (
          <Link 
            to={`/vacancies/${v.id}`} 
            key={v.id} 
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Card $active={v.user_responded === 1}>
              <div>
                <h3 style={{ margin: '0 0 8px 0' }}>{v.title}</h3>
                <p style={{ margin: 0, color: '#6b7c93', fontSize: 14 }}>
                  {v.short_description}...
                </p>
              </div>
              <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                {user?.role === 'seeker' && v.user_responded === 1 && (
                  <span style={{ color: '#27ae60', fontWeight: 'bold' }}>
                    ✓ You responded
                  </span>
                )}
                {user?.role === 'employer' && (
                  <span style={{ color: '#6b7c93' }}>
                     👤 {v.response_count || 0}
                  </span>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </List>
    </div>
  );
};

export default Vacancies;