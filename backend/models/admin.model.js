import { Schema, model } from 'mongoose';

const adminSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		address: { type: String, required: true },
		role: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

const Admin = model('Admin', adminSchema);

export default Admin;
