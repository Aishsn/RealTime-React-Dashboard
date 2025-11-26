import React from "react";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { Line, Pie, Bar } from "react-chartjs-2";
import { useRealtime } from "./RealtimeProvider";
import 'chartjs-adapter-date-fns';
import { BarElement } from "chart.js";


import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement, TimeScale 
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement, TimeScale, BarElement
);

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#A020F0", "#FF66CC", "#66CCFF", "#999999"
];

export default function ChartsPanel() {
  const { state } = useRealtime();
  if (!state) return null;

  const activeUsers = state.trends.activeUsers.map(p => ({
    x: new Date(p.time),
    y: p.value
  }));

//   const activeUserLabels = activeUsers.map(p => {
//   const d = p.x;
//   return d.getSeconds() === 0 
//     ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     : ""; 
// });

const parseDateToISO = (str) => {
  return new Date(
    new Date(str).toISOString()
  );
};

const apiRejs = state.trends.apiRejections.map(p => ({
  x: parseDateToISO(p.time),
  y: p.value
}));

  // const apiRejsLabels = apiRejs.map(p =>{
  //   const d = new Date(p.x);
  //   return d.getSeconds() === 0 
  //     ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  //     : "";
  // } );

  const sensorTypeLabels = Object.keys(state.sensorTypeObj.types);
  const sensorTypeData = Object.values(state.sensorTypeObj.types);

  const projectsLabels = state.trends.projectsWeekly.map(p => p.week);
  const projectsData = state.trends.projectsWeekly.map(p => p.value);

const cardStyle = {
  borderRadius: 3,
  padding: 1.5,
  height: '100%',
};

  return (
    <Grid container spacing={2}>
      
      {/* Active Users Trend */}
      <Grid item xs={12} md={6}>
        <Card sx={cardStyle}>
          <CardContent>
            <Typography variant="h6">Active Users Trend</Typography>
            <div style={{height:240}}>
              <Line
                data={{
                  labels: activeUsers.map(p => p.x),
                  datasets: [
                    {
                      label: "Active Users",
                      data: activeUsers.map(p => ({ x: p.x, y: p.y })),
                      borderColor: "#8884d8",
                      backgroundColor: "rgba(136,132,216,0.2)",
                      tension: 0.3
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  parsing: false,
                  scales: {
                    x: {
                      type: "time",
                      time: {
                        unit: "minute",
                        displayFormats: {
                          minute: "HH:mm"
                        }
                      },
                      ticks: {
                        source: "auto"
                      },
                       title: {
                        display: true,
                        text: "Active users per minute",
                        font: { size: 13 }
                      }
                    },
                    y:{
                      // beginAtZero: true
                      title: {
                        display: true,
                        text: "Active Users Count",
                        font: { size: 13 }
                      }
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      </Grid>

      {/* API Rejections */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">API Rejections</Typography>

            <div style={{ height: 240 }}>
              <Line
                data={{
                  datasets: [
                    {
                      label: "API Rejections-change",
                      data: apiRejs,
                      borderColor: "#e57373",
                      backgroundColor: "rgba(229,115,115,0.2)",
                      tension: 0.3
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  parsing: false,
                  scales: {
                    x: {
                      type: "time",
                      time: {
                        unit: "minute",
                        stepSize: 5,
                        displayFormats: { minute: "HH:mm" }
                      },
                      ticks: {
                        autoSkip: false,
                        callback: (value, index, ticks) => {
                          const ts = ticks[index].value;
                          const d = new Date(ts);
                          if (d.getMinutes() % 5 === 0) {
                            return d.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit"
                            });
                          }
                          return "";
                        }
                      },
                      title: {
                        display: true,
                        text: "API Rejections every 5 minutes",
                        font: { size: 13 }
                      }
                    },
                    y: {
                      title: {
                        display: true,
                        text: "API Rejections Count",
                        font: { size: 13 }
                      }
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      </Grid>

      {/* Doghnut chart */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Sensor Types (Donut Chart)</Typography>
            <div style={{ height: 300 }}>
              <Pie
                data={{
                  labels: sensorTypeLabels,
                  datasets: [
                    {
                      label: "Sensor Types",
                      data: sensorTypeData,
                      backgroundColor: COLORS,
                      cutout: "50%", // <-- donut effect
                    },
                  ],
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </CardContent>
        </Card>
      </Grid>


      {/* Bar Chart */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Sensor Types (Bar Chart)</Typography>
            <div style={{ height: 300 }}>
              <Bar
                data={{
                  labels: sensorTypeLabels,
                  datasets: [
                    {
                      label: "Sensor Types",
                      data: sensorTypeData,
                      backgroundColor: COLORS,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "Count",
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </Grid>


      {/* Sensor Type Pie Chart */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Sensor Type Breakdown</Typography>
            <div style={{height:300}}>
            <Pie
              data={{
                labels: sensorTypeLabels,
                datasets: [
                  {
                    label: "Sensor Types",
                    data: sensorTypeData,
                    backgroundColor: COLORS,
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
            </div>
          </CardContent>
        </Card>
      </Grid>

      {/* Weekly Projects */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Projects Created Last 7d</Typography>
            <div style={{height:240}}>
            <Line
              data={{
                labels: projectsLabels,
                datasets: [
                  {
                    label: "Weekly Projects",
                    data: projectsData,
                    borderColor: "#82ca9d",
                    backgroundColor: "rgba(130,202,157,0.3)",
                    tension: 0.3,
                    fill: true,
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
            </div>
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  );
}
