import React from 'react';
import { Box, Typography } from '@mui/material';

const ConsoleOutput = ({ result }) => {
  if (!result || !result.results || !result.coefficients) {
    return null;
  }

  const { results, coefficients } = result;

  const formatNumber = (num) => {
    if (num === undefined || num === null) return 'N/A';
    return typeof num === 'number' ? num.toFixed(4) : num.toString();
  };

  return (
    <Box sx={{ 
      p: 3,
      color: '#1a1a1a',
      '& pre': {
        margin: 0,
        fontSize: '0.9rem',
        lineHeight: 1.6
      }
    }}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2,
          color: '#1976d2',
          fontWeight: 500
        }}
      >
        {result.method}
      </Typography>

      <Box sx={{ 
        bgcolor: '#f8f9fa',
        p: 2,
        borderRadius: 1,
        border: '1px solid #e0e0e0',
        mb: 3
      }}>
        <Typography variant="subtitle1" sx={{ mb: 1, color: '#1976d2' }}>
          Входные данные:
        </Typography>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '8px 16px',
          '& > span': {
            fontFamily: 'Consolas, Monaco, monospace',
            fontSize: '0.9rem',
            whiteSpace: 'nowrap'
          }
        }}>
          <span>X:</span>
          <span>{result.xDescription}</span>
          <span>Y:</span>
          <span>{result.yDescription}</span>
        </Box>
      </Box>

      <Box sx={{ 
        bgcolor: '#f8f9fa',
        p: 2,
        borderRadius: 1,
        border: '1px solid #e0e0e0',
        mb: 3
      }}>
        <Typography variant="subtitle1" sx={{ mb: 1, color: '#1976d2' }}>
          Коэффициенты:
        </Typography>
        <Typography component="pre">
          A = {formatNumber(coefficients.A)}
          B = {formatNumber(coefficients.B)}
          R² = {formatNumber(coefficients.R2)}
        </Typography>
      </Box>

      <Box sx={{ 
        bgcolor: '#f8f9fa',
        p: 2,
        borderRadius: 1,
        border: '1px solid #e0e0e0',
        overflowX: 'auto'
      }}>
        <Typography variant="subtitle1" sx={{ mb: 1, color: '#1976d2' }}>
          Результаты:
        </Typography>
        <Box 
          component="table" 
          sx={{ 
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0 4px',
            fontFamily: 'Consolas, Monaco, monospace',
            fontSize: '0.85rem',
            '& th': {
              textAlign: 'right',
              padding: '8px 16px',
              borderBottom: '2px solid #e0e0e0',
              whiteSpace: 'nowrap'
            },
            '& td': {
              padding: '8px 16px',
              borderBottom: '1px solid #e0e0e0',
              whiteSpace: 'nowrap',
              textAlign: 'right'
            },
            '& th:first-of-type, & td:first-of-type': {
              minWidth: '80px'
            }
          }}
        >
          <thead>
            <tr>
              <th>Год</th>
              <th>X</th>
              <th>Y</th>
              <th>XY</th>
              <th>X²</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row, index) => {
              const x = parseFloat(row.x) || 0;
              const y = parseFloat(row.y) || 0;
              const xy = x * y;
              const x2 = x * x;
              return (
                <tr key={index}>
                  <td>{row.year}</td>
                  <td>{formatNumber(x)}</td>
                  <td>{formatNumber(y)}</td>
                  <td>{formatNumber(xy)}</td>
                  <td>{formatNumber(x2)}</td>
                </tr>
              );
            })}
          </tbody>
        </Box>
      </Box>
    </Box>
  );
};

export default ConsoleOutput;
