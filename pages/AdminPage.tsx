import React from 'react';
import UserManagement from '../components/UserManagement';

interface AdminPageProps {
	isDark: boolean;
	user: any;
}

const AdminPage: React.FC<AdminPageProps> = ({ isDark, user }) => {
	// Only show for admin and super_admin users
	if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-center">
					<h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Access Denied</h2>
					<p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
						You don't have permission to access this page.
					</p>
				</div>
			</div>
		);
	}

	return <UserManagement isDark={isDark} user={user} />;
};

export default AdminPage;