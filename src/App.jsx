import { useState } from 'react';
import { 
  Tabs, 
  Tab, 
  Button, 
  TextField, 
  Box, 
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid
} from '@mui/material';
import DataGrid from './components/DataGrid';
import ConsoleOutput from './components/ConsoleOutput';
import { calculationMethods } from './calculations';
import { importExcel, exportExcel } from './services/excelService';

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState([]);
  const [calculationResults, setCalculationResults] = useState(null);
  const [defaultN, setDefaultN] = useState(11);
  const [fnLimit, setFnLimit] = useState(0.15);
  const [feLimit, setFeLimit] = useState(0.85);

  const methodNames = [
    'nazarov-sipachev',
    'sipachev-posevich',
    'maksimov',
    'sazonov',
    'pirverdyan',
    'kambarov'
  ];

  const handleFileImport = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const importedData = await importExcel(file);
        setData(importedData);
        setCalculationResults(null);
      } catch (error) {
        console.error('Error importing file:', error);
        alert('Error importing file: ' + error.message);
      }
    }
  };

  const handleCalculate = () => {
    try {
      console.log('Starting calculation...');
      console.log('Active tab:', activeTab);
      console.log('Method name:', methodNames[activeTab]);
      console.log('Data:', data);
      
      const methodName = methodNames[activeTab];
      const calculateMethod = calculationMethods[methodName];
      
      console.log('Calculate method:', calculateMethod);
      
      if (calculateMethod) {
        const results = calculateMethod(data, {
          defaultN,
          fnLimit,
          feLimit
        });
        console.log('Calculation results:', results);
        setCalculationResults(results);
      }
    } catch (error) {
      console.error('Error in calculation:', error);
      alert('Ошибка при вычислении: ' + error.message);
    }
  };

  const handleExport = () => {
    try {
      exportExcel(data);
    } catch (error) {
      console.error('Error exporting file:', error);
      alert('Error exporting file: ' + error.message);
    }
  };

  return (
    <Box sx={{ p: 2, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Grid container spacing={2} sx={{ flex: 1, minHeight: 0 }}>
        {/* Left side - Data Grid */}
        <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ flex: 1, mb: 2, minHeight: 0, overflow: 'auto' }}>
            <DataGrid data={data} setData={setData} />
          </Box>
        </Grid>

        {/* Right side - Categories and Results */}
        <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Paper sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, v) => setActiveTab(v)}
              variant="scrollable"
              orientation="horizontal"
              sx={{ 
                borderBottom: 1,
                borderColor: 'divider',
                minHeight: 'auto',
                '& .MuiTab-root': {
                  minHeight: 'auto',
                  padding: '8px 12px'
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
            <ConsoleOutput 
              calculationResults={calculationResults} 
              calculationType={methodNames[activeTab]}
            />
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button
          variant="contained"
          component="label"
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
            onChange={(e) => setDefaultN(e.target.value)}
            size="small"
          >
            <MenuItem value={11}>11</MenuItem>
            <MenuItem value={12}>12</MenuItem>
            <MenuItem value={13}>13</MenuItem>
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
        >
          Вычислить
        </Button>

        <Button
          variant="contained"
          onClick={handleExport}
        >
          Экспорт
        </Button>
      </Paper>
    </Box>
  );
}

export default App;
