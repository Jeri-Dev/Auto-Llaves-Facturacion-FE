import { useState } from 'react'
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Button,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'
import type { SalesByDayGroup, Sale } from '../../types/sales'
import { formatPrice } from '../../utils/formatPrice'

interface SalesByDayCardProps {
  dayGroup: SalesByDayGroup
  onDelete?: (sale: Sale) => void
}

export function SalesByDayCard({ dayGroup, onDelete }: SalesByDayCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formattedDate = new Date(dayGroup.date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Card>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ textTransform: 'capitalize', mb: 1 }}>
              {formattedDate}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Total: <Typography component="span" sx={{ fontWeight: 600, fontSize: '1.125rem', color: 'text.primary' }}>
                  {formatPrice(dayGroup.totalAmount)}
                </Typography>
              </Typography>
              <Typography variant="body2" color="text.secondary">•</Typography>
              <Typography variant="body2" color="text.secondary">
                <Typography component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {dayGroup.salesCount}
                </Typography>{' '}
                {dayGroup.salesCount === 1 ? 'venta' : 'ventas'}
              </Typography>
            </Box>
          </Box>
          <Button
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
            startIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            {isExpanded ? 'Ocultar' : 'Ver detalles'}
          </Button>
        </Box>
      </Box>

      <Collapse in={isExpanded}>
        <CardContent>
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
                {dayGroup.sales.map((sale) => (
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
        </CardContent>
      </Collapse>
    </Card>
  )
}
