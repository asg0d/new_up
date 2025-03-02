import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ResultsChart = ({ open, onClose, data, methodName }) => {
  if (!data || !data.results) return null;

  const chartData = data.results.map(row => ({
    x: parseFloat(row.x) || 0,
    y: parseFloat(row.y) || 0
  }));

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '80vh',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        bgcolor: '#f8f9fa',
        borderBottom: '1px solid #e0e0e0'
      }}>
        График - {methodName}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: '#666'
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ height: '70vh' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="x" 
                type="number"
                label={{ 
                  value: 'X', 
                  position: 'bottom', 
                  offset: -5 
                }} 
                domain={['auto', 'auto']}
              />
              <YAxis 
                label={{ 
                  value: 'Y', 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: -5
                }} 
                domain={['auto', 'auto']}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="y"
                name="Y"
                stroke="#1976d2"
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ResultsChart;
