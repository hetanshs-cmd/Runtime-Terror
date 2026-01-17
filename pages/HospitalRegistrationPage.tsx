import React from 'react';
import HospitalRegistration from '../components/HospitalRegistration';

interface HospitalRegistrationPageProps {
	isDark: boolean;
	user?: any;
}

const HospitalRegistrationPage: React.FC<HospitalRegistrationPageProps> = ({ isDark, user }) => {
	// Only show for healthcare admin, super admin, and general admin roles
	const allowedRoles = ['healthcare_admin', 'admin', 'super_admin'];
	if (!user || !allowedRoles.includes(user.role)) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-center">
					<h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Access Denied</h2>
					<p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
						You don't have permission to access this page. Only Healthcare Administrators, System Administrators, and Super Administrators can register hospitals.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<HospitalRegistration isDark={isDark} />
		</div>
	);
};

export default HospitalRegistrationPage;