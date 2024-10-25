import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, Box, Typography, Button, MenuItem, 
  Select, FormControl, InputLabel, Alert, 
  CssBaseline, useMediaQuery 
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Theme for better styling across devices
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h5: {
      fontWeight: 600,
    },
  },
});

function UserDashboard() {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [events, setEvents] = useState([]);
  const [qrCode, setQRCode] = useState(null);
  const [error, setError] = useState('');
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Fetch available events when the component loads
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://amb-bac.vercel.app/admin/events');
        setEvents(response.data.events || []);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Error fetching events');
      }
    };

    fetchEvents();
  }, []);

  const handleDownload = async () => {
    try {
      const response = await axios.post(
        'https://amb-bac.vercel.app/user/download',
        { eventName: selectedEvent, userId: 'placeholder_user_id' },
        { withCredentials: true } // Send cookies with the request
      );
  
      if (response.data.success) {
        setQRCode(response.data.qrCode);
        setError(''); // Clear any error messages
      } else {
        setError(response.data.message);
        setQRCode(null);
      }
    } catch (error) {
      console.error('Error downloading QR code:', error);
      setError('Error downloading QR code');
      setQRCode(null);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box 
          mt={isMobile ? 4 : 8} 
          p={4} 
          boxShadow={3} 
          borderRadius={2} 
          sx={{ 
            backgroundColor: '#fff', 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center' 
          }}
        >
          <Typography variant="h5" textAlign="center" gutterBottom>
            Download QR Code for Event
          </Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel>Select Event</InputLabel>
            <Select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
            >
              {events.map((event) => (
                <MenuItem key={event._id} value={event.eventName}>
                  {event.eventName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleDownload}
            disabled={!selectedEvent}
            sx={{ mt: 2 }}
          >
            Download QR Code
          </Button>

          {qrCode && (
            <Box mt={3} textAlign="center">
              <img 
                src={qrCode} 
                alt="QR Code" 
                style={{ maxWidth: '100%', maxHeight: '300px' }} 
              />
            </Box>
          )}

          {error && (
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
            &copy; {new Date().getFullYear()} Monish
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default UserDashboard;
