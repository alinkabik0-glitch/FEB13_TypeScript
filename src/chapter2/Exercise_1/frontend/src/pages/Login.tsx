import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { login } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store';
import styled from 'styled-components';

const Container = styled.div`display: flex; justify-content: center; align-items: center; height: 100vh;`;
const Form = styled.form`border: 2px solid #6b7c93; padding: 40px; border-radius: 8px; background: white; width: 300px; display: flex; flex-direction: column; gap: 15px;`;
const Input = styled.input`padding: 10px; border: 1px solid #ccc; border-radius: 4px;`;
const Button = styled.button`padding: 10px; background: #4a90d9; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; &:hover { background: #357abd; }`;

interface LoginFormData { login: string; password: string; }

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({ login: '', password: '' });
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { error } = useAppSelector((state) => state.auth);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(login(formData)).unwrap();
      history.push('/vacancies');
    } catch (err) { /* Ошибка уже обработана в slice */ }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center', margin: 0 }}>Login</h2>
        {error && <p style={{ color: 'red', fontSize: 12 }}>{error}</p>}
        <Input name="login" placeholder="Login" value={formData.login} onChange={handleChange} required />
        <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <Button type="submit">Sign In</Button>
        <div style={{ textAlign: 'center', fontSize: 12 }}>
          <Link to="/signup">Create an account (Seeker)</Link><br/>
          <Link to="/company-signup">Create an account (Company)</Link>
        </div>
      </Form>
    </Container>
  );
};

export default Login;