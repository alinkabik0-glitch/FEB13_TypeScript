import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { fetchVacancyById, respondToVacancy, cancelResponse, fetchVacancies } from '../store/vacanciesSlice';
import { useAppDispatch, useAppSelector } from '../store';
import { Vacancy } from '../types';
import styled from 'styled-components';

const DetailContainer = styled.div`background: white; border: 2px solid #6b7c93; border-radius: 8px; padding: 30px; max-width: 900px; position: relative;`;
const Header = styled.div`display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;`;
const Title = styled.h2`margin: 0; flex: 1;`;
const MetaTags = styled.div`display: flex; gap: 10px;`;
const Tag = styled.span`padding: 6px 12px; border: 1px solid #4a90d9; border-radius: 4px; font-size: 12px; color: #4a90d9; background: white;`;
const DescBlock = styled.div`background: #d8b4fe; padding: 30px; border-radius: 4px; margin: 20px 0; color: #2c3e50; font-size: 16px; min-height: 150px;`;
const ContactsSection = styled.div`margin: 30px 0;`;
const ContactsTitle = styled.h3`font-size: 18px; margin-bottom: 15px;`;
const TagsContainer = styled.div`display: flex; flex-wrap: wrap; gap: 10px;`;
const Button = styled.button<{ $danger?: boolean }>`padding: 12px 24px; border: 2px solid ${props => props.$danger ? '#e74c3c' : '#27ae60'}; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 14px; background: white; color: ${props => props.$danger ? '#e74c3c' : '#27ae60'}; &:hover { background: ${props => props.$danger ? '#e74c3c' : '#27ae60'}; color: white; }`;
const ButtonContainer = styled.div`display: flex; justify-content: flex-end; margin-top: 30px;`;
const BackButton = styled.button`background: none; border: none; color: #4a90d9; cursor: pointer; font-size: 14px; padding: 0; &:hover { text-decoration: underline; }`;

const VacancyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { current: v, loading } = useAppSelector((state) => state.vacancies);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchVacancyById(Number(id)));
  }, [dispatch, id]);

  if (loading || !v) return <p>Loading...</p>;

  const handleResponse = async () => {
    try {
      await dispatch(respondToVacancy(Number(id))).unwrap();
      dispatch(fetchVacancyById(Number(id)));
      dispatch(fetchVacancies());
    } catch (err) { /* Обработка ошибки */ }
  };

  const handleCancel = async () => {
    try {
      await dispatch(cancelResponse(Number(id))).unwrap();
      dispatch(fetchVacancyById(Number(id)));
      dispatch(fetchVacancies());
    } catch (err) { /* Обработка ошибки */ }
  };

  const tagsArray = v.tags ? v.tags.split(',').map((t: string) => t.trim()) : [];

  return (
    <DetailContainer>
      <Header>
        <Title>{v.title}</Title>
        <MetaTags>
          {v.english_level && <Tag>{v.english_level}</Tag>}
          {v.grade && <Tag>{v.grade}</Tag>}
        </MetaTags>
      </Header>
      <DescBlock>{v.description}</DescBlock>
      <ContactsSection>
        <ContactsTitle>Contacts / Tags</ContactsTitle>
        <TagsContainer>
          {tagsArray.map((tag: string, index: number) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </TagsContainer>
      </ContactsSection>
      {user?.role === 'seeker' && (
        <ButtonContainer>
          {v.user_responded === 1 ? (
            <Button $danger onClick={handleCancel}>Cancel response</Button>
          ) : (
            <Button onClick={handleResponse}>Response</Button>
          )}
        </ButtonContainer>
      )}
      {user?.role === 'employer' && (
        <p style={{ color: '#6b7c93', marginTop: 20 }}>Responses count: {v.response_count || 0}</p>
      )}
      <BackButton onClick={() => history.goBack()}>← Back</BackButton>
    </DetailContainer>
  );
};

export default VacancyDetail;