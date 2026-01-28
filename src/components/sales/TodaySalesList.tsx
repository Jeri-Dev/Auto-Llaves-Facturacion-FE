import {
  Card,

  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box
} from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import type { Sale } from '../../types/sales'
import { formatPrice } from '../../utils/formatPrice'

interface TodaySalesListProps {
  sales: Sale[]
  isLoading?: boolean
  onDelete?: (sale: Sale) => void
}

export function TodaySalesList({ sales, isLoading, onDelete }: TodaySalesListProps) {
  if (isLoading) {
    return (
      <Card>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Ventas de Hoy
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 256 }}>
            <Typography color="text.secondary" className="animate-pulse">
              Cargando ventas...
            </Typography>
          </Box>
        </Box>
      </Card>
    )
  }

  if (sales.length === 0) {
    return (
      <Card>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Ventas de Hoy
          </Typography>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No hay ventas registradas hoy
            </Typography>
          </Box>
        </Box>
      </Card>
    )
  }

  return (
    <Card>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Ventas de Hoy ({sales.length})
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Hora</TableCell>
                {onDelete && <TableCell align="right">Acciones</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell sx={{ fontWeight: 500 }}>#{sale.id}</TableCell>
                  <TableCell>{sale.item}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell>{formatPrice(sale.price)}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {formatPrice(sale.total)}
                  </TableCell>
                  <TableCell>
                    {new Date(sale.createdAt).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  {onDelete && (
                    <TableCell align="right">
                      <IconButton
                        onClick={() => onDelete(sale)}
                        title="Eliminar"
                        size="small"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Card>
  )
}
