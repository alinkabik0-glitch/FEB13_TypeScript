// src/App.tsx
import React, { useEffect } from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from './types';
import { logout } from './store/authSlice';
import withAuth from './hoc/withAuth';

import Login from './pages/Login';
import Registration from './pages/Registration';
import RegistrationCompany from './pages/RegistrationCompany';
import Vacancies from './pages/Vacancies';
import VacancyDetail from './pages/VacancyDetail';
import MyVacancies from './pages/MyVacancies';
import MyVacancyDetail from './pages/MyVacancyDetail';
import ActiveVacancies from './pages/ActiveVacancies';
import ActiveVacancyDetail from './pages/ActiveVacancyDetail';
import CreateVacancy from './pages/CreateVacancy';
import Sidebar from './components/Sidebar';

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f4f7f6;
  font-family: Arial, sans-serif;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 40px;
  overflow-y: auto;
`;

const ProtectedVacancies = withAuth(Vacancies);
const ProtectedVacancyDetail = withAuth(VacancyDetail);
const ProtectedMyVacancies = withAuth(MyVacancies, 'seeker');
const ProtectedMyVacancyDetail = withAuth(MyVacancyDetail, 'seeker');
const ProtectedActiveVacancies = withAuth(ActiveVacancies, 'employer');
const ProtectedActiveVacancyDetail = withAuth(ActiveVacancyDetail, 'employer');
const ProtectedCreateVacancy = withAuth(CreateVacancy, 'employer');

const App: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (user && (window.location.pathname === '/login' || window.location.pathname === '/signup' || window.location.pathname === '/company-signup')) {
      history.push('/vacancies');
    }
  }, [user, history]);

  const handleLogout = () => {
    dispatch(logout());
    history.push('/login');
  };

  return (
    <AppContainer>
      {user && <Sidebar onLogout={handleLogout} />}
      <MainContent>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Registration} />
          <Route exact path="/company-signup" component={RegistrationCompany} />
          
          <Route exact path="/vacancies" component={ProtectedVacancies} />
          <Route exact path="/vacancies/:id" component={ProtectedVacancyDetail} />
          <Route exact path="/my-vacancies" component={ProtectedMyVacancies} />
          <Route exact path="/my-vacancies/:id" component={ProtectedMyVacancyDetail} />
          <Route exact path="/active-vacancies" component={ProtectedActiveVacancies} />
          <Route exact path="/active-vacancies/:id" component={ProtectedActiveVacancyDetail} />
          <Route exact path="/create-vacancy" component={ProtectedCreateVacancy} />
          
          <Redirect exact from="/" to="/vacancies" />
          <Redirect to="/vacancies" />
        </Switch>
      </MainContent>
    </AppContainer>
  );
};

export default App;