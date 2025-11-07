import { Card, CardContent, Stack, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'

interface InventoryFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  startDate: string
  onStartDateChange: (value: string) => void
  endDate: string
  onEndDateChange: (value: string) => void
  orderSort: 'asc' | 'desc'
  onOrderSortChange: (value: 'asc' | 'desc') => void
}

export default function InventoryFilters({
  search,
  onSearchChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  orderSort,
  onOrderSortChange,
}: InventoryFiltersProps) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Buscar"
            placeholder="Buscar por código o nombre"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Fecha Inicio"
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              label="Fecha Fin"
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth>
              <InputLabel>Orden</InputLabel>
              <Select
                value={orderSort}
                label="Orden"
                onChange={(e) => onOrderSortChange(e.target.value as 'asc' | 'desc')}
              >
                <MenuItem value="desc">Más recientes</MenuItem>
                <MenuItem value="asc">Más antiguos</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
