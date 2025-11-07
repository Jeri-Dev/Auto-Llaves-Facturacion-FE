import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { maskPhone, unmaskPhone } from '../../utils/formatPhone'
import { useLoadingStore } from '../../store/loadingStore'
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  InputAdornment,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import { createCustomer, getCustomerById, updateCustomer } from '../../services/customer'
import { toast } from 'sonner'
import { getRncData } from '../../services/miscellaneous'

const customerSchema = Yup.object({
  name: Yup.string().required('El nombre es requerido'),
  document: Yup.string().required('El documento es requerido'),
  phone: Yup.string(),
  address: Yup.string(),
})

export default function CustomerForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const { showLoading, hideLoading } = useLoadingStore()

  const [loadingRnc, setLoadingRnc] = useState(false)

  const formik = useFormik({
    initialValues: {
      name: '',
      document: '',
      phone: '',
      address: '',
    },
    validationSchema: customerSchema,
    onSubmit: async (values) => {
      showLoading(isEditing ? 'Actualizando cliente...' : 'Creando cliente...')
      try {
        const dataToSave = {
          ...values,
          phone: unmaskPhone(values.phone)
        }

        if (isEditing) {
          await updateCustomer(Number(id), dataToSave)
        } else {
          await createCustomer(dataToSave)
        }
        navigate('/customers')
      } catch (error) {
        console.error('Error guardando cliente:', error)
      } finally {
        hideLoading()
      }
    },
  })

  useEffect(() => {
    if (isEditing && id) {
      const fetchCustomer = async () => {
        showLoading('Cargando cliente...')
        try {
          const customer = await getCustomerById(Number(id))
          formik.setValues({
            name: customer.name,
            document: customer.document,
            phone: customer.phone || '',
            address: customer.address || '',
          })
        } catch (error) {
          console.error('Error cargando cliente:', error)
          toast.error('Error al cargar el cliente')
        } finally {
          hideLoading()
        }
      }
      fetchCustomer()
    }
  }, [])

  const handleSearchRnc = async () => {
    if (!formik.values.document) return

    setLoadingRnc(true)
    try {
      const rncData = await getRncData(formik.values.document)
      formik.setFieldValue('name', rncData.business_name)

    } catch (error) {
      console.error('Error consultando RNC:', error)
      alert('No se encontró información para este RNC')
    } finally {
      setLoadingRnc(false)
    }
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/customers')}
        sx={{ mb: 3 }}
      >
        Volver
      </Button>

      <Card sx={{ maxWidth: 800, mx: 'auto' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" fontWeight={600} mb={1}>
            {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            {isEditing ? 'Actualiza la información del cliente' : 'Registra un nuevo cliente'}
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="RNC / Cédula *"
                name="document"
                value={formik.values.document}
                onChange={formik.handleChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleSearchRnc()
                  }
                }}
                onBlur={formik.handleBlur}
                placeholder="Ingrese RNC o cédula"
                error={formik.touched.document && Boolean(formik.errors.document)}
                helperText={formik.touched.document && formik.errors.document}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleSearchRnc}
                        disabled={!formik.values.document || loadingRnc}
                        edge="end"
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Nombre *"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ingrese el nombre"
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />

              <TextField
                fullWidth
                label="Teléfono"
                name="phone"
                value={formik.values.phone}
                onChange={(e) => {
                  const maskedValue = maskPhone(e.target.value)
                  formik.setFieldValue('phone', maskedValue)
                }}
                onBlur={formik.handleBlur}
                placeholder="809-456-7890"
                inputProps={{ maxLength: 12 }}
              />

              <TextField
                fullWidth
                label="Dirección"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ingrese la dirección"
                multiline
                rows={2}
              />

              <Box display="flex" gap={2} mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={!formik.isValid}
                >
                  {isEditing ? 'Actualizar' : 'Crear'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/customers')}
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
