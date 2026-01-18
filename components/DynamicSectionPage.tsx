import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';

interface DynamicSectionPageProps {
	isDark: boolean;
	sectionData: {
		id: string;
		title: string;
		path: string;
		icon: string;
		table_name: string;
		fields: Array<{
			name: string;
			type: string;
			required: boolean;
		}>;
		description: string;
	};
}

interface Record {
	id?: number;
	[key: string]: any;
}

const DynamicSectionPage: React.FC<DynamicSectionPageProps> = ({ isDark, sectionData }) => {
	const [records, setRecords] = useState<Record[]>([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [editingRecord, setEditingRecord] = useState<Record | null>(null);
	const [formData, setFormData] = useState<Record>({});
	const [searchTerm, setSearchTerm] = useState('');
	const [filterField, setFilterField] = useState('');

	// Load records
	useEffect(() => {
		loadRecords();
	}, [sectionData.table_name]);

	const loadRecords = async () => {
		try {
			const response = await fetch(`/api/admin/dynamic/tables/${sectionData.table_name}/data`, {
				credentials: 'include'
			});
			if (response.ok) {
				const data = await response.json();
				setRecords(data.data || []);
			}
		} catch (error) {
			console.error('Error loading records:', error);
		}
		setLoading(false);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const url = editingRecord
				? `/api/admin/dynamic/tables/${sectionData.table_name}/data/${editingRecord.id}`
				: `/api/admin/dynamic/tables/${sectionData.table_name}/data`;

			const method = editingRecord ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				loadRecords();
				setShowForm(false);
				setEditingRecord(null);
				setFormData({});
			}
		} catch (error) {
			console.error('Error saving record:', error);
		}
	};

	const handleEdit = (record: Record) => {
		setEditingRecord(record);
		setFormData({ ...record });
		setShowForm(true);
	};

	const handleDelete = async (recordId: number) => {
		if (!confirm('Are you sure you want to delete this record?')) return;

		try {
			const response = await fetch(`/api/admin/dynamic/tables/${sectionData.table_name}/data/${recordId}`, {
				method: 'DELETE',
				credentials: 'include'
			});

			if (response.ok) {
				loadRecords();
			}
		} catch (error) {
			console.error('Error deleting record:', error);
		}
	};

	const handleInputChange = (fieldName: string, value: any) => {
		setFormData({ ...formData, [fieldName]: value });
	};

	const filteredRecords = records.filter(record => {
		if (!searchTerm) return true;
		if (!filterField) {
			return Object.values(record).some(value =>
				String(value).toLowerCase().includes(searchTerm.toLowerCase())
			);
		}
		return String(record[filterField]).toLowerCase().includes(searchTerm.toLowerCase());
	});

	if (loading) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
					<p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
						Loading {sectionData.title}...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-start">
				<div>
					<h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
						{sectionData.title}
					</h1>
					{sectionData.description && (
						<p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
							{sectionData.description}
						</p>
					)}
				</div>
				<button
					onClick={() => setShowForm(true)}
					className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${isDark
						? 'bg-blue-600 hover:bg-blue-700 text-white'
						: 'bg-blue-500 hover:bg-blue-600 text-white'
						}`}
				>
					<Plus className="w-4 h-4 mr-2" />
					Add Record
				</button>
			</div>

			{/* Search and Filter */}
			<div className="flex space-x-4">
				<div className="flex-1">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<input
							type="text"
							placeholder="Search records..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark
								? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
								: 'bg-white border-gray-300 text-black placeholder-gray-500'
								}`}
						/>
					</div>
				</div>
				<div className="w-48">
					<select
						value={filterField}
						onChange={(e) => setFilterField(e.target.value)}
						className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark
							? 'bg-gray-700 border-gray-600 text-white'
							: 'bg-white border-gray-300 text-black'
							}`}
					>
						<option value="">All Fields</option>
						{sectionData.fields.map(field => (
							<option key={field.name} value={field.name}>{field.name}</option>
						))}
					</select>
				</div>
			</div>

			{/* Records Table */}
			<div className={`rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
				<div className={`overflow-x-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
					<table className="w-full">
						<thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
							<tr>
								{sectionData.fields.map(field => (
									<th key={field.name} className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'
										}`}>
										{field.name}
									</th>
								))}
								<th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'
									}`}>
									Actions
								</th>
							</tr>
						</thead>
						<tbody className={isDark ? 'bg-gray-800' : 'bg-white'}>
							{filteredRecords.map((record, index) => (
								<tr key={record.id || index} className={index % 2 === 0 ? (isDark ? 'bg-gray-800' : 'bg-white') : (isDark ? 'bg-gray-700' : 'bg-gray-50')}>
									{sectionData.fields.map(field => (
										<td key={field.name} className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'
											}`}>
											{field.type === 'bool' ? (
												record[field.name] ? 'Yes' : 'No'
											) : field.type === 'date' ? (
												record[field.name] ? new Date(record[field.name]).toLocaleDateString() : ''
											) : (
												String(record[field.name] || '')
											)}
										</td>
									))}
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<button
											onClick={() => handleEdit(record)}
											className={`text-blue-600 hover:text-blue-900 mr-3 ${isDark ? 'text-blue-400 hover:text-blue-300' : ''
												}`}
										>
											<Edit className="w-4 h-4" />
										</button>
										<button
											onClick={() => record.id && handleDelete(record.id)}
											className={`text-red-600 hover:text-red-900 ${isDark ? 'text-red-400 hover:text-red-300' : ''
												}`}
										>
											<Trash2 className="w-4 h-4" />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{filteredRecords.length === 0 && (
					<div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
						{records.length === 0 ? 'No records found. Add your first record!' : 'No records match your search.'}
					</div>
				)}
			</div>

			{/* Add/Edit Form Modal */}
			{showForm && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className={`p-6 rounded-lg w-full max-w-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
						<div className="flex justify-between items-center mb-4">
							<h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
								{editingRecord ? 'Edit Record' : 'Add New Record'}
							</h3>
							<button
								onClick={() => {
									setShowForm(false);
									setEditingRecord(null);
									setFormData({});
								}}
								className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
									}`}
							>
								×
							</button>
						</div>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{sectionData.fields.map(field => (
									<div key={field.name}>
										<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
											{field.name} {field.required && <span className="text-red-500">*</span>}
										</label>

										{field.type === 'bool' ? (
											<input
												type="checkbox"
												checked={formData[field.name] || false}
												onChange={(e) => handleInputChange(field.name, e.target.checked)}
												className="w-4 h-4"
											/>
										) : field.type === 'text' ? (
											<textarea
												value={formData[field.name] || ''}
												onChange={(e) => handleInputChange(field.name, e.target.value)}
												required={field.required}
												rows={3}
												className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark
													? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
													: 'bg-white border-gray-300 text-black placeholder-gray-500'
													}`}
											/>
										) : (
											<input
												type={field.type === 'int' || field.type === 'float' ? 'number' :
													field.type === 'date' ? 'date' : 'text'}
												value={formData[field.name] || ''}
												onChange={(e) => handleInputChange(field.name, e.target.value)}
												required={field.required}
												step={field.type === 'float' ? '0.01' : undefined}
												className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark
													? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
													: 'bg-white border-gray-300 text-black placeholder-gray-500'
													}`}
											/>
										)}
									</div>
								))}
							</div>

							<div className="flex space-x-3 pt-4">
								<button
									type="button"
									onClick={() => {
										setShowForm(false);
										setEditingRecord(null);
										setFormData({});
									}}
									className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark
										? 'bg-gray-600 hover:bg-gray-700 text-white'
										: 'bg-gray-500 hover:bg-gray-600 text-white'
										}`}
								>
									Cancel
								</button>
								<button
									type="submit"
									className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark
										? 'bg-blue-600 hover:bg-blue-700 text-white'
										: 'bg-blue-500 hover:bg-blue-600 text-white'
										}`}
								>
									{editingRecord ? 'Update' : 'Create'} Record
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default DynamicSectionPage;