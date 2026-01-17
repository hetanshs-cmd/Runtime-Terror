import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Edit, Trash2, Shield, Crown, Settings, User, HeartPulse, Sprout } from 'lucide-react';

interface UserManagementProps {
	isDark?: boolean;
	user?: any;
}

interface User {
	id: number;
	username: string;
	email: string;
	full_name: string;
	role: string;
	is_active: boolean;
	is_system_user?: boolean;
	created_at?: string;
	updated_at?: string;
}

const UserManagement: React.FC<UserManagementProps> = ({ isDark = true, user }) => {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [showAddForm, setShowAddForm] = useState(false);
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [activeTab, setActiveTab] = useState<'all' | 'regular' | 'system'>('all');
	const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

	const [newUser, setNewUser] = useState({
		username: '',
		email: '',
		full_name: '',
		password: '',
		role: 'user'
	});

	const [editUser, setEditUser] = useState({
		full_name: '',
		role: 'user',
		is_active: true,
		password: ''
	});

	useEffect(() => {
		fetchUsers();
	}, []);

	const isSystemUser = (user: User) => user.is_system_user || false;

	const fetchUsers = async () => {
		try {
			const response = await fetch('/api/admin/users', {
				credentials: 'include'
			});
			if (response.ok) {
				const data = await response.json();
				setUsers(data.users);
			} else {
				setMessage({ type: 'error', text: 'Failed to load users' });
			}
		} catch (error) {
			setMessage({ type: 'error', text: 'Error loading users' });
		} finally {
			setLoading(false);
		}
	};

	const handleAddUser = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch('/api/admin/users', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(newUser),
			});

			if (response.ok) {
				setMessage({ type: 'success', text: 'User created successfully' });
				setNewUser({ username: '', email: '', full_name: '', password: '', role: 'user' });
				setShowAddForm(false);
				fetchUsers();
			} else {
				const errorData = await response.json();
				setMessage({ type: 'error', text: errorData.message || 'Failed to create user' });
			}
		} catch (error) {
			setMessage({ type: 'error', text: 'Error creating user' });
		}
	};

	const handleEditUser = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!editingUser) return;

		try {
			const updateData: any = {
				full_name: editUser.full_name,
				role: editUser.role,
				is_active: editUser.is_active
			};

			if (editUser.password) {
				updateData.password = editUser.password;
			}

			const response = await fetch(`/api/admin/users/${editingUser.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(updateData),
			});

			if (response.ok) {
				setMessage({ type: 'success', text: 'User updated successfully' });
				setEditingUser(null);
				setEditUser({ full_name: '', role: 'user', is_active: true, password: '' });
				fetchUsers();
			} else {
				const errorData = await response.json();
				setMessage({ type: 'error', text: errorData.message || 'Failed to update user' });
			}
		} catch (error) {
			setMessage({ type: 'error', text: 'Error updating user' });
		}
	};

	const handleDeleteUser = async (userId: number, username: string) => {
		if (!confirm(`Are you sure you want to deactivate user "${username}"?`)) {
			return;
		}

		try {
			const response = await fetch(`/api/admin/users/${userId}`, {
				method: 'DELETE',
				credentials: 'include',
			});

			if (response.ok) {
				setMessage({ type: 'success', text: 'User deactivated successfully' });
				fetchUsers();
			} else {
				const errorData = await response.json();
				setMessage({ type: 'error', text: errorData.message || 'Failed to deactivate user' });
			}
		} catch (error) {
			setMessage({ type: 'error', text: 'Error deactivating user' });
		}
	};

	const startEdit = (user: User) => {
		setEditingUser(user);
		setEditUser({
			full_name: user.full_name,
			role: user.role,
			is_active: user.is_active,
			password: ''
		});
	};

	const getRoleIcon = (role: string) => {
		switch (role) {
			case 'super_admin':
				return <Crown className="w-4 h-4 text-yellow-500" />;
			case 'admin':
				return <Shield className="w-4 h-4 text-red-500" />;
			case 'healthcare_admin':
				return <Settings className="w-4 h-4 text-blue-500" />;
			case 'agriculture_admin':
				return <Settings className="w-4 h-4 text-green-500" />;
			default:
				return <User className="w-4 h-4 text-gray-500" />;
		}
	};

	const getRoleColor = (role: string) => {
		switch (role) {
			case 'super_admin':
				return 'text-yellow-600 bg-yellow-100';
			case 'admin':
				return 'text-red-600 bg-red-100';
			case 'healthcare_admin':
				return 'text-blue-600 bg-blue-100';
			case 'agriculture_admin':
				return 'text-green-600 bg-green-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
				<span className={`ml-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading users...</span>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div>
					<h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
						<Users className="text-blue-500 w-6 h-6" />
						User Management
					</h2>
					<p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage system users and their permissions</p>
				</div>
				<button
					onClick={() => setShowAddForm(!showAddForm)}
					className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-semibold"
				>
					<UserPlus className="w-4 h-4" />
					Add User
				</button>
			</div>

			{message && (
				<div className={`p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
					{message.text}
				</div>
			)}

			{/* Tab Navigation */}
			<div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
				<button
					onClick={() => setActiveTab('all')}
					className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'all'
						? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
						: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
						}`}
				>
					All Users ({users.length})
				</button>
				<button
					onClick={() => setActiveTab('regular')}
					className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'regular'
						? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
						: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
						}`}
				>
					Registered Users ({users.filter(u => !u.is_system_user).length})
				</button>
				<button
					onClick={() => setActiveTab('system')}
					className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'system'
						? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
						: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
						}`}
				>
					System Users ({users.filter(u => u.is_system_user).length})
				</button>
			</div>

			{/* Add User Form */}
			{showAddForm && (
				<div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-4`}>
					<h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Add New User</h3>
					<form onSubmit={handleAddUser} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<input
								type="text"
								placeholder="Username"
								value={newUser.username}
								onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
								className={`w-full p-2 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
								required
							/>
							<input
								type="email"
								placeholder="Email"
								value={newUser.email}
								onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
								className={`w-full p-2 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
								required
							/>
						</div>
						<input
							type="text"
							placeholder="Full Name"
							value={newUser.full_name}
							onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
							className={`w-full p-2 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
							required
						/>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<input
								type="password"
								placeholder="Password"
								value={newUser.password}
								onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
								className={`w-full p-2 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
								required
							/>
							<select
								value={newUser.role}
								onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
								className={`w-full p-2 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
							>
								<option value="user">User</option>
								<option value="healthcare_admin">Healthcare Admin</option>
								<option value="agriculture_admin">Agriculture Admin</option>
								<option value="admin">Admin</option>
							</select>
						</div>
						<div className="flex gap-2">
							<button
								type="submit"
								className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-semibold"
							>
								Create User
							</button>
							<button
								type="button"
								onClick={() => setShowAddForm(false)}
								className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-semibold"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Edit User Form */}
			{editingUser && (
				<div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-4`}>
					<h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Edit User: {editingUser.username}</h3>
					<form onSubmit={handleEditUser} className="space-y-4">
						<input
							type="text"
							placeholder="Full Name"
							value={editUser.full_name}
							onChange={(e) => setEditUser({ ...editUser, full_name: e.target.value })}
							className={`w-full p-2 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
							required
						/>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<select
								value={editUser.role}
								onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
								className={`w-full p-2 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
							>
								<option value="user">User</option>
								<option value="healthcare_admin">Healthcare Admin</option>
								<option value="agriculture_admin">Agriculture Admin</option>
								<option value="admin">Admin</option>
							</select>
							<select
								value={editUser.is_active.toString()}
								onChange={(e) => setEditUser({ ...editUser, is_active: e.target.value === 'true' })}
								className={`w-full p-2 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
							>
								<option value="true">Active</option>
								<option value="false">Inactive</option>
							</select>
						</div>
						<input
							type="password"
							placeholder="New Password (leave empty to keep current)"
							value={editUser.password}
							onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
							className={`w-full p-2 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
						/>
						<div className="flex gap-2">
							<button
								type="submit"
								className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold"
							>
								Update User
							</button>
							<button
								type="button"
								onClick={() => setEditingUser(null)}
								className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-semibold"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Users List */}
			<div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-4`}>
				<h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
					{activeTab === 'all' && `All Users (${users.length})`}
					{activeTab === 'regular' && `Registered Users (${users.filter(u => !u.is_system_user).length})`}
					{activeTab === 'system' && `System Users (${users.filter(u => u.is_system_user).length})`}
				</h3>
				<div className="space-y-3 max-h-96 overflow-y-auto">
					{users
						.filter(user => {
							if (activeTab === 'regular') return !user.is_system_user;
							if (activeTab === 'system') return user.is_system_user;
							return true; // 'all' tab
						})
						.map((user) => (
							<div key={user.id} className={`p-3 ${isDark ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-300'} border rounded flex items-center justify-between ${isSystemUser(user) ? (isDark ? 'border-yellow-500/30 bg-yellow-900/10' : 'border-yellow-300 bg-yellow-50') : ''}`}>
								<div className="flex items-center gap-3">
									{getRoleIcon(user.role)}
									<div>
										<div className="flex items-center gap-2">
											<h4 className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{user.username}</h4>
											{isSystemUser(user) && (
												<span className={`px-1.5 py-0.5 text-xs rounded ${isDark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'}`}>
													SYSTEM
												</span>
											)}
										</div>
										<p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
										<p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{user.full_name}</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="text-right">
										<span className={`px-2 py-1 rounded text-xs font-bold ${getRoleColor(user.role)}`}>
											{user.role.replace('_', ' ').toUpperCase()}
										</span>
										<div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
											{user.role === 'super_admin' && 'Full System Access'}
											{user.role === 'admin' && 'User Management'}
											{user.role === 'healthcare_admin' && 'Healthcare Data'}
											{user.role === 'agriculture_admin' && 'Agriculture Data'}
											{user.role === 'user' && 'Basic Access'}
										</div>
									</div>
									<span className={`px-2 py-1 rounded text-xs font-bold ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
										{user.is_active ? 'ACTIVE' : 'INACTIVE'}
									</span>
									<div className="flex gap-1">
										<button
											onClick={() => startEdit(user)}
											className="p-1 text-blue-600 hover:bg-blue-100 rounded"
											title="Edit User"
										>
											<Edit className="w-4 h-4" />
										</button>
										{!isSystemUser(user) && (
											<button
												onClick={() => handleDeleteUser(user.id, user.username)}
												className="p-1 text-red-600 hover:bg-red-100 rounded"
												title="Deactivate User"
											>
												<Trash2 className="w-4 h-4" />
											</button>
										)}
									</div>
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
};

export default UserManagement;