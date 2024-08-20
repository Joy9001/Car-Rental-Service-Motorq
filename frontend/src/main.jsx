import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import App from './App.jsx';
import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from 'react-router-dom';

import SignIn from '../components/SignIn.jsx';
import SignUp from '../components/SignUp.jsx';
import AdminSignIn from '../components/AdminSignIn.jsx';
import AdminDashboard from '../components/AdminDashboard.jsx';
import CustomerDashboard from '../components/CustomerDashboard.jsx';

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path="/signin" element={<SignIn />} />
			<Route path="/signup" element={<SignUp />} />
			<Route path="/admin" element={<AdminSignIn />} />
			<Route path="/admin-dashboard" element={<AdminDashboard />} />
			<Route path="/" element={<CustomerDashboard />} />
		</>
	)
);

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<RouterProvider router={router}>{/* <App /> */}</RouterProvider>
	</StrictMode>
);
