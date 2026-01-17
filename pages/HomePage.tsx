import React from 'react';
import Dashboard from '../components/Dashboard';

interface HomePageProps {
  isDark: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ isDark }) => {
  return <Dashboard isDark={isDark} />;
};

export default HomePage;