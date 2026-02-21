import { useState } from 'react';
import { Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, Paper, Stack, Grid } from '@mui/material';
import { LuFilter, LuFilterX } from 'react-icons/lu';
import { useSelector } from 'react-redux';

const AppointmentFilter = ({ setFilters, setIsFiltered, setPage, setStatus }) => {
  const [service, setService] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { services } = useSelector((state) => state.service_slice);

  const handleFilter = () => {
    setIsFiltered(true);
    setPage(1);

    setFilters({
      service,
      startDate,
      endDate,
      status
    });
  };

  return (
    <Grid container sx={{ width: '100%' }}>
      <Paper
        elevation={2}
        sx={{
          display: 'flex',
          justifyContent: 'start',
          alignItems: 'center',
          flexDirection: { xs: 'column', md: 'row' },
          p: 2,
          mb: 1,
          width: { xs: '100%', md: '100%' }
        }}
      >
        <Typography
          variant="h5"
          fontWeight={600}
          mb={2}
          sx={{
            width: { xs: '100%', md: '20%' }
          }}
        >
          Filters:
        </Typography>

        <Grid
          container
          sx={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flexDirection: { xs: 'column', md: 'row' },
            maxWidth: { xs: '100%', md: '80%' },
            flex: 1,
            spacing: 2
          }}
        >
          {/* Service */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth sx={{ minWidth: '100px' }}>
              <InputLabel>Service</InputLabel>
              <Select value={service} label="Service" onChange={(e) => setService(e.target.value)}>
                <MenuItem value="">
                  <em>Select Service</em>
                </MenuItem>

                {services.map((srv) => (
                  <MenuItem key={srv._id} value={srv._id}>
                    {srv.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Start Date */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Grid>

          {/* End Date */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Grid>

          {/* Appointment Status */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth sx={{ minWidth: '100px' }}>
              <InputLabel>Status</InputLabel>
              <Select label="Status" onChange={(e) => setStatus(e.target.value)} defaultValue="">
                <MenuItem value="">
                  <em>Select Status</em>
                </MenuItem>

                {['No-Show', 'Rescheduled', 'Cancelled', 'Pending', 'Confirmed', 'Completed'].map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Buttons */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }}>
              <Button variant="contained" color="primary" onClick={handleFilter} startIcon={<LuFilter />}>
                Filter
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setService('');
                  setStartDate('');
                  setEndDate('');
                  setStatus('');

                  setFilters({
                    service: '',
                    startDate: '',
                    endDate: '',
                    status: ''
                  });

                  setIsFiltered(false);
                  setPage(1);
                }}
                startIcon={<LuFilterX />}
              >
                Clear
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default AppointmentFilter;
