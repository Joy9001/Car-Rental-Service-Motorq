import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

export default function SignIn() {
	const handleSubmit = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		console.log({
			email: data.get('email'),
			password: data.get('password'),
		});
	};

	return (
		<ThemeProvider theme={defaultTheme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />

				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}>
					<Typography component="h1" variant="h2" color={'#333'}>
						Admin Sign In
					</Typography>
					<Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign in
					</Typography>
					<Box
						component="form"
						onSubmit={handleSubmit}
						noValidate
						sx={{ mt: 1 }}>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Admin Email Address"
							name="email"
							autoComplete="email"
							autoFocus
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Admin Password"
							type="password"
							id="password"
							autoComplete="current-password"
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}>
							Sign In
						</Button>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
}
//
