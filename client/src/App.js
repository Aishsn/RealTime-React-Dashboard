import React from 'react';
import { Container, CssBaseline, Typography, Box } from '@mui/material';
import { RealtimeProvider } from './components/RealtimeProvider';
import SummaryCards from './components/SummaryCards';
import ChartsPanel from './components/ChartsPanel';
import ModulesTable from './components/ModulesTable';

export default function App(){
  return (
    <RealtimeProvider>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Real-Time Platform Analytics Dashboard(WebSocket)
        </Typography>

        <Box sx={{ my: 2 }}>
          <SummaryCards />
        </Box>

        <Box sx={{ my: 2 }}>
          <ChartsPanel />
        </Box>

        <Box sx={{ my: 2 }}>
          <ModulesTable />
        </Box>
      </Container>
    </RealtimeProvider>
  );
}