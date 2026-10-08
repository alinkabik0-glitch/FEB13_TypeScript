import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchMyVacancies } from '../store/vacanciesSlice';
import { Vacancy } from '../types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const List = styled.div`
  display: flex; 
  flex-direction: column; 
  gap: 20px;
`;

const Card = styled.div`
  border: 2px solid #6b7c93; 
  border-radius: 4px; 
  padding: 20px; 
  background: white; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  cursor: pointer; 
  
  &:hover { 
    border-color: #4a90d9; 
  }
`;

const MyVacancies: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((state) => state.vacancies);

  useEffect(() => {
    dispatch(fetchMyVacancies());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>My Vacancies</h2>
      <List>
        {list.map((v: Vacancy) => (
          <Link to={`/my-vacancies/${v.id}`} key={v.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Card>
              <div>
                <h3 style={{ margin: '0 0 8px 0' }}>{v.title}</h3>
                <p style={{ margin: 0, color: '#6b7c93', fontSize: 14 }}>{v.short_description}...</p>
              </div>
              <span style={{ color: '#27ae60' }}>✓ Responded</span>
            </Card>
          </Link>
        ))}
      </List>
    </div>
  );
};

export default MyVacancies;