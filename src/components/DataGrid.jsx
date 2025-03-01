import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Checkbox
} from '@mui/material';

export default function DataGrid({ data, setData }) {
  const handleChange = (index, field, value) => {
    const newData = [...data];
    newData[index] = {
      ...newData[index],
      [field]: value
    };

    // If oil or liquid changes, recalculate water and water cut
    if (field === 'oil' || field === 'liquid') {
      const oil = parseFloat(field === 'oil' ? value : newData[index].oil) || 0;
      const liquid = parseFloat(field === 'liquid' ? value : newData[index].liquid) || 0;
      const water = Math.max(0, liquid - oil);
      newData[index].water = water.toFixed(2);
      
      // Calculate water cut using year-over-year change
      if (index > 0) {
        const prevRow = newData[index - 1];
        const prevLiquid = parseFloat(prevRow.liquid) || 0;
        const prevOil = parseFloat(prevRow.oil) || 0;
        const prevWater = Math.max(0, prevLiquid - prevOil);
        
        const waterChange = water - prevWater;
        const liquidChange = liquid - prevLiquid;
        
        if (liquidChange !== 0) {
          newData[index].waterCut = ((waterChange / liquidChange) * 100).toFixed(2);
        }
      }
    }
    
    setData(newData);
  };

  return (
    <TableContainer component={Paper} sx={{ height: '100%', overflow: 'auto' }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ width: '50px' }}>№</TableCell>
            <TableCell align="center" sx={{ width: '80px' }}>Годы</TableCell>
            <TableCell align="center" sx={{ minWidth: '120px' }}>Нефти</TableCell>
            <TableCell align="center" sx={{ minWidth: '120px' }}>Жидкости</TableCell>
            <TableCell align="center" sx={{ minWidth: '120px' }}>Воды</TableCell>
            <TableCell align="center" sx={{ minWidth: '120px' }}>Обводненность</TableCell>
            <TableCell align="center" sx={{ width: '100px' }}>Active points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell align="center">
                {index + 1}
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  value={row.year || ''}
                  onChange={(e) => handleChange(index, 'year', e.target.value)}
                  style={{ width: '100%', textAlign: 'center' }}
                />
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  value={row.oil || ''}
                  onChange={(e) => handleChange(index, 'oil', e.target.value)}
                  style={{ width: '100%', textAlign: 'center' }}
                />
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  value={row.liquid || ''}
                  onChange={(e) => handleChange(index, 'liquid', e.target.value)}
                  style={{ width: '100%', textAlign: 'center' }}
                />
              </TableCell>
              <TableCell align="center">
                {row.water || '0'}
              </TableCell>
              <TableCell align="center">
                {row.waterCut || '0'}
              </TableCell>
              <TableCell align="center">
                <Checkbox
                  checked={row.active || false}
                  onChange={(e) => handleChange(index, 'active', e.target.checked)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
