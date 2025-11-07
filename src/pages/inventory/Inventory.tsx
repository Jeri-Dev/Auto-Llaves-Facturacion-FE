import { useEffect, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { toast } from 'sonner'
import { useDebounce } from '../../utils/useDebounce'
import { useLoadingStore } from '../../store/loadingStore'
import {
  getInventoryList,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
} from '../../services/inventory'
import type { Inventory, PaginatedResponse, CreateInventoryDTO } from '../../types'
import InventoryFilters from './InventoryFilters'
import InventoryTable from './InventoryTable'
import InventoryFormModal from './InventoryFormModal'
import InventoryDetailModal from './InventoryDetailModal'
import DeleteConfirmDialog from './DeleteConfirmDialog'

export default function InventoryPage() {
  const { showLoading, hideLoading } = useLoadingStore()
  const [data, setData] = useState<PaginatedResponse<Inventory>>()

  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [orderSort, setOrderSort] = useState<'asc' | 'desc'>('desc')

  const debouncedSearch = useDebounce(search, 600)

  const [formModalOpen, setFormModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingItem, setEditingItem] = useState<Inventory | null>(null)
  const [formData, setFormData] = useState<CreateInventoryDTO>({
    code: '',
    name: '',
    price: 0,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [detailItem, setDetailItem] = useState<Inventory | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<Inventory | null>(null)

  useEffect(() => {
    fetchInventory()
  }, [page, rowsPerPage, debouncedSearch, startDate, endDate, orderSort])

  const fetchInventory = async () => {
    showLoading('Cargando inventario...')
    try {
      const data = await getInventoryList({
        page,
        max: rowsPerPage,
        search: debouncedSearch,
        startDate,
        endDate,
        orderSort,
      })
      setData(data)
    } catch {
      toast.error('Error al cargar el inventario')
    } finally {
      hideLoading()
    }
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage + 1)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleDateChange = () => {
    setPage(1)
  }

  const openCreateModal = () => {
    setFormData({ code: '', name: '', price: 0 })
    setFormErrors({})
    setIsEditMode(false)
    setEditingItem(null)
    setFormModalOpen(true)
  }

  const openEditModal = (item: Inventory) => {
    setFormData({
      code: item.code,
      name: item.name,
      price: item.price,
    })
    setFormErrors({})
    setIsEditMode(true)
    setEditingItem(item)
    setFormModalOpen(true)
  }

  const closeFormModal = () => {
    setFormModalOpen(false)
    setIsEditMode(false)
    setEditingItem(null)
    setFormData({ code: '', name: '', price: 0 })
    setFormErrors({})
  }

  // Detail Modal
  const openDetailModal = async (item: Inventory) => {
    try {
      const fullItem = await getInventoryById(item.id)
      setDetailItem(fullItem)
      setDetailModalOpen(true)
    } catch {
      toast.error('Error al cargar los detalles del item')
    }
  }

  const closeDetailModal = () => {
    setDetailModalOpen(false)
    setDetailItem(null)
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.code.trim()) {
      errors.code = 'El código es requerido'
    } else if (formData.code.length !== 4) {
      errors.code = 'El código debe tener 4 caracteres'
    }

    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido'
    }

    if (formData.price <= 0) {
      errors.price = 'El precio debe ser mayor a 0'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setSubmitting(true)
    try {
      if (isEditMode && editingItem) {
        await updateInventory(editingItem.id, formData)
        toast.success('Item actualizado exitosamente')
      } else {
        await createInventory(formData)
        toast.success('Item creado exitosamente')
      }
      closeFormModal()
      fetchInventory()
    } catch {
      toast.error('Error al guardar el item')
    } finally {
      setSubmitting(false)
    }
  }

  // Delete Dialog
  const openDeleteDialog = (item: Inventory) => {
    setItemToDelete(item)
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return

    try {
      await deleteInventory(itemToDelete.id)
      toast.success('Item eliminado exitosamente')
      closeDeleteDialog()
      fetchInventory()
    } catch {
      toast.error('Error al eliminar el item')
    }
  }

  return (
    <Box>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" component="h1" fontWeight={600}>
          Inventario
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateModal} size="large">
          Nuevo Item
        </Button>
      </Box>

      <InventoryFilters
        search={search}
        onSearchChange={handleSearchChange}
        startDate={startDate}
        onStartDateChange={(value) => {
          setStartDate(value)
          handleDateChange()
        }}
        endDate={endDate}
        onEndDateChange={(value) => {
          setEndDate(value)
          handleDateChange()
        }}
        orderSort={orderSort}
        onOrderSortChange={(value) => {
          setOrderSort(value)
          setPage(1)
        }}
      />

      <InventoryTable
        data={data}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        onView={openDetailModal}
        onEdit={openEditModal}
        onDelete={openDeleteDialog}
      />

      <InventoryFormModal
        open={formModalOpen}
        isEditMode={isEditMode}
        onClose={closeFormModal}
        formData={formData}
        onFormDataChange={setFormData}
        formErrors={formErrors}
        submitting={submitting}
        onSubmit={handleSubmit}
      />

      <InventoryDetailModal open={detailModalOpen} item={detailItem} onClose={closeDetailModal} />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        item={itemToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteDialog}
      />
    </Box>
  )
}
