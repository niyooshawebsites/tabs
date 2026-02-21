import { useState, useEffect } from 'react';
import { Button, Grid, Stack, Typography, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import IncomeAreaChart from './IncomeAreaChart';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function UniqueVisitorCard() {
  const [view, setView] = useState('monthly');
  const [yearlyData, setYearlyData] = useState([]);
  const [loadingYearly, setLoadingYearly] = useState(false);
  const { tenantId } = useSelector((state) => state.tenant_slice);

  const fetchYearlyAppointments = async (year) => {
    try {
      setLoadingYearly(true);

      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}fetch-yearly-appointments`, {
        params: { uid: tenantId, year },
        withCredentials: true
      });

      setYearlyData(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingYearly(false);
    }
  };

  useEffect(() => {
    fetchYearlyAppointments(new Date().getFullYear());
  }, []);

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid>
          <Typography variant="h5">Appointments</Typography>
        </Grid>

        <Grid>
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <Button
              size="small"
              onClick={() => setView('monthly')}
              color={view === 'monthly' ? 'primary' : 'secondary'}
              variant={view === 'monthly' ? 'outlined' : 'text'}
            >
              Month
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Card Containing Chart */}
      <MainCard content={false} sx={{ mt: 1.5 }}>
        <Box sx={{ pt: 1, pr: 2 }}>
          <IncomeAreaChart view={view} yearlyData={yearlyData} loading={loadingYearly} />
        </Box>
      </MainCard>
    </>
  );
}
