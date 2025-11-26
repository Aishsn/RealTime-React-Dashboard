import React from "react";
import {
  Card, CardContent,Table,TableBody,TableCell,TableHead,TableRow,Typography,TableContainer,Paper,
} from "@mui/material";
import { useRealtime } from "./RealtimeProvider";

export default function ModulesTable() {
  const { state } = useRealtime();

  if (!state) return null;

  const { modules } = state;

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Modules & Release Information
        </Typography>

        <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
          <Table stickyHeader size="small" aria-label="modules release table">

            {/* Table Header */}
            <TableHead>
              <TableRow>
                <TableCell><strong>Module</strong></TableCell>
                <TableCell><strong>Current Version</strong></TableCell>
                <TableCell><strong>Last Deployed</strong></TableCell>
                <TableCell><strong>Upcoming Version</strong></TableCell>
                <TableCell><strong>Estimated Release</strong></TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {modules.map((mod) => (
                <TableRow key={mod.name} hover>
                  <TableCell>{mod.name}</TableCell>
                  <TableCell>{mod.currentVersion}</TableCell>
                  <TableCell>{mod.lastDeployed}</TableCell>
                  <TableCell>{mod.upcomingVersion}</TableCell>
                  <TableCell>{mod.estimatedRelease}</TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>

      </CardContent>
    </Card>
  );
}
