import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Save, AlertCircle, CheckCircle } from 'lucide-react';

interface SettingsProps {
	isDark?: boolean;
}

interface UserProfile {
	id: string;
	username: string;
	fullName: string;
	email: string;
	role: string;
}

const Settings: React.FC<SettingsProps> = ({ isDark = true }) => {
	const [user, setUser] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

	const [formData, setFormData] = useState({
		fullName: '',
		email: '',
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	});

	useEffect(() => {
		fetchUserProfile();
	}, []);

	const fetchUserProfile = async () => {
		try {
			const response = await fetch('/api/auth/me', {
				credentials: 'include'
			});
			if (response.ok) {
				const data = await response.json();
				setUser(data);
				setFormData({
					...formData,
					fullName: data.fullName || '',
					email: data.email || ''
				});
			} else {
				setMessage({ type: 'error', text: 'Failed to load profile' });
			}
		} catch (error) {
			setMessage({ type: 'error', text: 'Error loading profile' });
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		setMessage(null);

		try {
			const updateData: any = {
				full_name: formData.fullName,
				email: formData.email
			};

			// Only include password if user wants to change it
			if (formData.newPassword) {
				if (formData.newPassword !== formData.confirmPassword) {
					setMessage({ type: 'error', text: 'New passwords do not match' });
					setSaving(false);
					return;
				}
				if (formData.newPassword.length < 6) {
					setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
					setSaving(false);
					return;
				}
				updateData.password = formData.newPassword;
			}

			const response = await fetch('/api/auth/me', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(updateData)
			});

			if (response.ok) {
				const data = await response.json();
				setUser(data.user);
				setMessage({ type: 'success', text: 'Profile updated successfully!' });
				// Clear password fields
				setFormData({
					...formData,
					currentPassword: '',
					newPassword: '',
					confirmPassword: ''
				});
			} else {
				const errorData = await response.json();
				setMessage({ type: 'error', text: errorData.error || 'Failed to update profile' });
			}
		} catch (error) {
			setMessage({ type: 'error', text: 'Error updating profile' });
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div>
					<h1 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
						<User className="text-blue-500 w-7 h-7" />
						Account Settings
					</h1>
					<p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage your personal information and account preferences</p>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Profile Information */}
				<div className="lg:col-span-2 space-y-6">
					<div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-6`}>
						<h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
							<User className="w-5 h-5 text-blue-500" />
							Profile Information
						</h2>

						{message && (
							<div className={`mb-4 p-3 rounded flex items-center gap-2 ${message.type === 'success'
								? 'bg-green-100 text-green-800 border border-green-200'
								: 'bg-red-100 text-red-800 border border-red-200'
								}`}>
								{message.type === 'success' ? (
									<CheckCircle className="w-4 h-4" />
								) : (
									<AlertCircle className="w-4 h-4" />
								)}
								{message.text}
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
										Username
									</label>
									<input
										type="text"
										value={user?.username || ''}
										disabled
										className={`w-full px-3 py-2 border rounded text-sm ${isDark
											? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
											: 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
											}`}
									/>
									<p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Username cannot be changed</p>
								</div>

								<div>
									<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
										Full Name
									</label>
									<input
										type="text"
										name="fullName"
										value={formData.fullName}
										onChange={handleChange}
										className={`w-full px-3 py-2 border rounded text-sm ${isDark
											? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
											: 'bg-white border-gray-300 text-black placeholder-gray-500'
											}`}
										placeholder="Enter your full name"
										required
									/>
								</div>
							</div>

							<div>
								<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
									<Mail className="w-4 h-4 inline mr-1" />
									Email Address
								</label>
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									className={`w-full px-3 py-2 border rounded text-sm ${isDark
										? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
										: 'bg-white border-gray-300 text-black placeholder-gray-500'
										}`}
									placeholder="Enter your email address"
									required
								/>
							</div>

							<div>
								<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
									Account Role
								</label>
								<input
									type="text"
									value={user?.role || ''}
									disabled
									className={`w-full px-3 py-2 border rounded text-sm capitalize ${isDark
										? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
										: 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
										}`}
								/>
								<p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Role can only be changed by administrators</p>
							</div>

							<div className="border-t pt-4">
								<h3 className={`text-md font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
									<Lock className="w-4 h-4 text-yellow-500" />
									Change Password (Optional)
								</h3>

								<div className="space-y-3">
									<div>
										<label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
											New Password
										</label>
										<input
											type="password"
											name="newPassword"
											value={formData.newPassword}
											onChange={handleChange}
											className={`w-full px-3 py-2 border rounded text-sm ${isDark
												? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
												: 'bg-white border-gray-300 text-black placeholder-gray-500'
												}`}
											placeholder="Enter new password (leave blank to keep current)"
											minLength={6}
										/>
									</div>

									<div>
										<label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
											Confirm New Password
										</label>
										<input
											type="password"
											name="confirmPassword"
											value={formData.confirmPassword}
											onChange={handleChange}
											className={`w-full px-3 py-2 border rounded text-sm ${isDark
												? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
												: 'bg-white border-gray-300 text-black placeholder-gray-500'
												}`}
											placeholder="Confirm new password"
											minLength={6}
										/>
									</div>
								</div>
							</div>

							<div className="flex justify-end pt-4">
								<button
									type="submit"
									disabled={saving}
									className={`px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-semibold flex items-center gap-2 ${saving ? 'opacity-50 cursor-not-allowed' : ''
										}`}
								>
									{saving ? (
										<>
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
											Saving...
										</>
									) : (
										<>
											<Save className="w-4 h-4" />
											Save Changes
										</>
									)}
								</button>
							</div>
						</form>
					</div>
				</div>

				{/* Account Summary */}
				<div className="space-y-6">
					<div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-4`}>
						<h3 className={`text-sm font-bold uppercase mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
							Account Summary
						</h3>
						<div className="space-y-3">
							<div className={`p-3 border rounded ${isDark ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-300'}`}>
								<p className={`text-xs font-bold uppercase mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Account Status</p>
								<p className="text-sm text-green-500 font-semibold">Active</p>
							</div>
							<div className={`p-3 border rounded ${isDark ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-300'}`}>
								<p className={`text-xs font-bold uppercase mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Role</p>
								<p className="text-sm text-blue-500 font-semibold capitalize">{user?.role || 'N/A'}</p>
							</div>
							<div className={`p-3 border rounded ${isDark ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-300'}`}>
								<p className={`text-xs font-bold uppercase mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Member Since</p>
								<p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Recently</p>
							</div>
						</div>
					</div>

					<div className={`${isDark ? 'bg-yellow-900 border-yellow-600' : 'bg-yellow-50 border-yellow-400'} border rounded p-4`}>
						<h3 className={`text-sm font-bold uppercase mb-2 flex items-center gap-2 ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
							<AlertCircle className="w-4 h-4" />
							Security Notice
						</h3>
						<p className={`text-xs ${isDark ? 'text-yellow-300' : 'text-yellow-600'}`}>
							Your password should be at least 6 characters long and contain a mix of letters, numbers, and special characters for better security.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Settings;