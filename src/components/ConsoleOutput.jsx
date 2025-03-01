import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ConsoleOutput = ({ calculationResults, calculationType }) => {
  if (!calculationResults || !calculationResults.results) {
    return null;
  }

  const { results, coefficients, method, xDescription, yDescription } = calculationResults;

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '';
    return typeof num === 'number' ? num.toFixed(4) : num.toString();
  };

  return (
    <TableContainer component={Paper} sx={{ maxHeight: '100%', overflow: 'auto' }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>№</TableCell>
            <TableCell>Годы</TableCell>
            <TableCell>{xDescription || 'X'}</TableCell>
            <TableCell>{yDescription || 'Y'}</TableCell>
            <TableCell>XY</TableCell>
            <TableCell>X²</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.year}</TableCell>
              <TableCell>{formatNumber(row.x)}</TableCell>
              <TableCell>{formatNumber(row.y)}</TableCell>
              <TableCell>{formatNumber(row.xy)}</TableCell>
              <TableCell>{formatNumber(row.x2)}</TableCell>
            </TableRow>
          ))}
          {coefficients && (
            <TableRow>
              <TableCell colSpan={6} style={{ textAlign: 'left', paddingTop: '20px' }}>
                <strong>Коэффициенты {method}:</strong><br />
                A = {formatNumber(coefficients.A)}<br />
                B = {formatNumber(coefficients.B)}<br />
                R² = {formatNumber(coefficients.R2)}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ConsoleOutput;
