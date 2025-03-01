import * as XLSX from 'xlsx';

export function importExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        console.log('Reading Excel file...');
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        console.log('Workbook:', workbook);
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Get the range of data
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        console.log('Data range:', range);

        // Convert to array of arrays with header:1 to get raw rows
        const rawData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          raw: false,
          defval: ''
        });
        console.log('Raw data rows:', rawData);

        // Skip empty rows and format data
        const formattedData = rawData
          .filter(row => row && row.length > 0 && row[0]) // Skip empty rows
          .map((row, index, array) => {
            console.log('Processing row:', row);
            
            // Get values, replace commas with dots for numbers
            const year = row[0]?.toString().trim();
            const oil = row[1]?.toString().trim().replace(',', '.') || '0';
            const liquid = row[2]?.toString().trim().replace(',', '.') || '0';

            // Parse numbers
            const oilNum = parseFloat(oil);
            const liquidNum = parseFloat(liquid);
            const water = Math.max(0, liquidNum - oilNum);

            // Calculate water cut using year-over-year change
            let waterCut = 0;
            if (index > 0) {
              const prevRow = array[index - 1];
              const prevLiquid = parseFloat(prevRow[2]?.toString().trim().replace(',', '.') || '0');
              const prevOil = parseFloat(prevRow[1]?.toString().trim().replace(',', '.') || '0');
              const prevWater = Math.max(0, prevLiquid - prevOil);
              
              // Swapped the formula to use water change over liquid change
              const waterChange = water - prevWater;
              const liquidChange = liquidNum - prevLiquid;
              
              if (liquidChange !== 0) {
                waterCut = (waterChange / liquidChange) * 100;
              }
            }

            const item = {
              number: index + 1,
              year: year,
              oil: oil,
              liquid: liquid,
              water: water.toFixed(2),
              waterCut: waterCut.toFixed(2),
              active: false
            };
            console.log('Formatted item:', item);
            return item;
          });

        console.log('Final formatted data:', formattedData);
        resolve(formattedData);
      } catch (error) {
        console.error('Error processing Excel file:', error);
        reject(error);
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      reject(error);
    };
    reader.readAsBinaryString(file);
  });
}

export function exportExcel(data) {
  // Prepare data for export
  const exportData = data.map(row => ({
    'Годы': row.year,
    'Нефти': row.oil,
    'Жидкости': row.liquid,
    'Воды': row.water,
    'Обводненность': row.waterCut,
    'Active points': row.active ? 1 : 0
  }));

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');

  // Generate and download file
  XLSX.writeFile(wb, 'data_export.xlsx');
}
