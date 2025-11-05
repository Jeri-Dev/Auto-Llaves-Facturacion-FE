import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { format } from 'date-fns'
import { useInvoiceStore } from '../../store/useInvoiceStore'
import { useCustomerStore } from '../../store/useCustomerStore'
import { useDebounce } from '../../utils/useDebounce'
import { InvoiceType, type InvoiceItem } from '../../types'
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
  const { createInvoice, loading } = useInvoiceStore()
  const { customers, fetchCustomers } = useCustomerStore()
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [customerSearch, setCustomerSearch] = useState('')
  const debouncedCustomerSearch = useDebounce(customerSearch, 600)

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

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
      }
    },
  })

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const calculateTaxes = () => {
    // Las facturas BASIC no tienen ITBIS
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

  const requiresCustomer = ['GOVERNMENTAL', 'QUOTE', 'CREDIT'].includes(formik.values.type)
  const requiresCustomerName = formik.values.type === 'BASIC'

  // Filter customers based on debounced search
  const filteredCustomers = customers.filter((customer) => {
    const searchLower = debouncedCustomerSearch.toLowerCase()
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.document.toLowerCase().includes(searchLower)
    )
  })

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

              {requiresCustomer && (
                <Autocomplete
                  fullWidth
                  options={filteredCustomers}
                  getOptionLabel={(option) => `${option.document} - ${option.name}`}
                  value={customers.find((c) => c.id === formik.values.customerId) || null}
                  onChange={(_, newValue) => {
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
                    <Typography fontWeight={500}>RD$ {calculateSubtotal().toFixed(2)}</Typography>
                  </Box>
                  {formik.values.type !== InvoiceType.BASIC && (
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography color="text.secondary">ITBIS (18%):</Typography>
                      <Typography fontWeight={500}>RD$ {calculateTaxes().toFixed(2)}</Typography>
                    </Box>
                  )}

                  <Divider sx={{ mb: 2 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" fontWeight={700}>Total:</Typography>
                    <Typography variant="h6" fontWeight={700}>RD$ {calculateTotal().toFixed(2)}</Typography>
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
