import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Box,
  Typography,
  IconButton,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import type { CreateInventoryDTO } from '../../types'

interface InventoryFormModalProps {
  open: boolean
  isEditMode: boolean
  onClose: () => void
  formData: CreateInventoryDTO
  onFormDataChange: (data: CreateInventoryDTO) => void
  formErrors: Record<string, string>
  submitting: boolean
  onSubmit: () => void
}

export default function InventoryFormModal({
  open,
  isEditMode,
  onClose,
  formData,
  onFormDataChange,
  formErrors,
  submitting,
  onSubmit,
}: InventoryFormModalProps) {
  const handleCodeChange = (value: string) => {
    const upperValue = value.toUpperCase()
    if (upperValue.length <= 4) {
      onFormDataChange({ ...formData, code: upperValue })
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{isEditMode ? 'Editar Item' : 'Nuevo Item'}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Código"
            placeholder="Ej: A001"
            value={formData.code}
            onChange={(e) => handleCodeChange(e.target.value)}
            error={!!formErrors.code}
            helperText={formErrors.code || 'El código debe tener 4 caracteres'}
            inputProps={{ maxLength: 4 }}
          />
          <TextField
            fullWidth
            label="Nombre"
            placeholder="Nombre del item"
            value={formData.name}
            onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
            error={!!formErrors.name}
            helperText={formErrors.name}
          />
          <TextField
            fullWidth
            label="Precio"
            type="number"
            placeholder="0.00"
            value={formData.price || ''}
            onChange={(e) => onFormDataChange({ ...formData, price: parseFloat(e.target.value) || 0 })}
            error={!!formErrors.price}
            helperText={formErrors.price}
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button onClick={onSubmit} variant="contained" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
