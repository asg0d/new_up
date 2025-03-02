import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Container,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import DataGrid from './components/DataGrid';
import ConsoleOutput from './components/ConsoleOutput';
import ResultsChart from './components/ResultsChart';
import { calculateAll } from './services/calculationService';
import { importExcel, exportExcel } from './services/excelService';

const methodNames = [
  'nazarov-sipachev',
  'sipachev-posevich',
  'maksimov',
  'sazonov',
  'pirverdyan',
  'kambarov'
];

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState([]);
  const [calculationResults, setCalculationResults] = useState({});
  const [defaultN, setDefaultN] = useState(11);
  const [fnLimit, setFnLimit] = useState(0.15);
  const [feLimit, setFeLimit] = useState(0.85);
  const [error, setError] = useState(null);
  const [showCharts, setShowCharts] = useState(false);

  const handleFileImport = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const importedData = await importExcel(file);
        setData(importedData);
        setCalculationResults({});
        setError(null);
      } catch (error) {
        console.error('Error importing file:', error);
        setError('Error importing file: ' + error.message);
      }
    }
  };

  const handleNChange = (newN) => {
    setDefaultN(newN);
    
    // Sort data by year
    const sortedData = [...data].sort((a, b) => parseInt(a.year) - parseInt(b.year));
    
    // Update active flags based on N
    const updatedData = sortedData.map((row, index) => ({
      ...row,
      active: newN === 0 || index >= sortedData.length - newN
    }));

    setData(updatedData);
  };

  const handleCalculate = () => {
    if (!data.length) {
      setError('No data to calculate');
      return;
    }

    // Sort data by year and take last N years
    const sortedData = [...data].sort((a, b) => parseInt(a.year) - parseInt(b.year));
    const activeData = defaultN === 0 ? sortedData : sortedData.slice(-defaultN);

    try {
      const allResults = calculateAll(activeData, {
        defaultN,
        fnLimit,
        feLimit
      });
      setCalculationResults(allResults);
      setError(null);
    } catch (err) {
      console.error('Error in calculation:', err);
      setError('Ошибка при вычислении: ' + err.message);
    }
  };

  const handleExport = async () => {
    try {
      await exportExcel(data, calculationResults);
    } catch (error) {
      console.error('Error exporting file:', error);
      setError('Error exporting file: ' + error.message);
    }
  };

  const handleShowCharts = () => {
    if (!calculationResults[methodNames[activeTab]]) {
      setError('Сначала выполните расчет');
      return;
    }
    setShowCharts(true);
  };

  const currentMethodResults = calculationResults[methodNames[activeTab]];

  return (
    <Box 
      sx={{ 
        p: 3, 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: '#f5f5f5'
      }}
    >
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          mb: 3,
          color: '#1976d2',
          fontWeight: 500
        }}
      >
        Инженерный калькулятор
      </Typography>

      <Grid container spacing={3} sx={{ flex: 1, mb: 3 }}>
        {/* Left side - Data Grid */}
        <Grid item xs={6}>
          <Paper 
            elevation={3}
            sx={{ 
              height: '100%',
              overflow: 'hidden',
              borderRadius: 2,
              '& .MuiTableContainer-root': {
                maxHeight: 'calc(100vh - 300px)',
                overflow: 'auto'
              }
            }}
          >
            <DataGrid data={data} setData={setData} />
          </Paper>
        </Grid>

        {/* Right side - Results */}
        <Grid item xs={6}>
          <Paper 
            elevation={3}
            sx={{ 
              height: '100%',
              borderRadius: 2,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {error && (
              <Typography 
                color="error" 
                sx={{ 
                  p: 2,
                  bgcolor: '#ffebee',
                  borderRadius: '8px',
                  mb: 2 
                }}
              >
                {error}
              </Typography>
            )}
            
            <Tabs 
              value={activeTab} 
              onChange={(e, v) => setActiveTab(v)}
              variant="scrollable"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: '#fff',
                '& .MuiTab-root': {
                  minHeight: 48,
                  textTransform: 'none',
                  fontSize: '0.95rem'
                }
              }}
            >
              <Tab label="Назаров-Сипачев" />
              <Tab label="Сипачев-Посевич" />
              <Tab label="Максимов" />
              <Tab label="Сазонов" />
              <Tab label="Пирвердян" />
              <Tab label="Камбаров" />
            </Tabs>

            <Box sx={{ 
              flex: 1, 
              overflow: 'auto',
              maxHeight: 'calc(100vh - 300px)'
            }}>
              {currentMethodResults && (
                <ConsoleOutput result={currentMethodResults} />
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Controls */}
      <Paper 
        elevation={3}
        sx={{ 
          p: 2,
          borderRadius: 2,
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          bgcolor: '#fff'
        }}
      >
        <Button
          variant="contained"
          component="label"
          sx={{
            textTransform: 'none',
            bgcolor: '#1976d2',
            '&:hover': {
              bgcolor: '#1565c0'
            }
          }}
        >
          Импорт
          <input
            type="file"
            hidden
            accept=".xlsx,.xls"
            onChange={handleFileImport}
          />
        </Button>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>n по умолчанию</InputLabel>
          <Select
            value={defaultN}
            label="n по умолчанию"
            onChange={(e) => handleNChange(e.target.value)}
            size="small"
          >
            {[...Array(21)].map((_, i) => (
              <MenuItem key={i} value={i}>
                {i}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="fn. пред."
          value={fnLimit}
          onChange={(e) => setFnLimit(e.target.value)}
          size="small"
          sx={{ width: 100 }}
        />

        <TextField
          label="fe. пред."
          value={feLimit}
          onChange={(e) => setFeLimit(e.target.value)}
          size="small"
          sx={{ width: 100 }}
        />

        <Button
          variant="contained"
          onClick={handleCalculate}
          sx={{
            textTransform: 'none',
            bgcolor: '#2e7d32',
            '&:hover': {
              bgcolor: '#1b5e20'
            }
          }}
        >
          Вычислить
        </Button>

        <Button
          variant="contained"
          onClick={handleShowCharts}
          sx={{
            textTransform: 'none',
            bgcolor: '#1976d2',
            '&:hover': {
              bgcolor: '#1565c0'
            }
          }}
        >
          Графики
        </Button>

        <Button
          variant="contained"
          onClick={handleExport}
          sx={{
            textTransform: 'none',
            bgcolor: '#ed6c02',
            '&:hover': {
              bgcolor: '#e65100'
            }
          }}
        >
          Экспорт
        </Button>
      </Paper>

      <ResultsChart
        open={showCharts}
        onClose={() => setShowCharts(false)}
        data={calculationResults[methodNames[activeTab]]}
        methodName={methodNames[activeTab]}
      />
    </Box>
  );
}

export default App;
