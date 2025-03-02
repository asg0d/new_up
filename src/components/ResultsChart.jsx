import React from 'react';
import { Paper } from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export default function ResultsChart({ data }) {
  if (!data || !Array.isArray(data)) {
    return null;
  }

  // Transform data for the chart
  const chartData = data.map(point => ({
    x: point.vw,
    y: point.vlvo,
    yCalc: point.vw * point.coefficients?.A + point.coefficients?.B
  }));

  return (
    <Paper sx={{ p: 2, height: 300, width: '100%' }}>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="x" 
            label={{ value: 'Water Velocity (Vw)', position: 'bottom' }}
          />
          <YAxis 
            label={{ value: 'Volume Ratio (Vl/Vo)', angle: -90, position: 'left' }}
          />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="y" 
            stroke="#8884d8" 
            activeDot={{ r: 8 }} 
            name="Actual Values" 
          />
          <Line 
            type="monotone" 
            dataKey="yCalc" 
            stroke="#82ca9d" 
            name="Calculated Values" 
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}
