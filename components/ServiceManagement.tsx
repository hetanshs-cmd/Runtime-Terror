import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Settings, Save, X, Eye, EyeOff } from 'lucide-react';

interface Service {
	id: string;
	name: string;
	displayName: string;
	description: string;
	icon: string;
	enabled: boolean;
	order: number;
	createdAt: string;
	updatedAt: string;
}

interface ServiceManagementProps {
	isDark: boolean;
	user: any;
}

const ServiceManagement: React.FC<ServiceManagementProps> = ({ isDark, user }) => {
	const [services, setServices] = useState<Service[]>([]);
	const [loading, setLoading] = useState(true);
	const [showAddForm, setShowAddForm] = useState(false);
	const [editingService, setEditingService] = useState<Service | null>(null);
	const [formData, setFormData] = useState({
		name: '',
		displayName: '',
		description: '',
		icon: '',
		enabled: true,
		order: 0
	});

	const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

	useEffect(() => {
		fetchServices();
	}, []);

	const fetchServices = async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/api/admin/services`, {
				credentials: 'include'
			});
			if (response.ok) {
				const data = await response.json();
				setServices(data.services || []);
			}
		} catch (error) {
			console.error('Failed to fetch services:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const url = editingService
				? `${API_BASE_URL}/api/admin/services/${editingService.id}`
				: `${API_BASE_URL}/api/admin/services`;

			const method = editingService ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				await fetchServices();
				resetForm();
				// Trigger backend restart
				await restartBackend();
			}
		} catch (error) {
			console.error('Failed to save service:', error);
		}
	};

	const handleDelete = async (serviceId: string) => {
		if (!confirm('Are you sure you want to delete this service? This will remove the service tab/section.')) {
			return;
		}

		try {
			const response = await fetch(`${API_BASE_URL}/api/admin/services/${serviceId}`, {
				method: 'DELETE',
				credentials: 'include'
			});

			if (response.ok) {
				await fetchServices();
				await restartBackend();
			}
		} catch (error) {
			console.error('Failed to delete service:', error);
		}
	};

	const toggleService = async (serviceId: string, enabled: boolean) => {
		try {
			const response = await fetch(`${API_BASE_URL}/api/admin/services/${serviceId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ enabled })
			});

			if (response.ok) {
				await fetchServices();
				await restartBackend();
			}
		} catch (error) {
			console.error('Failed to toggle service:', error);
		}
	};

	const restartBackend = async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/api/admin/restart`, {
				method: 'POST',
				credentials: 'include'
			});

			if (response.ok) {
				console.log('Backend restart triggered');
				// Show a brief notification
				showRestartNotification();
			}
		} catch (error) {
			console.error('Failed to restart backend:', error);
		}
	};

	const showRestartNotification = () => {
		// Create a temporary notification
		const notification = document.createElement('div');
		notification.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg ${isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
			}`;
		notification.textContent = 'Backend restarting... Services will be updated shortly.';
		document.body.appendChild(notification);

		setTimeout(() => {
			document.body.removeChild(notification);
		}, 3000);
	};

	const resetForm = () => {
		setFormData({
			name: '',
			displayName: '',
			description: '',
			icon: '',
			enabled: true,
			order: 0
		});
		setShowAddForm(false);
		setEditingService(null);
	};

	const startEdit = (service: Service) => {
		setFormData({
			name: service.name,
			displayName: service.displayName,
			description: service.description,
			icon: service.icon,
			enabled: service.enabled,
			order: service.order
		});
		setEditingService(service);
		setShowAddForm(true);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
				<span className={`ml-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading services...</span>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
						<Settings className="w-6 h-6 text-blue-500" />
						Service Management
					</h2>
					<p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
						Create and manage dynamic service tabs and sections
					</p>
				</div>
				<button
					onClick={() => setShowAddForm(true)}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
				>
					<Plus className="w-4 h-4" />
					Add Service
				</button>
			</div>

			{/* Add/Edit Form */}
			{showAddForm && (
				<div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border rounded p-6`}>
					<div className="flex items-center justify-between mb-4">
						<h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
							{editingService ? 'Edit Service' : 'Add New Service'}
						</h3>
						<button
							onClick={resetForm}
							className={`p-1 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
						>
							<X className="w-5 h-5" />
						</button>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
									Service Name *
								</label>
								<input
									type="text"
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									className={`w-full px-3 py-2 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
										}`}
									placeholder="e.g., transportation, education"
									required
								/>
								<p className="text-xs text-gray-500 mt-1">Internal name (lowercase, no spaces)</p>
							</div>

							<div>
								<label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
									Display Name *
								</label>
								<input
									type="text"
									value={formData.displayName}
									onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
									className={`w-full px-3 py-2 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
										}`}
									placeholder="e.g., Transportation Services"
									required
								/>
								<p className="text-xs text-gray-500 mt-1">Name shown to users</p>
							</div>

							<div>
								<label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
									Icon Name
								</label>
								<input
									type="text"
									value={formData.icon}
									onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
									className={`w-full px-3 py-2 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
										}`}
									placeholder="e.g., Car, Book, Users"
								/>
								<p className="text-xs text-gray-500 mt-1">Lucide icon name</p>
							</div>

							<div>
								<label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
									Display Order
								</label>
								<input
									type="number"
									value={formData.order}
									onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
									className={`w-full px-3 py-2 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
										}`}
									min="0"
								/>
								<p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
							</div>
						</div>

						<div>
							<label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
								Description
							</label>
							<textarea
								value={formData.description}
								onChange={(e) => setFormData({ ...formData, description: e.target.value })}
								className={`w-full px-3 py-2 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
									}`}
								rows={3}
								placeholder="Describe what this service provides..."
							/>
						</div>

						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="enabled"
								checked={formData.enabled}
								onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
								className="rounded"
							/>
							<label htmlFor="enabled" className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
								Enable this service
							</label>
						</div>

						<div className="flex gap-2 pt-4">
							<button
								type="submit"
								className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center gap-2"
							>
								<Save className="w-4 h-4" />
								{editingService ? 'Update Service' : 'Create Service'}
							</button>
							<button
								type="button"
								onClick={resetForm}
								className={`px-4 py-2 border rounded transition-colors ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
									}`}
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Services List */}
			<div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border rounded`}>
				<div className="p-4 border-b border-gray-200 dark:border-gray-700">
					<h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
						Active Services ({services.filter(s => s.enabled).length})
					</h3>
				</div>

				<div className="divide-y divide-gray-200 dark:divide-gray-700">
					{services.length === 0 ? (
						<div className="p-8 text-center">
							<p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
								No services configured yet. Click "Add Service" to create your first service.
							</p>
						</div>
					) : (
						services
							.sort((a, b) => a.order - b.order)
							.map((service) => (
								<div key={service.id} className="p-4 flex items-center justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-3">
											<div className={`w-10 h-10 rounded flex items-center justify-center ${service.enabled
													? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
													: 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
												}`}>
												<Settings className="w-5 h-5" />
											</div>
											<div>
												<h4 className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
													{service.displayName}
												</h4>
												<p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
													{service.name} • Order: {service.order}
												</p>
												{service.description && (
													<p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
														{service.description}
													</p>
												)}
											</div>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<button
											onClick={() => toggleService(service.id, !service.enabled)}
											className={`p-2 rounded transition-colors ${service.enabled
													? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900'
													: 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
												}`}
											title={service.enabled ? 'Disable service' : 'Enable service'}
										>
											{service.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
										</button>

										<button
											onClick={() => startEdit(service)}
											className={`p-2 rounded transition-colors ${isDark ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-gray-100'
												}`}
											title="Edit service"
										>
											<Edit className="w-4 h-4" />
										</button>

										<button
											onClick={() => handleDelete(service.id)}
											className={`p-2 rounded transition-colors ${isDark ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'
												}`}
											title="Delete service"
										>
											<Trash2 className="w-4 h-4" />
										</button>
									</div>
								</div>
							))
					)}
				</div>
			</div>
		</div>
	);
};

export default ServiceManagement;