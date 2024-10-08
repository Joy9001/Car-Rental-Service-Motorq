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
// import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
// import Paper from '@mui/material/Paper';
// import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
// import NotificationsIcon from '@mui/icons-material/Notifications';
import CarDashboard from './CarDashboard.jsx';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import MapIcon from '@mui/icons-material/Map';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useNavigate } from 'react-router-dom';
import Map from './Map.jsx';
import PendingRequestTable from './PendingRequests.jsx';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
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

export default function Dashboard() {
	const navigate = useNavigate();

	const [open, setOpen] = React.useState(false);
	const toggleDrawer = () => {
		setOpen(!open);
	};

	return (
		<ThemeProvider theme={defaultTheme}>
			<Box sx={{ display: 'flex', flexDirection: 'row' }}>
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
							Dashboard
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
						{/* Cars */}
						<ListItemButton
							onClick={() =>
								navigate(
									'/admin-dashboard/cars?id=' +
										window.location.search.split('=')[1]
								)
							}>
							<ListItemIcon>
								<DirectionsCarIcon />
							</ListItemIcon>
							<ListItemText primary="Cars" />
						</ListItemButton>
						{/* Map */}
						<ListItemButton
							onClick={() =>
								navigate(
									'/admin-dashboard/map?id=' +
										window.location.search.split('=')[1]
								)
							}>
							<ListItemIcon>
								<MapIcon />
							</ListItemIcon>
							<ListItemText primary="Map" />
						</ListItemButton>
						<ListItemButton>
							<ListItemIcon>
								<VerifiedIcon />
							</ListItemIcon>
							<ListItemText primary="Pending Requests" />
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
						<Typography
							component="h3"
							variant="h3"
							color="inherit"
							noWrap
							justifyContent={'center'}
							ml={'1rem'}
							mb={'2rem'}>
							Cars Details
						</Typography>
						<Grid container spacing={3}>
							{/* Cars */}
							<CarDashboard />
							{/* Map */}
							<div id="map">
								<Map />
							</div>
							{/* Pending Cancellation Requests */}
							<PendingRequestTable />
						</Grid>
					</Container>
				</Box>
			</Box>
		</ThemeProvider>
	);
}
