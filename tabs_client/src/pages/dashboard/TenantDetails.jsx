import { Grid, Stack, Typography, Box, Button } from '@mui/material';
import DashboardHeading from '../../components/DashboardHeading';
import { useNavigate } from 'react-router';

export default function DashboardViewProfile() {
  const [tenant, setTenant] = useState({
    legalName: '',
    gstNo: '',
    name: '',
    isDoctor: '',
    experience: '',
    proffessinalCourse: '',
    phone: '',
    altPhone: '',
    email: '',
    address: '',
    workingDays: '',
    timings: ''
  });
  const navigate = useNavigate();

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 12 }}>
        <Stack sx={{ gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <DashboardHeading title="Profile Details" />
            <Button
              sx={{ p: 1 }}
              onClick={() => {
                navigate('/dashboard/settings/profile/update');
              }}
            >
              Edit
            </Button>
          </Box>

          <Box className="details">
            <Typography variant="h6" className="details-heading">
              Legal Business name
            </Typography>
            <Typography variant="h6">{legalName || 'N/A'}</Typography>
          </Box>

          <Box className="details">
            <Typography variant="h6" className="details-heading">
              GST No
            </Typography>
            <Typography variant="h6">{gstNo || 'N/A'}</Typography>
          </Box>

          <Box className="details">
            <Typography variant="h6" className="details-heading">
              Name
            </Typography>
            <Typography variant="h6">{name || 'N/A'}</Typography>
          </Box>

          <Box className="details">
            <Typography variant="h6" className="details-heading">
              Are you Doctor?
            </Typography>
            <Typography variant="h6">{isDoctor || 'N/A'}</Typography>
          </Box>

          <Box className="details">
            <Typography variant="h6" className="details-heading">
              Experience
            </Typography>
            <Typography variant="h6">{`${experience} Years` || 'N/A'}</Typography>
          </Box>

          <Box className="details">
            <Typography variant="h6" className="details-heading">
              Professional Course
            </Typography>
            <Typography variant="h6">{proffessinalCourse || 'N/A'}</Typography>
          </Box>

          <Box className="details">
            <Typography variant="h6" className="details-heading">
              Phone
            </Typography>
            <Typography variant="h6">{phone || 'N/A'}</Typography>
          </Box>

          <Box className="details">
            <Typography variant="h6" className="details-heading">
              Alternate phone
            </Typography>
            <Typography variant="h6">{altPhone || 'N/A'}</Typography>
          </Box>

          <Box className="details">
            <Typography variant="h6" className="details-heading">
              Email
            </Typography>
            <Typography variant="h6">{email || 'N/A'}</Typography>
          </Box>

          <Box className="details">
            <Typography variant="h6" className="details-heading">
              Address
            </Typography>
            <Typography variant="h6">{address || 'N/A'}</Typography>
          </Box>

          <Box className="details">
            <Typography variant="h6" className="details-heading">
              Working Days
            </Typography>
            <Typography variant="h6">
              {' '}
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
            </Typography>
          </Box>

          <Box className="details">
            <Typography variant="h6" className="details-heading">
              Timings
            </Typography>
            <Typography variant="h6">
              {' '}
              {!timings || typeof timings !== 'object' ? (
                <Typography variant="h6">N/A</Typography>
              ) : (
                <Stack spacing={1}>
                  {/* Shift Type */}
                  <Typography variant="h6">
                    <span className="details-heading">Shift Type:</span> {timings.shiftType === 'full' ? 'Full Day' : 'Part Day'}
                  </Typography>

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
            </Typography>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
}
