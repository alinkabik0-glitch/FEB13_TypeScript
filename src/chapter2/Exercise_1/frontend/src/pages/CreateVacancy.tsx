import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createVacancy } from '../store/vacanciesSlice';
import { useAppDispatch, useAppSelector } from '../store';
import styled from 'styled-components';

// ... (оставь все styled-компоненты Form, Input, TextArea, Select, Label, ButtonContainer, Button без изменений, как они были) ...
const Form = styled.form`max-width: 700px; background: white; padding: 30px; border-radius: 8px; border: 2px solid #4a90d9; display: flex; flex-direction: column; gap: 20px;`;
const Input = styled.input`padding: 12px; border: 1px solid #4a90d9; border-radius: 4px; font-size: 14px; &:focus { outline: none; border-color: #2c5aa0; }`;
const TextArea = styled.textarea`padding: 12px; border: 1px solid #4a90d9; border-radius: 4px; min-height: 120px; font-size: 14px; resize: vertical; &:focus { outline: none; border-color: #2c5aa0; }`;
const Select = styled.select`padding: 12px; border: 1px solid #4a90d9; border-radius: 4px; font-size: 14px; background: white; cursor: pointer; &:focus { outline: none; border-color: #2c5aa0; }`;
const Label = styled.label`font-size: 14px; color: #2c3e50; margin-bottom: -10px;`;
const ButtonContainer = styled.div`display: flex; gap: 15px; justify-content: flex-end; margin-top: 10px;`;
const Button = styled.button<{ $danger?: boolean }>`padding: 12px 30px; border: 2px solid ${props => props.$danger ? '#e74c3c' : '#27ae60'}; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 14px; background: white; color: ${props => props.$danger ? '#e74c3c' : '#27ae60'}; &:hover { background: ${props => props.$danger ? '#e74c3c' : '#27ae60'}; color: white; }`;

interface VacancyForm {
  title: string;
  description: string;
  englishLevel: string;
  grade: string;
  tags: string;
}

const CreateVacancy: React.FC = () => {
  const [form, setForm] = useState<VacancyForm>({ title: '', description: '', englishLevel: 'B2', grade: 'Middle', tags: '' });
  const dispatch = useAppDispatch(); // ИСПРАВЛЕНО
  const history = useHistory();
  const { error } = useAppSelector((state) => state.vacancies); // ИСПРАВЛЕНО

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const tagsArray = form.tags.split(',').map((t: string) => t.trim()); // ИСПРАВЛЕНО: тип для t
    try {
      await dispatch(createVacancy({ ...form, tags: tagsArray })).unwrap();
      history.push('/active-vacancies');
    } catch (err) {
      // Ошибка обработана
    }
  };

  // Универсальный обработчик изменений
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Create Vacancy</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Form onSubmit={handleSubmit}>
        <Label>Vacancy title</Label>
        <Input name="title" placeholder="Vacancy title" value={form.title} onChange={handleChange} required />
        
        <Label>Vacancy description</Label>
        <TextArea name="description" placeholder="Vacancy description" value={form.description} onChange={handleChange} required />
        
        <Label>English lvl</Label>
        <Select name="englishLevel" value={form.englishLevel} onChange={handleChange}>
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
          <option value="C1">C1</option>
          <option value="C2">C2</option>
        </Select>
        
        <Label>Grade</Label>
        <Select name="grade" value={form.grade} onChange={handleChange}>
          <option value="Junior">Junior</option>
          <option value="Middle">Middle</option>
          <option value="Senior">Senior</option>
          <option value="Lead">Lead</option>
        </Select>
        
        <Label>Tags</Label>
        <Input name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handleChange} required />
        
        <ButtonContainer>
          <Button $danger type="button" onClick={() => history.goBack()}>Close</Button>
          <Button type="submit">Save</Button>
        </ButtonContainer>
      </Form>
    </div>
  );
};

export default CreateVacancy;