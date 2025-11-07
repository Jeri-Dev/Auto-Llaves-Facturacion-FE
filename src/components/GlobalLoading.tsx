import { CircularProgress, Backdrop, Typography, Box } from '@mui/material';
import { useLoadingStore } from '../store/loadingStore';

export const GlobalLoading = () => {
  const { isLoading, message } = useLoadingStore();

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
      open={isLoading}
    >
      <CircularProgress color="inherit" size={60} />
      {message && (
        <Box>
          <Typography variant="h6" component="div">
            {message}
          </Typography>
        </Box>
      )}
    </Backdrop>
  );
};
