import { Breadcrumbs, Grid, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import MainCard from 'components/MainCard';
import DashboardHeading from '../../components/DashboardHeading';

export default function DashboardViewProfile() {
  const { legalName, gstNo, name, isDoctor, experience, proffessinalCourse, phone, altPhone, email, address, workingDays, timings } =
    useSelector((state) => state.admin_slice);
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Stack sx={{ gap: 3 }}>
          <DashboardHeading title="Profile Details" />

          <MainCard title="Business name">
            <Breadcrumbs aria-label="breadcrumb">
              <Typography variant="h6">{legalName || 'N/A'}</Typography>
            </Breadcrumbs>
          </MainCard>

          <MainCard title="GST No">
            <Breadcrumbs aria-label="breadcrumb">
              <Typography variant="h6">{gstNo || 'N/A'}</Typography>
            </Breadcrumbs>
          </MainCard>

          <MainCard title="Name">
            <Breadcrumbs aria-label="breadcrumb">
              <Typography variant="h6">{name || 'N/A'}</Typography>
            </Breadcrumbs>
          </MainCard>

          <MainCard title="Are you Doctor?">
            <Breadcrumbs aria-label="breadcrumb">
              <Typography variant="h6">{isDoctor || 'N/A'}</Typography>
            </Breadcrumbs>
          </MainCard>

          <MainCard title="Experience">
            <Breadcrumbs aria-label="breadcrumb">
              <Typography variant="h6">{`${experience} Years` || 'N/A'}</Typography>
            </Breadcrumbs>
          </MainCard>

          <MainCard title="Professional Course">
            <Breadcrumbs aria-label="breadcrumb">
              <Typography variant="h6">{proffessinalCourse || 'N/A'}</Typography>
            </Breadcrumbs>
          </MainCard>

          <MainCard title="Phone">
            <Breadcrumbs aria-label="breadcrumb">
              <Typography variant="h6">{phone || 'N/A'}</Typography>
            </Breadcrumbs>
          </MainCard>

          <MainCard title="Alternate phone">
            <Breadcrumbs aria-label="breadcrumb">
              <Typography variant="h6">{altPhone || 'N/A'}</Typography>
            </Breadcrumbs>
          </MainCard>

          <MainCard title="Email">
            <Breadcrumbs aria-label="breadcrumb">
              <Typography variant="h6">{email || 'N/A'}</Typography>
            </Breadcrumbs>
          </MainCard>

          <MainCard title="Address">
            <Breadcrumbs aria-label="breadcrumb">
              <Typography variant="h6">{address || 'N/A'}</Typography>
            </Breadcrumbs>
          </MainCard>

          <MainCard title="Working Days">
            <Breadcrumbs aria-label="breadcrumb">
              {Array.isArray(workingDays) && workingDays.length > 0 ? (
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                  {workingDays.map((day, index) => {
                    const validDay = typeof day === 'string' ? day : String(day);

                    return (
                      <Typography key={index} variant="h6">
                        {validDay.charAt(0).toUpperCase() + validDay.slice(1)}
                        {index !== workingDays.length - 1 && ', '}
                      </Typography>
                    );
                  })}
                </Stack>
              ) : (
                <Typography variant="h6">N/A</Typography>
              )}
            </Breadcrumbs>
          </MainCard>

          <MainCard title="Timings">
            <Breadcrumbs aria-label="breadcrumb">
              {!timings || typeof timings !== 'object' ? (
                <Typography variant="h6">N/A</Typography>
              ) : (
                <Stack spacing={1}>
                  {/* Shift Type */}
                  <Typography variant="h6">Shift Type: {timings.shiftType === 'full' ? 'Full Day' : 'Part Day'}</Typography>

                  {/* Full Day */}
                  {timings.shiftType === 'full' && (
                    <Typography variant="h6">
                      {timings.fullDay?.start && timings.fullDay?.end ? `${timings.fullDay.start} - ${timings.fullDay.end}` : 'N/A'}
                    </Typography>
                  )}

                  {/* Part Day */}
                  {timings.shiftType === 'part' && (
                    <Stack spacing={1}>
                      <Typography variant="h6">
                        Morning:{' '}
                        {timings.partDay?.morningStart && timings.partDay?.morningEnd
                          ? `${timings.partDay.morningStart} - ${timings.partDay.morningEnd}`
                          : 'N/A'}
                      </Typography>

                      <Typography variant="h6">
                        Evening:{' '}
                        {timings.partDay?.eveningStart && timings.partDay?.eveningEnd
                          ? `${timings.partDay.eveningStart} - ${timings.partDay.eveningEnd}`
                          : 'N/A'}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              )}
            </Breadcrumbs>
          </MainCard>
        </Stack>
      </Grid>
    </Grid>
  );
}
