import PropTypes from 'prop-types';
import { useState } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import { Stack, Typography, Box } from '@mui/material';

import { LineChart } from '@mui/x-charts/LineChart';

function Legend({ items, onToggle }) {
  return (
    <Stack direction="row" sx={{ gap: 2, alignItems: 'center', justifyContent: 'center', mt: 2.5, mb: 1.5 }}>
      {items.map((item) => (
        <Stack
          key={item.label}
          direction="row"
          sx={{ gap: 1.25, alignItems: 'center', cursor: 'pointer' }}
          onClick={() => onToggle(item.label)}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              bgcolor: item.visible ? item.color : 'grey.500',
              borderRadius: '50%'
            }}
          />
          <Typography variant="body2" color="text.primary">
            {item.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export default function IncomeAreaChart({ yearlyData }) {
  const theme = useTheme();

  const [visibility, setVisibility] = useState({
    Appointments: true
  });

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const labels = yearlyData?.map((m) => monthNames[m.month - 1]);
  const data1 = yearlyData?.map((m) => m.count);

  const toggleVisibility = (label) => {
    setVisibility((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const visibleSeries = [
    {
      data: data1,
      label: 'Appointments',
      showMark: false,
      area: true,
      id: 'Appointments-series',
      color: theme.palette.primary.main,
      visible: visibility['Appointments']
    }
  ];

  const axisFontStyle = { fontSize: 10, fill: theme.palette.text.secondary };

  return (
    <>
      <LineChart
        hideLegend
        grid={{ horizontal: true }}
        xAxis={[
          {
            scaleType: 'point',
            data: labels,
            disableLine: true,
            tickLabelStyle: axisFontStyle
          }
        ]}
        yAxis={[
          {
            disableLine: true,
            disableTicks: true,
            tickLabelStyle: axisFontStyle
          }
        ]}
        height={450}
        margin={{ top: 40, bottom: -5, right: 20, left: 5 }}
        series={visibleSeries
          .filter((s) => s.visible)
          .map((series) => ({
            type: 'line',
            data: series.data,
            label: series.label,
            showMark: series.showMark,
            area: series.area,
            id: series.id,
            color: series.color,
            stroke: series.color,
            strokeWidth: 2
          }))}
        sx={{
          '& .MuiAreaElement-series-Appointments-series': {
            fill: "url('#myGradient1')",
            strokeWidth: 2,
            opacity: 0.8
          },
          '& .MuiChartsAxis-directionX .MuiChartsAxis-tick': {
            stroke: theme.palette.divider
          }
        }}
      >
        <defs>
          <linearGradient id="myGradient1" gradientTransform="rotate(90)">
            <stop offset="10%" stopColor={alpha(theme.palette.primary.main, 0.4)} />
            <stop offset="90%" stopColor={alpha(theme.palette.background.default, 0.4)} />
          </linearGradient>
        </defs>
      </LineChart>

      <Legend items={visibleSeries} onToggle={toggleVisibility} />
    </>
  );
}

Legend.propTypes = {
  items: PropTypes.array,
  onToggle: PropTypes.func
};

IncomeAreaChart.propTypes = {
  yearlyData: PropTypes.array.isRequired
};
