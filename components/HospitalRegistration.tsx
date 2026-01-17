import React, { useState } from 'react';
import { Building2, MapPin, Phone, Mail, Globe, Clock, Users, Stethoscope, Save, X, AlertCircle, CheckCircle } from 'lucide-react';

interface HospitalRegistrationProps {
	isDark?: boolean;
	onClose?: () => void;
	onSuccess?: () => void;
}

const HospitalRegistration: React.FC<HospitalRegistrationProps> = ({
	isDark = true,
	onClose,
	onSuccess
}) => {
	const [formData, setFormData] = useState({
		hospitalId: '',
		name: '',
		type: 'government',
		city: '',
		state: '',
		address: '',
		pincode: '',
		phone: '',
		email: '',
		website: '',
		emergencyContact: '',
		totalBeds: '',
		icuBeds: '',
		emergencyBeds: '',
		specialties: [] as string[],
		facilities: [] as string[],
		directorName: '',
		directorPhone: '',
		directorEmail: '',
		establishedYear: '',
		accreditation: '',
		description: ''
	});

	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

	const specialties = [
		'Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics',
		'Gynecology', 'Dermatology', 'Ophthalmology', 'ENT', 'Dentistry',
		'Psychiatry', 'Radiology', 'Pathology', 'Emergency Medicine'
	];

	const facilities = [
		'24/7 Emergency', 'ICU', 'Operation Theater', 'Pharmacy', 'Laboratory',
		'Radiology', 'Blood Bank', 'Ambulance Service', 'Cafeteria', 'Parking',
		'WiFi', 'ATM', 'Pharmacy 24/7', 'Medical Store'
	];

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleMultiSelect = (field: 'specialties' | 'facilities', value: string) => {
		setFormData(prev => ({
			...prev,
			[field]: prev[field].includes(value)
				? prev[field].filter(item => item !== value)
				: [...prev[field], value]
		}));
	};

	const generateHospitalId = () => {
		const prefix = formData.type === 'government' ? 'GOV' : 'PVT';
		const cityCode = formData.city.substring(0, 3).toUpperCase();
		const randomNum = Math.floor(100 + Math.random() * 900);
		return `${prefix}-${cityCode}-${randomNum}`;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		try {
			// Generate hospital ID if not provided
			const hospitalId = formData.hospitalId || generateHospitalId();

			const submitData = {
				hospitalId,
				name: formData.name,
				type: formData.type,
				city: formData.city,
				state: formData.state,
				address: formData.address,
				pincode: formData.pincode,
				phone: formData.phone,
				email: formData.email,
				website: formData.website,
				emergencyContact: formData.emergencyContact,
				totalBeds: parseInt(formData.totalBeds) || 0,
				icuBeds: parseInt(formData.icuBeds) || 0,
				emergencyBeds: parseInt(formData.emergencyBeds) || 0,
				specialties: formData.specialties,
				facilities: formData.facilities,
				directorName: formData.directorName,
				directorPhone: formData.directorPhone,
				directorEmail: formData.directorEmail,
				establishedYear: formData.establishedYear,
				accreditation: formData.accreditation,
				description: formData.description
			};

			const response = await fetch('/api/healthcare/hospitals', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(submitData)
			});

			if (response.ok) {
				const data = await response.json();
				setMessage({ type: 'success', text: 'Hospital registered successfully!' });

				// Reset form
				setFormData({
					hospitalId: '',
					name: '',
					type: 'government',
					city: '',
					state: '',
					address: '',
					pincode: '',
					phone: '',
					email: '',
					website: '',
					emergencyContact: '',
					totalBeds: '',
					icuBeds: '',
					emergencyBeds: '',
					specialties: [],
					facilities: [],
					directorName: '',
					directorPhone: '',
					directorEmail: '',
					establishedYear: '',
					accreditation: '',
					description: ''
				});

				// Call success callback if provided
				if (onSuccess) {
					setTimeout(() => onSuccess(), 2000);
				}
			} else {
				const errorData = await response.json();
				setMessage({ type: 'error', text: errorData.error || 'Failed to register hospital' });
			}
		} catch (error) {
			setMessage({ type: 'error', text: 'Error registering hospital' });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={`max-w-4xl mx-auto ${isDark ? 'text-white' : 'text-black'}`}>
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-3">
					<Building2 className="w-8 h-8 text-blue-500" />
					<div>
						<h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
							Hospital Registration
						</h1>
						<p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
							Register a new healthcare facility in the GovConnect network
						</p>
					</div>
				</div>
				{onClose && (
					<button
						onClick={onClose}
						className={`p-2 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
					>
						<X className="w-5 h-5" />
					</button>
				)}
			</div>

			{message && (
				<div className={`mb-6 p-4 rounded flex items-center gap-3 ${message.type === 'success'
					? 'bg-green-100 text-green-800 border border-green-200'
					: 'bg-red-100 text-red-800 border border-red-200'
					}`}>
					{message.type === 'success' ? (
						<CheckCircle className="w-5 h-5" />
					) : (
						<AlertCircle className="w-5 h-5" />
					)}
					{message.text}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-8">
				{/* Basic Information */}
				<div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-6`}>
					<h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
						<Building2 className="w-5 h-5 text-blue-500" />
						Basic Information
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<div>
							<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
								Hospital ID <span className="text-red-500">*</span>
							</label>
							<div className="flex gap-2">
								<input
									type="text"
									name="hospitalId"
									value={formData.hospitalId}
									onChange={handleChange}
									placeholder="Auto-generated"
									className={`flex-1 px-3 py-2 border rounded text-sm ${isDark
										? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
										: 'bg-white border-gray-300 text-black placeholder-gray-500'
										}`}
								/>
								<button
									type="button"
									onClick={() => setFormData(prev => ({ ...prev, hospitalId: generateHospitalId() }))}
									className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
								>
									Generate
								</button>
							</div>
						</div>

						<div className="md:col-span-2">
							<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
								Hospital Name <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleChange}
								placeholder="Enter hospital name"
								className={`w-full px-3 py-2 border rounded text-sm ${isDark
									? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
									: 'bg-white border-gray-300 text-black placeholder-gray-500'
									}`}
								required
							/>
						</div>

						<div>
							<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
								Type <span className="text-red-500">*</span>
							</label>
							<select
								name="type"
								value={formData.type}
								onChange={handleChange}
								className={`w-full px-3 py-2 border rounded text-sm ${isDark
									? 'bg-gray-700 border-gray-600 text-white'
									: 'bg-white border-gray-300 text-black'
									}`}
								required
							>
								<option value="government">Government</option>
								<option value="private">Private</option>
							</select>
						</div>

						<div>
							<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
								City <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								name="city"
								value={formData.city}
								onChange={handleChange}
								placeholder="Enter city"
								className={`w-full px-3 py-2 border rounded text-sm ${isDark
									? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
									: 'bg-white border-gray-300 text-black placeholder-gray-500'
									}`}
								required
							/>
						</div>

						<div>
							<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
								State <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								name="state"
								value={formData.state}
								onChange={handleChange}
								placeholder="Enter state"
								className={`w-full px-3 py-2 border rounded text-sm ${isDark
									? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
									: 'bg-white border-gray-300 text-black placeholder-gray-500'
									}`}
								required
							/>
						</div>
					</div>

					<div className="mt-4">
						<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
							Full Address
						</label>
						<textarea
							name="address"
							value={formData.address}
							onChange={handleChange}
							placeholder="Enter complete address"
							rows={3}
							className={`w-full px-3 py-2 border rounded text-sm ${isDark
								? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
								: 'bg-white border-gray-300 text-black placeholder-gray-500'
								}`}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
						<div>
							<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
								Pincode
							</label>
							<input
								type="text"
								name="pincode"
								value={formData.pincode}
								onChange={handleChange}
								placeholder="Enter pincode"
								className={`w-full px-3 py-2 border rounded text-sm ${isDark
									? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
									: 'bg-white border-gray-300 text-black placeholder-gray-500'
									}`}
							/>
						</div>

						<div>
							<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
								Established Year
							</label>
							<input
								type="number"
								name="establishedYear"
								value={formData.establishedYear}
								onChange={handleChange}
								placeholder="e.g., 1995"
								min="1800"
								max={new Date().getFullYear()}
								className={`w-full px-3 py-2 border rounded text-sm ${isDark
									? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
									: 'bg-white border-gray-300 text-black placeholder-gray-500'
									}`}
							/>
						</div>
					</div>
				</div>

				{/* Contact Information */}
				<div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-6`}>
					<h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
						<Phone className="w-5 h-5 text-green-500" />
						Contact Information
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
								<Phone className="w-4 h-4 inline mr-1" />
								Phone Number
							</label>
							<input
								type="tel"
								name="phone"
								value={formData.phone}
								onChange={handleChange}
								placeholder="Enter phone number"
								className={`w-full px-3 py-2 border rounded text-sm ${isDark
									? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
									: 'bg-white border-gray-300 text-black placeholder-gray-500'
									}`}
							/>
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
								placeholder="Enter email address"
								className={`w-full px-3 py-2 border rounded text-sm ${isDark
									? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
									: 'bg-white border-gray-300 text-black placeholder-gray-500'
									}`}
							/>
						</div>

						<div>
							<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
								<Globe className="w-4 h-4 inline mr-1" />
								Website
							</label>
							<input
								type="url"
								name="website"
								value={formData.website}
								onChange={handleChange}
								placeholder="https://example.com"
								className={`w-full px-3 py-2 border rounded text-sm ${isDark
									? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
									: 'bg-white border-gray-300 text-black placeholder-gray-500'
									}`}
							/>
						</div>

						<div>
							<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
								<Clock className="w-4 h-4 inline mr-1" />
								Emergency Contact
							</label>
							<input
								type="tel"
								name="emergencyContact"
								value={formData.emergencyContact}
								onChange={handleChange}
								placeholder="24/7 emergency number"
								className={`w-full px-3 py-2 border rounded text-sm ${isDark
									? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
									: 'bg-white border-gray-300 text-black placeholder-gray-500'
									}`}
							/>
						</div>
					</div>
				</div>

				{/* Capacity & Resources */}
				<div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-6`}>
					<h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
						<Users className="w-5 h-5 text-purple-500" />
						Capacity & Resources
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
								Total Beds
							</label>
							<input
								type="number"
								name="totalBeds"
								value={formData.totalBeds}
								onChange={handleChange}
								placeholder="Total bed capacity"
								min="1"
								className={`w-full px-3 py-2 border rounded text-sm ${isDark
									? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
									: 'bg-white border-gray-300 text-black placeholder-gray-500'
									}`}
							/>
						</div>

						<div>
							<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
								ICU Beds
							</label>
							<input
								type="number"
								name="icuBeds"
								value={formData.icuBeds}
								onChange={handleChange}
								placeholder="ICU bed capacity"
								min="1"
								className={`w-full px-3 py-2 border rounded text-sm ${isDark
									? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
									: 'bg-white border-gray-300 text-black placeholder-gray-500'
									}`}
							/>
						</div>

						<div>
							<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
								Emergency Beds
							</label>
							<input
								type="number"
								name="emergencyBeds"
								value={formData.emergencyBeds}
								onChange={handleChange}
								placeholder="Emergency bed capacity"
								min="1"
								className={`w-full px-3 py-2 border rounded text-sm ${isDark
									? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
									: 'bg-white border-gray-300 text-black placeholder-gray-500'
									}`}
							/>
						</div>
					</div>
				</div>

				{/* Specialties */}
				<div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-6`}>
					<h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
						<Stethoscope className="w-5 h-5 text-red-500" />
						Medical Specialties
					</h2>

					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
						{specialties.map(specialty => (
							<label key={specialty} className="flex items-center space-x-2 cursor-pointer">
								<input
									type="checkbox"
									checked={formData.specialties.includes(specialty)}
									onChange={() => handleMultiSelect('specialties', specialty)}
									className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
									{specialty}
								</span>
							</label>
						))}
					</div>
				</div>

				{/* Facilities */}
				<div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-6`}>
					<h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
						<Building2 className="w-5 h-5 text-indigo-500" />
						Available Facilities
					</h2>

					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
						{facilities.map(facility => (
							<label key={facility} className="flex items-center space-x-2 cursor-pointer">
								<input
									type="checkbox"
									checked={formData.facilities.includes(facility)}
									onChange={() => handleMultiSelect('facilities', facility)}
									className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
									{facility}
								</span>
							</label>
						))}
					</div>
				</div>

				{/* Director Information */}
				<div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-6`}>
					<h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
						<Users className="w-5 h-5 text-orange-500" />
						Director Information
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
								Director Name
							</label>
							<input
								type="text"
								name="directorName"
								value={formData.directorName}
								onChange={handleChange}
								placeholder="Hospital director name"
								className={`w-full px-3 py-2 border rounded text-sm ${isDark
									? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
									: 'bg-white border-gray-300 text-black placeholder-gray-500'
									}`}
							/>
						</div>

						<div>
							<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
								Director Phone
							</label>
							<input
								type="tel"
								name="directorPhone"
								value={formData.directorPhone}
								onChange={handleChange}
								placeholder="Director contact number"
								className={`w-full px-3 py-2 border rounded text-sm ${isDark
									? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
									: 'bg-white border-gray-300 text-black placeholder-gray-500'
									}`}
							/>
						</div>

						<div className="md:col-span-2">
							<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
								Director Email
							</label>
							<input
								type="email"
								name="directorEmail"
								value={formData.directorEmail}
								onChange={handleChange}
								placeholder="Director email address"
								className={`w-full px-3 py-2 border rounded text-sm ${isDark
									? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
									: 'bg-white border-gray-300 text-black placeholder-gray-500'
									}`}
							/>
						</div>
					</div>
				</div>

				{/* Additional Information */}
				<div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-6`}>
					<h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
						<Building2 className="w-5 h-5 text-teal-500" />
						Additional Information
					</h2>

					<div className="space-y-4">
						<div>
							<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
								Accreditation
							</label>
							<input
								type="text"
								name="accreditation"
								value={formData.accreditation}
								onChange={handleChange}
								placeholder="e.g., NABH, JCI, ISO certified"
								className={`w-full px-3 py-2 border rounded text-sm ${isDark
									? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
									: 'bg-white border-gray-300 text-black placeholder-gray-500'
									}`}
							/>
						</div>

						<div>
							<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
								Description
							</label>
							<textarea
								name="description"
								value={formData.description}
								onChange={handleChange}
								placeholder="Brief description about the hospital"
								rows={4}
								className={`w-full px-3 py-2 border rounded text-sm ${isDark
									? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
									: 'bg-white border-gray-300 text-black placeholder-gray-500'
									}`}
							/>
						</div>
					</div>
				</div>

				{/* Submit Button */}
				<div className="flex justify-end gap-4">
					{onClose && (
						<button
							type="button"
							onClick={onClose}
							className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm font-semibold"
						>
							Cancel
						</button>
					)}
					<button
						type="submit"
						disabled={loading}
						className={`px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-semibold flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''
							}`}
					>
						{loading ? (
							<>
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
								Registering...
							</>
						) : (
							<>
								<Save className="w-4 h-4" />
								Register Hospital
							</>
						)}
					</button>
				</div>
			</form>
		</div>
	);
};

export default HospitalRegistration;