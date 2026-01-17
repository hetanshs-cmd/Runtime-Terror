import React, { useState } from 'react';
import { Calendar, User, Phone, Mail, MapPin } from 'lucide-react';

interface AppointmentFormProps {
	isDark?: boolean;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ isDark = true }) => {
	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		email: '',
		address: '',
		date: '',
		time: '',
		department: ''
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Appointment submitted:', formData);
		// Reset form
		setFormData({
			name: '',
			phone: '',
			email: '',
			address: '',
			date: '',
			time: '',
			department: ''
		});
	};

	return (
		<div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-3 max-w-md mx-auto`}>
			<h3 className={`text-sm font-bold uppercase mb-3 flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
				<Calendar className="w-4 h-4 text-blue-500" />
				Book Appointment
			</h3>

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
					className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors text-sm"
				>
					Book Appointment
				</button>
			</form>
		</div>
	);
};

export default AppointmentForm;
