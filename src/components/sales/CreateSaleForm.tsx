import { useState, useEffect } from 'react'
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  Box
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import type { CreateSaleDTO } from '../../types/sales'

interface CreateSaleFormProps {
  onSubmit: (data: CreateSaleDTO) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function CreateSaleForm({
  onSubmit,
  onCancel,
  isLoading,
}: CreateSaleFormProps) {
  const [formData, setFormData] = useState<CreateSaleDTO>({
    item: '',
    quantity: 1,
    price: 0,
    total: 0,
  })

  // Calculate total when quantity or price changes
  useEffect(() => {
    const newTotal = formData.quantity * formData.price
    if (newTotal !== formData.total) {
      setFormData((prev) => ({ ...prev, total: newTotal }))
    }
  }, [formData.quantity, formData.price])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const handleChange = (field: keyof CreateSaleDTO, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={true} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Registrar Venta
        <IconButton onClick={onCancel} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
          <Stack spacing={3}>
            <TextField
              label="Item"
              value={formData.item}
              onChange={(e) => handleChange('item', e.target.value)}
              placeholder="Nombre del producto o servicio"
              required
              fullWidth
            />

            <TextField
              label="Cantidad"
              type="number"
              inputProps={{ step: 1, min: 1 }}
              value={formData.quantity}
              onChange={(e) =>
                handleChange('quantity', parseInt(e.target.value) || 1)
              }
              required
              fullWidth
            />

            <TextField
              label="Precio Unitario"
              type="number"
              inputProps={{ step: 0.01, min: 0 }}
              value={formData.price}
              onChange={(e) =>
                handleChange('price', parseFloat(e.target.value) || 0)
              }
              placeholder="0.00"
              required
              fullWidth
            />

            <TextField
              label="Total"
              type="number"
              value={formData.total.toFixed(2)}
              disabled
              fullWidth
              sx={{
                '& .MuiInputBase-input': {
                  fontWeight: 600,
                  fontSize: '1.125rem'
                }
              }}
              helperText="Calculado automáticamente (Cantidad × Precio)"
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading || !formData.item || formData.price <= 0}
        >
          {isLoading ? 'Registrando...' : 'Registrar Venta'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
