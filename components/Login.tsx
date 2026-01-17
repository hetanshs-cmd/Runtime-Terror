import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, Sun, Moon, UserPlus, Mail, Loader2 } from 'lucide-react';

interface LoginProps {
	onLogin: (user: any) => void;
	isDark?: boolean;
	onThemeChange?: (dark: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, isDark = true, onThemeChange }) => {
	const [isLoginMode, setIsLoginMode] = useState(true);
	const [formData, setFormData] = useState({
		username: '',
		password: '',
		confirmPassword: '',
		fullName: '',
		email: ''
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const API_BASE_URL = '/api';

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleThemeToggle = () => {
		if (onThemeChange) {
			onThemeChange(!isDark);
		}
	};

	const validateForm = () => {
		if (!formData.username.trim() || !formData.password.trim()) {
			setError('Please fill in all required fields');
			return false;
		}

		if (!isLoginMode) {
			// Registration validation
			if (!formData.fullName.trim() || !formData.email.trim()) {
				setError('Please fill in all required fields');
				return false;
			}

			if (formData.password !== formData.confirmPassword) {
				setError('Passwords do not match');
				return false;
			}

			if (formData.password.length < 6) {
				setError('Password must be at least 6 characters long');
				return false;
			}

			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(formData.email)) {
				setError('Please enter a valid email address');
				return false;
			}
		}

		return true;
	};

	const handleLogin = async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include', // Important for cookies
				body: JSON.stringify({
					username: formData.username,
					password: formData.password
				})
			});

			const data = await response.json();

			if (response.ok) {
				// Store user data and call onLogin
				localStorage.setItem('user', JSON.stringify(data.user));
				onLogin(data.user);
			} else {
				setError(data.error || 'Login failed');
			}
		} catch (error) {
			console.error('Login error:', error);
			setError('Network error. Please try again.');
		}
	};

	const handleRegister = async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username: formData.username,
					password: formData.password,
					fullName: formData.fullName,
					email: formData.email
				})
			});

			const data = await response.json();

			if (response.ok) {
				// Switch to login mode after successful registration
				setIsLoginMode(true);
				setFormData({
					username: formData.username, // Keep username for login
					password: '',
					confirmPassword: '',
					fullName: '',
					email: ''
				});
				setError('Registration successful! Please log in.');
			} else {
				setError(data.error || 'Registration failed');
			}
		} catch (error) {
			console.error('Registration error:', error);
			setError('Network error. Please try again.');
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);

		if (!validateForm()) {
			setIsLoading(false);
			return;
		}

		try {
			if (isLoginMode) {
				await handleLogin();
			} else {
				await handleRegister();
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
			<div className={`w-full max-w-md ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border rounded-lg shadow-lg p-8 relative`}>
				{/* Theme Toggle Button */}
				<button
					onClick={handleThemeToggle}
					className={`absolute top-4 right-4 p-2 rounded ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
					title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
				>
					{isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
				</button>

				<div className="text-center mb-8">
					<div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
						<Lock className={`w-8 h-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
					</div>
					<h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>GovConnect</h1>
					<p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Government Infrastructure Dashboard</p>

					{/* Mode Toggle */}
					<div className="flex justify-center mt-6 space-x-1">
						<button
							type="button"
							onClick={() => {
								setIsLoginMode(true);
								setError('');
							}}
							className={`px-4 py-2 rounded-l-lg font-medium transition-colors ${isLoginMode
								? 'bg-blue-600 text-white'
								: `${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
								}`}
						>
							Login
						</button>
						<button
							type="button"
							onClick={() => {
								setIsLoginMode(false);
								setError('');
							}}
							className={`px-4 py-2 rounded-r-lg font-medium transition-colors flex items-center gap-2 ${!isLoginMode
								? 'bg-blue-600 text-white'
								: `${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
								}`}
						>
							<UserPlus className="w-4 h-4" />
							Register
						</button>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					{error && (
						<div className="bg-red-500/10 border border-red-500/20 rounded p-3">
							<p className="text-red-500 text-sm text-center">{error}</p>
						</div>
					)}

					{!isLoginMode && (
						<div>
							<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
								<User className="w-4 h-4 inline mr-1" />
								Full Name
							</label>
							<input
								type="text"
								name="fullName"
								value={formData.fullName}
								onChange={handleInputChange}
								className={`w-full px-3 py-2 border rounded ${isDark
									? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
									: 'bg-white border-gray-300 text-black placeholder-gray-500'
									}`}
								placeholder="Enter your full name"
								required={!isLoginMode}
							/>
						</div>
					)}

					<div>
						<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
							<User className="w-4 h-4 inline mr-1" />
							Username
						</label>
						<input
							type="text"
							name="username"
							value={formData.username}
							onChange={handleInputChange}
							className={`w-full px-3 py-2 border rounded ${isDark
								? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
								: 'bg-white border-gray-300 text-black placeholder-gray-500'
								}`}
							placeholder="Enter username"
							required
						/>
					</div>

					{!isLoginMode && (
						<div>
							<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
								<Mail className="w-4 h-4 inline mr-1" />
								Email
							</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleInputChange}
								className={`w-full px-3 py-2 border rounded ${isDark
									? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
									: 'bg-white border-gray-300 text-black placeholder-gray-500'
									}`}
								placeholder="Enter email address"
								required={!isLoginMode}
							/>
						</div>
					)}

					<div>
						<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
							<Lock className="w-4 h-4 inline mr-1" />
							Password
						</label>
						<div className="relative">
							<input
								type={showPassword ? 'text' : 'password'}
								name="password"
								value={formData.password}
								onChange={handleInputChange}
								className={`w-full px-3 py-2 pr-10 border rounded ${isDark
									? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
									: 'bg-white border-gray-300 text-black placeholder-gray-500'
									}`}
								placeholder="Enter password"
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
									}`}
							>
								{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
							</button>
						</div>
					</div>

					{!isLoginMode && (
						<div>
							<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
								<Lock className="w-4 h-4 inline mr-1" />
								Confirm Password
							</label>
							<div className="relative">
								<input
									type={showConfirmPassword ? 'text' : 'password'}
									name="confirmPassword"
									value={formData.confirmPassword}
									onChange={handleInputChange}
									className={`w-full px-3 py-2 pr-10 border rounded ${isDark
										? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
										: 'bg-white border-gray-300 text-black placeholder-gray-500'
										}`}
									placeholder="Confirm password"
									required={!isLoginMode}
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
										}`}
								>
									{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
								</button>
							</div>
						</div>
					)}

					<button
						type="submit"
						disabled={isLoading}
						className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
					>
						{isLoading ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" />
								{isLoginMode ? 'Signing In...' : 'Creating Account...'}
							</>
						) : (
							isLoginMode ? 'Sign In' : 'Create Account'
						)}
					</button>
				</form>

				<div className="mt-6 text-center">
					<p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
						Create an account or use existing credentials to access the dashboard
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;