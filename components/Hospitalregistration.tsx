import React, { useState } from "react";

type HospitalType = "Government" | "Private" | "Trust" | "Other";

interface HospitalForm {
	hospitalName: string;
	hospitalType: HospitalType | "";
	registrationNumber: string;
	location: string;
	contactNumber: string;
	contactEmail: string;
	medicalServices: string;
}

const HospitalRegistrationForm: React.FC = () => {
	const [form, setForm] = useState<HospitalForm>({
		hospitalName: "",
		hospitalType: "",
		registrationNumber: "",
		location: "",
		contactNumber: "",
		contactEmail: "",
		medicalServices: "",
	});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		console.log("Hospital Form Data:", form);

		alert("Hospital form submitted!");

		setForm({
			hospitalName: "",
			hospitalType: "",
			registrationNumber: "",
			location: "",
			contactNumber: "",
			contactEmail: "",
			medicalServices: "",
		});
	};

	return (
		<form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
			<h2>Hospital Registration</h2>

			<input
				type="text"
				name="hospitalName"
				placeholder="Hospital Name"
				value={form.hospitalName}
				onChange={handleChange}
				required
			/>

			<select
				name="hospitalType"
				value={form.hospitalType}
				onChange={handleChange}
				required
			>
				<option value="">Select Hospital Type</option>
				<option value="Government">Government</option>
				<option value="Private">Private</option>
				<option value="Trust">Trust</option>
				<option value="Other">Other</option>
			</select>

			<input
				type="text"
				name="registrationNumber"
				placeholder="Registration Number"
				value={form.registrationNumber}
				onChange={handleChange}
				required
			/>

			<input
				type="text"
				name="location"
				placeholder="Location"
				value={form.location}
				onChange={handleChange}
				required
			/>

			<input
				type="tel"
				name="contactNumber"
				placeholder="Contact Number"
				value={form.contactNumber}
				onChange={handleChange}
				required
			/>

			<input
				type="email"
				name="contactEmail"
				placeholder="Contact Email"
				value={form.contactEmail}
				onChange={handleChange}
			/>

			<textarea
				name="medicalServices"
				placeholder="Medical Services (e.g., Cardiology, ENT)"
				value={form.medicalServices}
				onChange={handleChange}
				required
			/>

			<button type="submit">Submit</button>
		</form>
	);
};

export default HospitalRegistrationForm;