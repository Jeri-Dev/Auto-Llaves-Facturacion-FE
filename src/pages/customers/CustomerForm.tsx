import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useCustomerStore } from '../../store/useCustomerStore'
import { useCompanyStore } from '../../store/useCompanyStore'
import { useDebounce } from '../../utils/useDebounce'
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

  const { createCustomer, updateCustomer, getCustomerById, loading } = useCustomerStore()
  const { getRncData } = useCompanyStore()
  const [loadingRnc, setLoadingRnc] = useState(false)
  const [rncSearchTerm, setRncSearchTerm] = useState('')
  const debouncedRncSearch = useDebounce(rncSearchTerm, 600)

  const formik = useFormik({
    initialValues: {
      name: '',
      document: '',
      phone: '',
      address: '',
    },
    validationSchema: customerSchema,
    onSubmit: async (values) => {
      try {
        if (isEditing) {
          await updateCustomer(Number(id), values)
        } else {
          await createCustomer(values)
        }
        navigate('/customers')
      } catch (error) {
        console.error('Error guardando cliente:', error)
      }
    },
  })

  useEffect(() => {
    if (isEditing && id) {
      getCustomerById(Number(id)).then((customer) => {
        formik.setValues({
          name: customer.name,
          document: customer.document,
          phone: customer.phone || '',
          address: customer.address || '',
        })
      })
    }
  }, [id, isEditing])

  const handleSearchRnc = async () => {
    if (!formik.values.document) return

    setLoadingRnc(true)
    try {
      const rncData = await getRncData(formik.values.document)
      formik.setFieldValue('name', rncData.name)
      if (rncData.tradeName) {
        formik.setFieldValue('name', rncData.tradeName)
      }
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ingrese el teléfono"
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
                  disabled={loading || !formik.isValid}
                >
                  {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
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
