import { Grid, Button, CardMedia, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import avatar from 'assets/images/users/avatar-group.png';
import AnimateButton from 'components/@extended/AnimateButton';
import DashboardHeading from '../../components/DashboardHeading';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function Plan() {
  const { tenantId } = useSelector((state) => state.tenant_slice);
  const createSubscription = async (planType) => {
    let response;
    try {
      try {
        // Create order from backend
        response = await axios.post(`${import.meta.env.VITE_API_URL}create-order`, { planType }, { withCredentials: true });
      } catch (error) {
        // If access token expired → refresh
        if (error.response?.status === 401) {
          await axios.post(`${import.meta.env.VITE_API_URL}refresh-token`, {}, { withCredentials: true });

          // Retry original request
          response = await axios.post(`${import.meta.env.VITE_API_URL}create-order`, { planType }, { withCredentials: true });
        } else {
          throw error;
        }
      }

      const order = response.data.data;

      // Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'BYA.Online',
        description: `${planType} subscription`,
        order_id: order.id,

        handler: async function (response) {
          let verifyRes;
          try {
            // After payment, send details to backend for verification
            verifyRes = await axios.post(
              `${import.meta.env.VITE_API_URL}verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planType,
                userId: tenantId
              },
              { withCredentials: true }
            );
          } catch (error) {
            // If access token expired → refresh
            if (error.response?.status === 401) {
              await axios.post(`${import.meta.env.VITE_API_URL}refresh-token`, {}, { withCredentials: true });

              // Retry original request
              verifyRes = await axios.post(
                `${import.meta.env.VITE_API_URL}verify`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  planType,
                  userId: tenantId
                },
                { withCredentials: true }
              );
            } else {
              throw error;
            }
          }

          const { data } = verifyRes;

          alert(data.message);
        },

        prefill: {
          name: 'User Name',
          email: 'user@example.com'
        },
        theme: { color: '#3399cc' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Something went wrong!');
    }
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <DashboardHeading title="Plan Information" />
      </Grid>

      <Grid>
        {/* FREE PLAN */}
        <Grid item xs={12} md={4} lg={4}>
          <MainCard
            sx={{
              bgcolor: 'grey.50',
              p: 3,
              m: 2,
              border: '1px solid #ddd',
              borderRadius: 2
            }}
          >
            <Stack alignItems="center" spacing={2.5}>
              <CardMedia component="img" image={avatar} sx={{ width: 112 }} />
              <Stack alignItems="center">
                <Typography variant="h5">BYA.Online</Typography>
                <Typography variant="h5">Current Plan: FREE</Typography>
                <Typography variant="h6" color="secondary">
                  Appointments: 250/1000
                </Typography>
                <Typography variant="h6" color="secondary">
                  Clients: 100/500
                </Typography>
                <Typography variant="h5">Price: FREE</Typography>
              </Stack>

              <AnimateButton>
                <Button variant="contained" color="success" size="small" disabled>
                  Subscribed
                </Button>
              </AnimateButton>
            </Stack>
          </MainCard>
        </Grid>

        {/* MONTHLY PLAN */}
        <Grid item xs={12} md={4} lg={4}>
          <MainCard
            sx={{
              bgcolor: 'grey.50',
              p: 3,
              m: 2,
              border: '1px solid #ddd',
              borderRadius: 2
            }}
          >
            <Stack alignItems="center" spacing={2.5}>
              <CardMedia component="img" image={avatar} sx={{ width: 112 }} />
              <Stack alignItems="center">
                <Typography variant="h5">BYA.Online</Typography>
                <Typography variant="h5">Plan: Monthly</Typography>
                <Typography variant="h6" color="secondary">
                  Appointments: 250/Unlimited
                </Typography>
                <Typography variant="h6" color="secondary">
                  Clients: 100/Unlimited
                </Typography>
                <Typography variant="h6" color="secondary">
                  Expires On: 29/12/2025
                </Typography>
                <Typography variant="h5">Price: Rs 299/month</Typography>
              </Stack>

              <AnimateButton>
                <Button variant="contained" color="success" size="small" onClick={() => createSubscription('monthly')}>
                  Subscribe
                </Button>
              </AnimateButton>
            </Stack>
          </MainCard>
        </Grid>

        {/* ANNUAL PLAN */}
        <Grid item xs={12} md={4} lg={4}>
          <MainCard
            sx={{
              bgcolor: 'grey.50',
              p: 3,
              m: 2,
              border: '1px solid #ddd',
              borderRadius: 2
            }}
          >
            <Stack alignItems="center" spacing={2.5}>
              <CardMedia component="img" image={avatar} sx={{ width: 112 }} />
              <Stack alignItems="center">
                <Typography variant="h5">BYA.Online</Typography>
                <Typography variant="h5">Plan: Annual</Typography>
                <Typography variant="h6" color="secondary">
                  Appointments: 250/Unlimited
                </Typography>
                <Typography variant="h6" color="secondary">
                  Clients: 100/Unlimited
                </Typography>
                <Typography variant="h6" color="secondary">
                  Expires On: 19/12/2026
                </Typography>
                <Typography variant="h5">Price: Rs 2999/year</Typography>
              </Stack>

              <AnimateButton>
                <Button variant="contained" color="success" size="small" onClick={() => createSubscription('annual')}>
                  Subscribe
                </Button>
              </AnimateButton>
            </Stack>
          </MainCard>
        </Grid>
      </Grid>
    </Grid>
  );
}
