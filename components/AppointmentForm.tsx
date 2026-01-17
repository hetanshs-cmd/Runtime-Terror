import React, { useState, useEffect } from 'react';
import { Calendar, User, Phone, Mail, MapPin, Building } from 'lucide-react';

interface Hospital {
	id: string;
	name: string;
	city: string;
	state: string;
	type: string;
}

interface AppointmentFormProps {
	isDark?: boolean;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ isDark = true }) => {
	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		email: '',
		address: '',
		hospitalId: '',
		date: '',
		time: '',
		department: ''
	});

	const [hospitals, setHospitals] = useState<Hospital[]>([]);
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

	useEffect(() => {
		fetchHospitals();
	}, []);

	const fetchHospitals = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/healthcare/hospitals', {
				credentials: 'include'
			});
			if (response.ok) {
				const data = await response.json();
				setHospitals(data.hospitals || data);
			} else {
				setMessage({ type: 'error', text: 'Failed to load hospitals' });
			}
		} catch (error) {
			setMessage({ type: 'error', text: 'Error loading hospitals' });
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setMessage(null);

		try {
			const response = await fetch('/api/appointments', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({
					patientName: formData.name,
					patientPhone: formData.phone,
					patientEmail: formData.email,
					hospitalId: formData.hospitalId,
					appointmentDate: formData.date,
					appointmentTime: formData.time,
					department: formData.department
				})
			});

			if (response.ok) {
				setMessage({ type: 'success', text: 'Appointment booked successfully!' });
				// Reset form
				setFormData({
					name: '',
					phone: '',
					email: '',
					address: '',
					hospitalId: '',
					date: '',
					time: '',
					department: ''
				});
			} else {
				const errorData = await response.json();
				setMessage({ type: 'error', text: errorData.message || 'Failed to book appointment' });
			}
		} catch (error) {
			setMessage({ type: 'error', text: 'Error booking appointment' });
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-3 max-w-md mx-auto`}>
			<h3 className={`text-sm font-bold uppercase mb-3 flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
				<Calendar className="w-4 h-4 text-blue-500" />
				Book Appointment
			</h3>

			{message && (
				<div className={`mb-3 p-2 rounded text-sm ${message.type === 'success'
					? 'bg-green-100 text-green-800 border border-green-200'
					: 'bg-red-100 text-red-800 border border-red-200'
					}`}>
					{message.text}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-3">
				<div>
					<label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
						<User className="w-4 h-4 inline mr-1" />
						Full Name
					</label>
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleChange}
						className={`w-full px-3 py-2 border rounded text-sm ${isDark
							? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
							: 'bg-white border-gray-300 text-black placeholder-gray-500'
							}`}
						placeholder="Enter your full name"
						required
					/>
				</div>

				<div>
					<label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
						<Phone className="w-4 h-4 inline mr-1" />
						Phone Number
					</label>
					<input
						type="tel"
						name="phone"
						value={formData.phone}
						onChange={handleChange}
						className={`w-full px-3 py-2 border rounded text-sm ${isDark
							? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
							: 'bg-white border-gray-300 text-black placeholder-gray-500'
							}`}
						placeholder="Enter phone number"
						required
					/>
				</div>

				<div>
					<label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
						<Mail className="w-4 h-4 inline mr-1" />
						Email (Optional)
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
						placeholder="Enter email address"
					/>
				</div>

				<div>
					<label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
						<MapPin className="w-4 h-4 inline mr-1" />
						Address
					</label>
					<input
						type="text"
						name="address"
						value={formData.address}
						onChange={handleChange}
						className={`w-full px-3 py-2 border rounded text-sm ${isDark
							? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
							: 'bg-white border-gray-300 text-black placeholder-gray-500'
							}`}
						placeholder="Enter your address"
						required
					/>
				</div>

				<div>
					<label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
						<Building className="w-4 h-4 inline mr-1" />
						Hospital
					</label>
					<select
						name="hospitalId"
						value={formData.hospitalId}
						onChange={handleChange}
						className={`w-full px-3 py-2 border rounded text-sm ${isDark
							? 'bg-gray-700 border-gray-600 text-white'
							: 'bg-white border-gray-300 text-black'
							}`}
						required
						disabled={loading}
					>
						<option value="">
							{loading ? 'Loading hospitals...' : 'Select hospital'}
						</option>
						{hospitals.map((hospital) => (
							<option key={hospital.id} value={hospital.id}>
								{hospital.name} - {hospital.city}, {hospital.state} ({hospital.type})
							</option>
						))}
					</select>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<div>
						<label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
							Date
						</label>
						<input
							type="date"
							name="date"
							value={formData.date}
							onChange={handleChange}
							className={`w-full px-3 py-2 border rounded text-sm ${isDark
								? 'bg-gray-700 border-gray-600 text-white'
								: 'bg-white border-gray-300 text-black'
								}`}
							required
						/>
					</div>

					<div>
						<label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
							Time
						</label>
						<select
							name="time"
							value={formData.time}
							onChange={handleChange}
							className={`w-full px-3 py-2 border rounded text-sm ${isDark
								? 'bg-gray-700 border-gray-600 text-white'
								: 'bg-white border-gray-300 text-black'
								}`}
							required
						>
							<option value="">Select time</option>
							<option value="09:00">9:00 AM</option>
							<option value="10:00">10:00 AM</option>
							<option value="11:00">11:00 AM</option>
							<option value="14:00">2:00 PM</option>
							<option value="15:00">3:00 PM</option>
							<option value="16:00">4:00 PM</option>
						</select>
					</div>
				</div>

				<div>
					<label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
						Department
					</label>
					<select
						name="department"
						value={formData.department}
						onChange={handleChange}
						className={`w-full px-3 py-2 border rounded text-sm ${isDark
							? 'bg-gray-700 border-gray-600 text-white'
							: 'bg-white border-gray-300 text-black'
							}`}
						required
					>
						<option value="">Select department</option>
						<option value="general">General Medicine</option>
						<option value="cardiology">Cardiology</option>
						<option value="orthopedics">Orthopedics</option>
						<option value="pediatrics">Pediatrics</option>
						<option value="emergency">Emergency</option>
					</select>
				</div>

				<button
					type="submit"
					disabled={submitting}
					className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded transition-colors text-sm"
				>
					{submitting ? 'Booking...' : 'Book Appointment'}
				</button>
			</form>
		</div>
	);
};

export default AppointmentForm;
