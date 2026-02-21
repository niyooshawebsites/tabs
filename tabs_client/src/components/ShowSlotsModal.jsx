import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Grid } from '@mui/material';

const ShowSlotsModal = ({ isOpen, onClose, title, slots, setIsShowSlotsModalOpen, setSelectedTime, setSlots, setHideServiceDetails }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      {title && <DialogTitle>{title}</DialogTitle>}

      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={3}>
          <Grid container spacing={2}>
            {slots.map((slot, index) => (
              <Grid item xs={4} key={index}>
                <Button
                  fullWidth
                  variant={slot.available ? 'contained' : 'outlined'}
                  disabled={!slot.available}
                  onClick={() => {
                    if (slot.available) {
                      setSelectedTime(`${slot.start} - ${slot.end}`);
                      setIsShowSlotsModalOpen(false);
                      setHideServiceDetails(false);
                    }
                  }}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    bgcolor: slot.available ? 'primary.main' : 'grey.300',
                    color: slot.available ? '#fff' : 'text.disabled',
                    cursor: slot.available ? 'pointer' : 'not-allowed',
                    '&:hover': {
                      bgcolor: slot.available ? 'primary.dark' : 'grey.300'
                    }
                  }}
                >
                  {slot.start} - {slot.end}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSlots([]);
            setIsShowSlotsModalOpen(false);
            onClose();
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShowSlotsModal;
