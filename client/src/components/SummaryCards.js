import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { useRealtime } from './RealtimeProvider';

// import PeopleIcon from '@mui/icons-material/People';
// import DevicesIcon from '@mui/icons-material/Devices';
// import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
// import FolderOpenIcon from '@mui/icons-material/FolderOpen';
// import SensorsIcon from '@mui/icons-material/Sensors';
// import InsightsIcon from '@mui/icons-material/Insights';

const cardStyle = {
  borderRadius: 3,
  padding: 1.5,
  height: '100%',
};

const cardStyleSensor={
  textAlign:'center',
   borderRadius: 3,
  padding: 1.5,
  height: 250,
}

const valueStyle = {
  fontSize: '1.8rem',
  fontWeight: 700,
};

export default function SummaryCards(){
  const { state } = useRealtime();
  if(!state) 
    return (
      <Card>
        <CardContent>
          <Typography>Connecting to real-time server...</Typography>
        </CardContent>
      </Card>
    );

  const d = state;

  return (
    <Grid container spacing={2}>

      {/* Total Active Users */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={cardStyle}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1}>
              {/* <PeopleIcon color="primary" /> */}
              <Typography variant="subtitle2">Total Active Users</Typography>
            </Box>
            <Typography sx={valueStyle}>{d.users.totalActive}</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Platforms */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={cardStyle}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1}>
              {/* <DevicesIcon color="secondary" /> */}
              <Typography variant="subtitle2">Active Users by Platform</Typography>
            </Box>
            <Box mt={1}>
              <Typography variant="body2">Web: <b>{d.users.platforms.web}</b></Typography>
              <Typography variant="body2">Mobile: <b>{d.users.platforms.mobile}</b></Typography>
              <Typography variant="body2">Tablet: <b>{d.users.platforms.tablet}</b></Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* API Rejections */}
      <Grid item xs={12} sm={6} md={2}>
        <Card sx={cardStyle}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1}>
              {/* <ErrorOutlineIcon color="error" /> */}
              <Typography variant="subtitle2">API Rejections (Last 5m)</Typography>
            </Box>
            <Typography sx={valueStyle}>{d.apiRejectionsLast5Min}</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* New Projects */}
      <Grid item xs={12} sm={6} md={2}>
        <Card sx={cardStyle}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1}>
              {/* <FolderOpenIcon color="success" /> */}
              <Typography variant="subtitle2">New Projects (Last 7d)</Typography>
            </Box>
            <Typography sx={valueStyle}>{d.newProjectsLast7Days}</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Live Projects */}
      <Grid item xs={12} sm={6} md={2}>
        <Card sx={cardStyle}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1}>
              {/* <InsightsIcon color="primary" /> */}
              <Typography variant="subtitle2">Live Projects</Typography>
            </Box>
            <Typography sx={valueStyle}>{d.totalLiveProjects}</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Sensors Active / Inactive */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={cardStyleSensor}>
          <CardContent>
            {/* <div style={{height:250}}> */}
            <Box mt={1}>
              {/* <SensorsIcon color="info" /> */}
              <Typography variant="subtitle2">Sensors (Active / Inactive)</Typography>
            </Box>

            <Box mt={1}>
              <Typography variant="body2">Active: <b>{d.sensorTypeObj.activeCampaigns}</b></Typography>
              <Typography variant="body2">Inactive: <b>{d.sensorTypeObj.inactiveCampaigns}</b></Typography>
            </Box>
            {/* </div> */}
          </CardContent>
        </Card>
      </Grid>

      {/* Sensor Type Distribution */}
      <Grid item xs={12} sm={12} md={8}>
        <Card sx={cardStyleSensor }>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              {/* <SensorsIcon color="secondary" /> */}
              <Typography variant="subtitle2">Sensor Types Distribution</Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.2,
                mt: 1,
              }}
            >
              <li>
              {Object.entries(d.sensorTypeObj.types).map(([type, count]) => (
                <Box
                  key={type}
                  sx={{
                    background: '#f5f5f5',
                    px: 1.5,
                    py: 0.7,
                    borderRadius: 2,
                    fontSize: '0.85rem',
                    display
                  }}
                >
                  <b>{type}</b>: {count}
                </Box>
              ))}
              </li>
            </Box>
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  );
}
