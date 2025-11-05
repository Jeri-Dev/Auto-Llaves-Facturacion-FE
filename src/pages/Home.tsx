import { Link } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
  Paper,
} from '@mui/material'
import {
  Receipt as ReceiptIcon,
  People as PeopleIcon,
} from '@mui/icons-material'

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box textAlign="center" mb={8}>
        <Typography variant="h3" component="h1" fontWeight={700} mb={2}>
          Sistema de Facturación
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Gestiona tus facturas y clientes de manera sencilla y profesional
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
        <Card elevation={2} sx={{ flex: 1 }}>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderRadius: 2,
                }}
              >
                <ReceiptIcon fontSize="large" />
              </Paper>
              <Box>
                <Typography variant="h5" component="h2" fontWeight={600}>
                  Facturas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gestión de facturación
                </Typography>
              </Box>
            </Box>

            <Typography variant="body1" color="text.secondary" mb={3}>
              Crea y gestiona facturas de diferentes tipos: gubernamental, crédito fiscal,
              cotizaciones, básicas y consumidor final.
            </Typography>

            <Box display="flex" gap={2}>
              <Button
                component={Link}
                to="/invoices/new"
                variant="contained"
                size="large"
              >
                Crear Factura
              </Button>
              <Button
                component={Link}
                to="/invoices"
                variant="outlined"
                size="large"
              >
                Ver Listado
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={2} sx={{ flex: 1 }}>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: 'secondary.main',
                  color: 'white',
                  borderRadius: 2,
                }}
              >
                <PeopleIcon fontSize="large" />
              </Paper>
              <Box>
                <Typography variant="h5" component="h2" fontWeight={600}>
                  Clientes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gestión de clientes
                </Typography>
              </Box>
            </Box>

            <Typography variant="body1" color="text.secondary" mb={3}>
              Administra tu base de datos de clientes con información completa
              incluyendo RNC, teléfono y dirección.
            </Typography>

            <Box display="flex" gap={2}>
              <Button
                component={Link}
                to="/customers/new"
                variant="contained"
                size="large"
              >
                Crear Cliente
              </Button>
              <Button
                component={Link}
                to="/customers"
                variant="outlined"
                size="large"
              >
                Ver Listado
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}
