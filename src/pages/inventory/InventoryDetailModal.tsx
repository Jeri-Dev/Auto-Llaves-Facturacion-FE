import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Box, Typography, IconButton } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { formatPrice } from '../../utils/formatPrice'
import type { Inventory } from '../../types'

interface InventoryDetailModalProps {
  open: boolean
  item: Inventory | null
  onClose: () => void
}

export default function InventoryDetailModal({ open, item, onClose }: InventoryDetailModalProps) {
  if (!item) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Detalle del Item</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              ID
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              #{item.id}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Código
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {item.code}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Nombre
            </Typography>
            <Typography variant="body1">{item.name}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Precio
            </Typography>
            <Typography variant="body1">{formatPrice(item.price)}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Fecha de Creación
            </Typography>
            <Typography variant="body1">
              {new Date(item.createdAt).toLocaleDateString('es-DO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Última Actualización
            </Typography>
            <Typography variant="body1">
              {new Date(item.updatedAt).toLocaleDateString('es-DO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  )
}
