import { useState, useEffect } from 'react'
import {
  Button,
  TextField,
  Box,
  Typography,
  Card,
  CardContent,
  Stack,

  InputAdornment,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material'
import {
  Search as SearchIcon,
  CalendarMonth as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Add as AddIcon
} from '@mui/icons-material'
import { toast } from 'sonner'
import { SalesByDayCard } from '../../components/sales/SalesByDayCard'
import { CreateSaleForm } from '../../components/sales/CreateSaleForm'
import { getSalesByDay, createSale, deleteSale } from '../../services/sales'
import type { SalesByDayResponse, CreateSaleDTO, Sale } from '../../types/sales'

export default function SalesPage() {
  const [salesData, setSalesData] = useState<SalesByDayResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [page, setPage] = useState(1)
  const [orderSort, setOrderSort] = useState<'asc' | 'desc'>('desc')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadSalesData()
  }, [page, orderSort])

  const loadSalesData = async () => {
    setIsLoading(true)
    try {
      const data = await getSalesByDay({
        page,
        max: 10,
        search: search || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        orderSort,
      })
      setSalesData(data)
    } catch (error) {
      toast.error('Error al cargar las ventas')
      console.error('Error loading sales:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    setPage(1)
    loadSalesData()
  }

  const handleClearFilters = () => {
    setSearch('')
    setStartDate('')
    setEndDate('')
    setPage(1)
    setTimeout(loadSalesData, 0)
  }

  const handleCreateSale = async (data: CreateSaleDTO) => {
    setIsSubmitting(true)
    try {
      await createSale(data)
      toast.success('Venta registrada exitosamente')
      setIsFormOpen(false)
      setPage(1)
      await loadSalesData()
    } catch (error) {
      toast.error('Error al registrar la venta')
      console.error('Error creating sale:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSale = async (sale: Sale) => {
    if (!confirm(`¿Estás seguro de eliminar la venta #${sale.id} (${sale.item})?`)) {
      return
    }

    try {
      await deleteSale(sale.id)
      toast.success('Venta eliminada exitosamente')
      await loadSalesData()
    } catch (error) {
      toast.error('Error al eliminar la venta')
      console.error('Error deleting sale:', error)
    }
  }

  return (
    <Box sx={{ py: 3, px: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Ventas por Día
          </Typography>
          <Typography color="text.secondary">
            Explora tus ventas agrupadas por día
          </Typography>
        </Box>
        <Button
          onClick={() => setIsFormOpen(true)}
          variant="contained"
          startIcon={<AddIcon />}
        >
          Registrar Venta
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
            {/* Search */}
            <TextField
              label="Buscar"
              placeholder="Buscar por item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Start Date */}
            <TextField
              label="Fecha inicio"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            {/* End Date */}
            <TextField
              label="Fecha fin"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Actions */}
            <Stack direction="row" spacing={1}>
              <Button
                onClick={handleSearch}
                variant="contained"
                fullWidth
              >
                Buscar
              </Button>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                fullWidth
              >
                Limpiar
              </Button>
            </Stack>
          </Box>

          {/* Order Toggle */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" component="span" sx={{ mr: 2 }}>
              Ordenar:
            </Typography>
            <ToggleButtonGroup
              value={orderSort}
              exclusive
              onChange={(_, value) => value && setOrderSort(value)}
              size="small"
            >
              <ToggleButton value="desc">
                Más reciente
              </ToggleButton>
              <ToggleButton value="asc">
                Más antigua
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography color="text.secondary" className="animate-pulse">
            Cargando ventas...
          </Typography>
        </Box>
      )}

      {/* Sales List */}
      {!isLoading && salesData && (
        <>
          {salesData.data.length === 0 ? (
            <Card>
              <CardContent sx={{ py: 6, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  No se encontraron ventas con los filtros aplicados
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Stack spacing={2}>
              {salesData.data.map((dayGroup) => (
                <SalesByDayCard
                  key={dayGroup.date}
                  dayGroup={dayGroup}
                  onDelete={handleDeleteSale}
                />
              ))}
            </Stack>
          )}

          {/* Pagination */}
          {salesData.metadata.totalPages > 1 && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Página {salesData.metadata.page} de{' '}
                    {salesData.metadata.totalPages} ({salesData.metadata.total}{' '}
                    días en total)
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={salesData.metadata.page === 1}
                      startIcon={<ChevronLeft />}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={
                        salesData.metadata.page ===
                        salesData.metadata.totalPages
                      }
                      endIcon={<ChevronRight />}
                    >
                      Siguiente
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Create Sale Form Modal */}
      {isFormOpen && (
        <CreateSaleForm
          onSubmit={handleCreateSale}
          onCancel={() => setIsFormOpen(false)}
          isLoading={isSubmitting}
        />
      )}
    </Box>
  )
}
