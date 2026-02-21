import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SearchModal from '../../../../components/SearchModal';
import { useState } from 'react';

export default function Search() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
      <Stack direction="row" sx={{ alignItems: 'center' }}>
        <Button size="small" color={'primary'} variant={'outlined'} onClick={() => setIsModalOpen(true)}>
          Search
        </Button>
        <SearchModal
          isOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Search Appointment or Client"
        />
      </Stack>
    </Box>
  );
}
