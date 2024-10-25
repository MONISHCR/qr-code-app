import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container, TextField, Button, Typography, 
  Box, CssBaseline, Alert, useMediaQuery 
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a consistent theme for better UX across devices
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
  },
  typography: {
    h5: { fontWeight: 600 },
    body2: { color: '#616161' },
  },
});

function AdminDashboard() {
  const [eventName, setEventName] = useState('');
  const [downloadLimit, setDownloadLimit] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const createEvent = async () => {
    if (!eventName.trim()) {
      setError('Event Name cannot be empty');
      return;
    }
    if (downloadLimit <= 0) {
      setError('Number of tickets must be at least 1');
      return;
    }

    try {
      const response = await axios.post('https://amb-bac.vercel.app/admin/create-event', {
        eventName,
        downloadLimit,
      });

      setSuccess(response.data.message);
      setError(''); // Clear any previous errors
      setEventName('');
      setDownloadLimit(1);
    } catch (error) {
      console.error('Error creating event:', error);
      setError('Failed to create the event. Please try again.');
      setSuccess('');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box 
          mt={isMobile ? 4 : 8} 
          p={4} 
          boxShadow={3} 
          borderRadius={2} 
          sx={{ backgroundColor: '#fff', flexGrow: 1 }}
        >
          <Typography variant="h5" textAlign="center" gutterBottom>
            Create Event
          </Typography>

          <TextField
            label="Event Name"
            fullWidth
            margin="normal"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            error={!!error && !eventName.trim()}
            helperText={!eventName.trim() && error ? error : ''}
          />

          <TextField
            label="Number of Tickets"
            type="number"
            fullWidth
            margin="normal"
            value={downloadLimit}
            onChange={(e) => setDownloadLimit(Number(e.target.value))}
            error={!!error && downloadLimit <= 0}
            helperText={downloadLimit <= 0 && error ? error : ''}
          />

          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            onClick={createEvent} 
            sx={{ mt: 2 }}
          >
            Create Event with QR Codes
          </Button>

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}

          {error && !success && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>

        <Box 
          component="footer" 
          py={2} 
          textAlign="center" 
          sx={{ backgroundColor: '#f1f1f1', mt: 'auto' }}
        >
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} @Monish
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default AdminDashboard;
