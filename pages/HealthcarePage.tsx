import React from 'react';
import HealthcareSector from '../components/HealthcareSector';

interface HealthcarePageProps {
  isDark: boolean;
  user?: any;
}

const HealthcarePage: React.FC<HealthcarePageProps> = ({ isDark, user }) => {
  return <HealthcareSector isDark={isDark} user={user} />;
};

export default HealthcarePage;