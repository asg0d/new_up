import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Line 
} from 'recharts';

export default function ResultsChart({ data, results }) {
  const activePoints = results?.filter(r => r.isActive) || [];
  const inactivePoints = results?.filter(r => !r.isActive) || [];

  // Create regression line points if we have results
  const regressionLine = [];
  if (results?.length > 0) {
    // Find min and max Vw values
    const minVw = Math.min(...results.map(r => r.vw));
    const maxVw = Math.max(...results.map(r => r.vw));
    
    // Use first point's predicted value to get A and B coefficients
    const firstPoint = results[0];
    const lastPoint = results[results.length - 1];
    
    if (firstPoint?.predicted !== undefined && lastPoint?.predicted !== undefined) {
      regressionLine.push(
        { vw: minVw, vlvo: firstPoint.predicted },
        { vw: maxVw, vlvo: lastPoint.predicted }
      );
    }
  }

  return (
    <ScatterChart
      width={600}
      height={400}
      margin={{
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      }}
    >
      <CartesianGrid />
      <XAxis 
        type="number" 
        dataKey="vw" 
        name="Vw" 
        label={{ value: 'Water Velocity (Vw)', position: 'bottom' }} 
      />
      <YAxis 
        type="number" 
        dataKey="vlvo" 
        name="Vl/Vo" 
        label={{ value: 'Volume Ratio (Vl/Vo)', angle: -90, position: 'left' }} 
      />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
      <Legend />
      
      {/* Regression line */}
      {regressionLine.length > 0 && (
        <Line
          type="linear"
          dataKey="vlvo"
          data={regressionLine}
          stroke="#000"
          dot={false}
          name="N-S Relationship"
        />
      )}
      
      {/* Active points */}
      <Scatter
        name="Active Points"
        data={activePoints}
        fill="#4CAF50"
      />
      
      {/* Inactive points */}
      <Scatter
        name="Inactive Points"
        data={inactivePoints}
        fill="#f44336"
      />
    </ScatterChart>
  );
}
