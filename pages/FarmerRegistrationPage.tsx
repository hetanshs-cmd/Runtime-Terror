import React from 'react';
import AgricultureSector from '../components/AgricultureSector';

interface FarmerRegistrationPageProps {
	isDark: boolean;
	user?: any;
}

const FarmerRegistrationPage: React.FC<FarmerRegistrationPageProps> = ({ isDark, user }) => {
	// Only show for agriculture admin, admin, and super admin roles
	const allowedRoles = ['agriculture_admin', 'admin', 'super_admin'];
	if (!user || !allowedRoles.includes(user.role)) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-center">
					<h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Access Denied</h2>
					<p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
						You don't have permission to access this page. Only Agriculture Administrators, System Administrators, and Super Administrators can register farmers.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Agriculture</h1>
					<p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
						Register and manage farmers in the agriculture sector
					</p>
				</div>
			</div>
			<AgricultureSector isDark={isDark} user={user} />
		</div>
	);
};

export default FarmerRegistrationPage;