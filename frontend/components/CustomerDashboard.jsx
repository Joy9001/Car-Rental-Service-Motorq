import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
// import { mainListItems } from './ListItems.jsx';
import CarCard from './CarCard.jsx';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { OutlinedInput } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
	backgroundColor: '#8561c5',
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		backgroundColor: '#8561c5',
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
	'& .MuiDrawer-paper': {
		position: 'relative',
		whiteSpace: 'nowrap',
		backgroundColor: '#9778ce',
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		boxSizing: 'border-box',
		...(!open && {
			overflowX: 'hidden',
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			width: theme.spacing(7),
			[theme.breakpoints.up('sm')]: {
				width: theme.spacing(9),
			},
		}),
	},
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

function handleSearch(setData, query) {
	axios
		.get('http://localhost:3000/customer/api/cars')
		.then((response) => {
			let filteredData = response.data;
			console.log('filteredData', filteredData);
			console.log('query', query);

			if (!filteredData || !query) {
				return;
			}

			if (query.fueltype) {
				filteredData = filteredData.filter((car) =>
					car.fueltype.toLowerCase().includes(query.fueltype.toLowerCase())
				);
			}

			if (query.make) {
				filteredData = filteredData.filter((car) =>
					car.make.toLowerCase().includes(query.make.toLowerCase())
				);
			}

			if (query.model) {
				filteredData = filteredData.filter((car) =>
					car.model.toLowerCase().includes(query.model.toLowerCase())
				);
			}

			if (query.year) {
				filteredData = filteredData.filter(
					(car) => car.year === parseInt(query.year)
				);
			}

			if (query.rentratedaily) {
				filteredData = filteredData.filter(
					(car) => car.rentratedaily <= parseFloat(query.rentratedaily)
				);
			}

			if (query.rentratehourly) {
				filteredData = filteredData.filter(
					(car) => car.rentratehourly <= parseFloat(query.rentratehourly)
				);
			}

			// Update state with the filtered data
			setData(filteredData);
		})
		.catch((error) => {
			console.error('Error fetching data: ', error);
		});
}

export default function CustomerDashboard() {
	// const [data, setData] = useState([]);
	const { data, setData } = useOutletContext();
	const [query, setQuery] = useState({
		fueltype: '',
		make: '',
		model: '',
		year: '',
		rentratedaily: '',
		rentratehourly: '',
	});

	console.log(data);
	// get cars data
	useEffect(() => {
		axios
			.get('http://localhost:3000/customer/api/cars')
			.then((response) => {
				setData(response.data);
			})
			.catch((error) => {
				console.error('Error fetching data: ', error);
			});
	}, [setData]);

	useEffect(() => {
		handleSearch(setData, query);
	}, [query, setData]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setQuery((prevQuery) => ({
			...prevQuery,
			[name]: value,
		}));
	};

	const [open, setOpen] = React.useState(false);
	const toggleDrawer = () => {
		setOpen(!open);
	};

	return (
		<ThemeProvider theme={defaultTheme}>
			<Box sx={{ display: 'flex' }}>
				<CssBaseline />
				<AppBar position="absolute" open={open}>
					<Toolbar
						sx={{
							pr: '24px', // keep right padding when drawer closed
						}}>
						<IconButton
							edge="start"
							color="inherit"
							aria-label="open drawer"
							onClick={toggleDrawer}
							sx={{
								marginRight: '36px',
								...(open && { display: 'none' }),
							}}>
							<MenuIcon />
						</IconButton>
						<Typography
							component="h1"
							variant="h6"
							color="inherit"
							noWrap
							sx={{ flexGrow: 1 }}>
							Home Page
						</Typography>
						{/* <IconButton color="inherit">
							<Badge badgeContent={4} color="secondary">
								<NotificationsIcon />
							</Badge>
						</IconButton> */}
					</Toolbar>
				</AppBar>
				<Drawer variant="permanent" open={open}>
					<Toolbar
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'flex-end',
							px: [1],
						}}>
						<IconButton onClick={toggleDrawer}>
							<ChevronLeftIcon />
						</IconButton>
					</Toolbar>
					<Divider />
					<List component="nav">
						<ListItemButton>
							<ListItemIcon>
								<DirectionsCarIcon />
							</ListItemIcon>
							<ListItemText primary="Cars" />
						</ListItemButton>
					</List>
				</Drawer>
				<Box
					component="main"
					sx={{
						backgroundColor: (theme) =>
							theme.palette.mode === 'light'
								? theme.palette.grey[100]
								: theme.palette.grey[900],
						flexGrow: 1,
						height: '100vh',
						overflow: 'auto',
					}}>
					<Toolbar />
					<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
						<Grid container flexDirection={'row'} spacing={4}>
							<OutlinedInput
								type="text"
								name="make"
								value={query.make}
								onChange={handleInputChange}
								placeholder="Search for cars by make"
								style={{ marginLeft: '1rem', marginTop: '1rem' }}
							/>
							<OutlinedInput
								type="text"
								name="model"
								value={query.model}
								onChange={handleInputChange}
								placeholder="Search for cars by model"
								style={{ marginLeft: '1rem', marginTop: '1rem' }}
							/>
							<OutlinedInput
								type="text"
								name="year"
								value={query.year}
								onChange={handleInputChange}
								placeholder="Search for cars by year"
								style={{ marginLeft: '1rem', marginTop: '1rem' }}
							/>
							<OutlinedInput
								type="text"
								name="fuelType"
								value={query.fueltype}
								onChange={handleInputChange}
								placeholder="Search for cars by fuel type"
								style={{ marginLeft: '1rem', marginTop: '1rem' }}
							/>
							<OutlinedInput
								type="text"
								name="rentratedaily"
								value={query.rentratedaily}
								onChange={handleInputChange}
								placeholder="Search for cars by daily rent rate"
								style={{ marginLeft: '1rem', marginTop: '1rem' }}
							/>
							<OutlinedInput
								type="text"
								name="rentratehourly"
								value={query.rentratehourly}
								onChange={handleInputChange}
								placeholder="Search for cars by hourly rent rate"
								style={{ marginLeft: '1rem', marginTop: '1rem' }}
							/>
						</Grid>
						<Typography
							component="h3"
							variant="h3"
							color="#482880"
							noWrap
							justifyContent={'center'}
							ml={'1rem'}
							mb={'2rem'}
							mt={'2rem'}>
							Rent Cars
						</Typography>
						<Grid container spacing={3}>
							{/* Cars */}
							{data &&
								data.map((car) => (
									<Grid item xs={12} md={4} lg={3} key={car.id}>
										<CarCard car={car} setCarData={setData} />
									</Grid>
								))}
						</Grid>
					</Container>
				</Box>
			</Box>
		</ThemeProvider>
	);
}
