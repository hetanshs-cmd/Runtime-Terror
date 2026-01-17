import React from 'react';
import AgricultureSector from '../components/AgricultureSector';

interface AgriculturePageProps {
  isDark: boolean;
  user?: any;
}

const AgriculturePage: React.FC<AgriculturePageProps> = ({ isDark, user }) => {
  return <AgricultureSector isDark={isDark} user={user} />;
};

export default AgriculturePage;