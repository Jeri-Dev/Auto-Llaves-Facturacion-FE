import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'
import type { Inventory } from '../../types'

interface DeleteConfirmDialogProps {
  open: boolean
  item: Inventory | null
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirmDialog({ open, item, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      sx={{
        '& .MuiDialog-paper': { width: '600px', height: '300px' },
      }}
    >
      <DialogTitle>Confirmar Eliminación</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Estás seguro de que deseas eliminar el item <strong>{item?.name}</strong> ({item?.code})?
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={2}>
          Esta acción no se puede deshacer.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancelar</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
