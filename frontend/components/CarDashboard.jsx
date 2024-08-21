import { useMemo, useEffect } from 'react';
import axios from 'axios';
import {
	MRT_EditActionButtons,
	MaterialReactTable,
	// createRow,
	useMaterialReactTable,
} from 'material-react-table';
import {
	Box,
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Tooltip,
} from '@mui/material';
// import { fakeData, usStates } from './makeData';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';
import { useOutletContext } from 'react-router-dom';
// import { io } from 'socket.io-client';

const CarDashboard = () => {
	// const [data, setData] = useState([]);

	const { data, setData } = useOutletContext();
	console.log('data in CarDashboard', data);

	// get cars data
	useEffect(() => {
		axios
			.get('http://localhost:3000/admin/api/cars')
			.then((response) => {
				setData(response.data);
			})
			.catch((error) => {
				console.error('Error fetching data: ', error);
			});
	}, [setData]);

	// console.log(data);

	// create a car
	const createCar = async ({ values, table }) => {
		await axios
			.post('http://localhost:3000/admin/api/cars', values)
			.then((response) => {
				console.log('Car created: ', response.data);
				setData((prevData) => [...prevData, response.data]);
				table.setCreatingRow(null);
			})
			.catch((error) => {
				console.error('Error creating car: ', error);
			});
	};

	// update a car
	const updateCar = async ({ values, table }) => {
		await axios
			.put(`http://localhost:3000/admin/api/cars/${values.id}`, values)
			.then((response) => {
				console.log('Car updated: ', response.data);
				setData((prevData) =>
					prevData.map((car) =>
						car.id === response.data.id ? response.data : car
					)
				);
				table.setEditingRow(null);
			})
			.catch((error) => {
				console.error('Error updating car: ', error);
			});
	};

	// delete a car
	const deleteCar = async (carId) => {
		await axios
			.delete(`http://localhost:3000/admin/api/cars/${carId}`)
			.then((response) => {
				console.log('Car deleted: ', response.data);
				setData((prevData) => prevData.filter((car) => car.id !== carId));
			})
			.catch((error) => {
				console.error('Error deleting car: ', error);
			});
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: 'id',
				header: 'ID',
			},
			{
				accessorKey: 'registrationNumber',
				header: 'Registration No.',
			},
			{
				accessorKey: 'make',
				header: 'Make',
			},
			{
				accessorKey: 'model',
				header: 'Model',
			},
			{
				accessorKey: 'year',
				header: 'Year',
			},
			{
				accessorKey: 'rentratedaily',
				header: 'Rent Rate Daily',
			},
			{
				accessorKey: 'rentratehourly',
				header: 'Rent Rate Hourly',
			},
			{
				accessorKey: 'location',
				header: 'Location',
			},
			{
				accessorKey: 'status',
				header: 'Status',
				filterFn: 'equals',
				filterSelectOptions: ['Available', 'Booked', 'In Trip', 'Maintenance'],
				filterVariant: 'select',
			},
			{
				accessorKey: 'fueltype',
				header: 'Fuel Type',
				filterFn: 'equals',
				filterSelectOptions: [
					'Petrol',
					'Diesel',
					'CNG',
					'Bio-Diesel',
					'EV',
					'LPG',
				],
				filterVariant: 'select',
			},
			{
				accessorKey: 'currentCustomerId',
				header: 'Current Customer ID',
			},
			{
				accessorKey: 'averageRating',
				header: 'Average Rating',
				filterVariant: 'range',
			},
			{
				accessorKey: 'image',
				header: 'Image',
				Cell: ImageCell,
			},
		],
		[]
	);

	//DELETE action
	const openDeleteConfirmModal = (row) => {
		if (window.confirm('Are you sure you want to delete this car?')) {
			deleteCar(row.original.id);
		}
	};

	const table = useMaterialReactTable({
		columns,
		data: data,
		createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
		editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
		enableEditing: true,
		getRowId: (row) => row.id,
		muiTableContainerProps: {
			sx: {
				minHeight: '500px',
			},
		},
		onCreatingRowSave: createCar,
		onEditingRowSave: updateCar,

		//optionally customize modal content
		renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
			<>
				<DialogTitle variant="h3">Create New Car</DialogTitle>
				<DialogContent
					sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
					{internalEditComponents}
				</DialogContent>
				<DialogActions>
					<MRT_EditActionButtons variant="text" table={table} row={row} />
				</DialogActions>
			</>
		),
		//optionally customize modal content
		renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
			<>
				<DialogTitle variant="h3">Edit Car</DialogTitle>
				<DialogContent
					sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
					{internalEditComponents}
				</DialogContent>
				<DialogActions>
					<MRT_EditActionButtons variant="text" table={table} row={row} />
				</DialogActions>
			</>
		),
		renderRowActions: ({ row, table }) => (
			<Box sx={{ display: 'flex', gap: '1rem' }}>
				<Tooltip title="Edit">
					<IconButton onClick={() => table.setEditingRow(row)}>
						<EditIcon />
					</IconButton>
				</Tooltip>
				<Tooltip title="Delete">
					<IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			</Box>
		),
		renderTopToolbarCustomActions: ({ table }) => (
			<Button
				variant="contained"
				onClick={() => {
					table.setCreatingRow(true); //simplest way to open the create row modal with no default values
					//or you can pass in a row object to set default values with the `createRow` helper function
					// table.setCreatingRow(
					//   createRow(table, {
					//     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
					//   }),
					// );
				}}>
				Create New Car
			</Button>
		),
	});

	return <MaterialReactTable table={table} />;
};

const ImageCell = ({ renderedCellValue }) => (
	<img
		src={renderedCellValue}
		alt="car"
		style={{
			width: '100%',
			height: '100%',
			objectFit: 'contain',
		}}
	/>
);

ImageCell.propTypes = {
	renderedCellValue: PropTypes.string.isRequired,
};

export default CarDashboard;
