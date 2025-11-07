import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { format } from 'date-fns'
import { formatPrice } from '../../utils/formatPrice'
import { useLoadingStore } from '../../store/loadingStore'
import { InvoiceType, type InvoiceItem, type Customer, type PaginatedResponse, type Inventory } from '../../types'
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Typography,
  IconButton,
  Paper,
  Divider,
  FormHelperText,
  Stack,
  Autocomplete,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { toast } from 'sonner'
import { getCustomersList } from '../../services/customer'
import { createInvoice } from '../../services/invoice'
import { getInventoryList } from '../../services/inventory'

const invoiceSchema = Yup.object({
  type: Yup.string().required('El tipo de factura es requerido'),
  customerId: Yup.number().when('type', {
    is: (val: string) => ['GOVERNMENTAL', 'QUOTE', 'CREDIT'].includes(val),
    then: (schema) => schema.required('Debe seleccionar un cliente'),
    otherwise: (schema) => schema.notRequired(),
  }),
  customerName: Yup.string().when('type', {
    is: 'BASIC',
    then: (schema) => schema.required('El nombre del cliente es requerido'),
    otherwise: (schema) => schema.notRequired(),
  }),
  items: Yup.array().min(1, 'Debe agregar al menos un producto'),
  createdAt: Yup.string().required('La fecha es requerida'),
})

export default function CreateInvoice() {
  const navigate = useNavigate()
  const { showLoading, hideLoading } = useLoadingStore()
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [customerSearch, setCustomerSearch] = useState<string | undefined>()
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const [customers, setCustomers] = useState<PaginatedResponse<Customer>>()
  const [loading, setLoading] = useState<boolean>(false)

  const [inventorySearch, setInventorySearch] = useState<string | undefined>()
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<Inventory | null>(null)
  const [inventoryItems, setInventoryItems] = useState<PaginatedResponse<Inventory>>()
  const [loadingInventory, setLoadingInventory] = useState<boolean>(false)

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true)
      try {
        const data = await getCustomersList({
          search: customerSearch
        })

        setCustomers(data)
      }
      catch {
        toast.error('Hubo un error al buscar los clientes')
      }
      finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(() => {
      fetchCustomers()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [customerSearch])

  useEffect(() => {
    const fetchInventory = async () => {
      setLoadingInventory(true)
      try {
        const data = await getInventoryList({
          search: inventorySearch
        })

        setInventoryItems(data)
      }
      catch {
        toast.error('Hubo un error al buscar el inventario')
      }
      finally {
        setLoadingInventory(false)
      }
    }

    const timeoutId = setTimeout(() => {
      fetchInventory()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [inventorySearch])


  const formik = useFormik({
    initialValues: {
      type: '' as InvoiceType,
      customerId: undefined as number | undefined,
      customerName: '',
      items: [] as InvoiceItem[],
      createdAt: format(new Date(), 'yyyy-MM-dd'),
    },
    validationSchema: invoiceSchema,
    onSubmit: async (values) => {
      showLoading('Creando factura...')
      try {
        await createInvoice({
          type: values.type,
          customerId: values.customerId,
          customerName: values.customerName || undefined,
          items: items,
          createdAt: values.createdAt,
        })
        navigate('/invoices')
      } catch (error) {
        console.error('Error creando factura:', error)
      } finally {
        hideLoading()
      }
    },
  })

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const calculateTaxes = () => {
    if (formik.values.type === InvoiceType.BASIC) {
      return 0
    }
    return calculateSubtotal() * 0.18
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxes()
  }

  const addItem = () => {
    const newItem: InvoiceItem = {
      name: '',
      price: 0,
      quantity: 1,
    }
    setItems([...items, newItem])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
    formik.setFieldValue('items', newItems)
  }

  const addItemFromInventory = (inventoryItem: Inventory | null) => {
    if (!inventoryItem) return

    const newItem: InvoiceItem = {
      name: inventoryItem.name,
      price: inventoryItem.price,
      quantity: 1,
    }

    setItems([...items, newItem])
    formik.setFieldValue('items', [...items, newItem])
    setSelectedInventoryItem(null)
    setInventorySearch(undefined)
    toast.success(`Item "${inventoryItem.name}" agregado`)
  }

  const requiresCustomer = ['GOVERNMENTAL', 'QUOTE', 'CREDIT'].includes(formik.values.type)
  const requiresCustomerName = formik.values.type === 'BASIC'


  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/invoices')}
        sx={{ mb: 3 }}
      >
        Volver
      </Button>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" fontWeight={600} mb={1}>
            Nueva Factura
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Crea una nueva factura en el sistema
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <FormControl
                  fullWidth
                  error={formik.touched.type && Boolean(formik.errors.type)}
                >
                  <InputLabel>Tipo de Factura *</InputLabel>
                  <Select
                    name="type"
                    value={formik.values.type}
                    label="Tipo de Factura *"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="">Seleccione un tipo</MenuItem>
                    <MenuItem value={InvoiceType.GOVERNMENTAL}>Gubernamental</MenuItem>
                    <MenuItem value={InvoiceType.QUOTE}>Cotización</MenuItem>
                    <MenuItem value={InvoiceType.CREDIT}>Crédito Fiscal</MenuItem>
                    <MenuItem value={InvoiceType.BASIC}>Básica</MenuItem>
                    <MenuItem value={InvoiceType.ENDCONSUMER}>Consumidor Final</MenuItem>
                  </Select>
                  {formik.touched.type && formik.errors.type && (
                    <FormHelperText>{formik.errors.type}</FormHelperText>
                  )}
                </FormControl>

                <TextField
                  fullWidth
                  label="Fecha *"
                  name="createdAt"
                  type="date"
                  value={formik.values.createdAt}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>

              {requiresCustomer && customers && (
                <Autocomplete
                  fullWidth
                  options={customers.data}
                  getOptionLabel={(option) => `${option.document} - ${option.name}`}
                  value={selectedCustomer}
                  onChange={(_, newValue) => {
                    setSelectedCustomer(newValue)
                    formik.setFieldValue('customerId', newValue?.id)
                  }}
                  onInputChange={(_, newInputValue) => {
                    setCustomerSearch(newInputValue)
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Cliente *"
                      error={formik.touched.customerId && Boolean(formik.errors.customerId)}
                      helperText={formik.touched.customerId && formik.errors.customerId as string}
                      placeholder="Buscar por nombre o documento"
                    />
                  )}
                  noOptionsText="No se encontraron clientes"
                  filterOptions={(x) => x}
                  isOptionEqualToValue={(option, value) => option.id === value?.id}
                />
              )}

              {requiresCustomerName && (
                <TextField
                  fullWidth
                  label="Nombre del Cliente *"
                  name="customerName"
                  value={formik.values.customerName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Ingrese el nombre del cliente"
                  error={formik.touched.customerName && Boolean(formik.errors.customerName)}
                  helperText={formik.touched.customerName && formik.errors.customerName}
                />
              )}

              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Productos *
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addItem}
                    size="small"
                  >
                    Agregar Producto
                  </Button>
                </Box>

                {inventoryItems && (
                  <Paper sx={{ p: 2, mb: 2, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                    <Typography variant="body2" fontWeight={600} mb={2}>
                      Agregar por código o nombre
                    </Typography>
                    <Autocomplete
                      fullWidth
                      size="small"

                      options={inventoryItems.data}
                      getOptionLabel={(option) => `${option.code} - ${option.name}`}
                      value={selectedInventoryItem}
                      onChange={(_, newValue) => {
                        addItemFromInventory(newValue)
                      }}
                      onInputChange={(_, newInputValue) => {
                        setInventorySearch(newInputValue)
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Buscar producto"
                          placeholder="Buscar por código o nombre"
                        />
                      )}
                      noOptionsText="No se encontraron productos"
                      filterOptions={(x) => x}
                      isOptionEqualToValue={(option, value) => option.id === value?.id}
                      loading={loadingInventory}
                    />
                  </Paper>
                )}

                {items.length === 0 ? (
                  <Paper sx={{ p: 4, textAlign: 'center', border: '2px dashed', borderColor: 'divider' }}>
                    <Typography color="text.secondary">
                      No hay productos agregados
                    </Typography>
                  </Paper>
                ) : (
                  <Stack spacing={2}>
                    {items.map((item, index) => (
                      <Paper key={index} sx={{ p: 2 }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                          <TextField
                            fullWidth
                            size="small"
                            label="Nombre del producto"
                            value={item.name}
                            onChange={(e) => updateItem(index, 'name', e.target.value)}
                            sx={{ flex: 2 }}
                          />
                          <TextField
                            fullWidth
                            size="small"
                            type="number"
                            label="Precio"
                            value={item.price === 0 ? '' : item.price}
                            onChange={(e) => {
                              const value = e.target.value
                              updateItem(index, 'price', value === '' ? 0 : parseFloat(value))
                            }}
                            sx={{ flex: 1 }}
                            inputProps={{ step: '0.01', min: '0' }}
                          />
                          <TextField
                            fullWidth
                            size="small"
                            type="number"
                            label="Cantidad"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            sx={{ flex: 1 }}
                          />
                          <IconButton
                            color="error"
                            onClick={() => removeItem(index)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                )}
                {formik.touched.items && formik.errors.items && (
                  <FormHelperText error sx={{ mt: 1 }}>
                    {formik.errors.items as string}
                  </FormHelperText>
                )}
              </Box>

              <Divider />

              <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Box maxWidth={400} ml="auto">
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography color="text.secondary">Subtotal:</Typography>
                    <Typography fontWeight={500}>{formatPrice(calculateSubtotal())}</Typography>
                  </Box>
                  {formik.values.type !== InvoiceType.BASIC && (
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography color="text.secondary">ITBIS (18%):</Typography>
                      <Typography fontWeight={500}>{formatPrice(calculateTaxes())}</Typography>
                    </Box>
                  )}

                  <Divider sx={{ mb: 2 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" fontWeight={700}>Total:</Typography>
                    <Typography variant="h6" fontWeight={700}>{formatPrice(calculateTotal())}</Typography>
                  </Box>
                </Box>
              </Paper>

              <Box display="flex" gap={2}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading || items.length === 0}
                >
                  {loading ? 'Creando...' : 'Crear Factura'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/invoices')}
                >
                  Cancelar
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
