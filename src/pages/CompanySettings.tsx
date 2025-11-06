import { createCompany, getCompany, updateCompany } from '../services/company'
import { maskPhone, unmaskPhone } from '../utils/formatPhone'
import { useEffect, useState } from 'react'
import type { Company } from '../types'
import { useFormik } from 'formik'
import { toast } from 'sonner'
import * as Yup from 'yup'
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
  CircularProgress,
} from '@mui/material'
import {
  Business as BusinessIcon,
  Save as SaveIcon,
} from '@mui/icons-material'
import { delay } from '../utils/delay'

const companySchema = Yup.object({
  name: Yup.string().required('El nombre es requerido'),
  rnc: Yup.string().required('El RNC es requerido'),
  address: Yup.string().required('La dirección es requerida'),
  phoneNumber: Yup.string().required('El teléfono es requerido'),
  secondPhoneNumber: Yup.string(),
  nextGovernmentalNCF: Yup.string().required('El NCF Gubernamental es requerido'),
  nextCreditNCF: Yup.string().required('El NCF de Crédito Fiscal es requerido'),
  nextEndConsumerNCF: Yup.string().required('El NCF de Consumidor Final es requerido'),
  nextQuoteNumber: Yup.number().required('El número de cotización es requerido').min(1),
})

export default function CompanySettings() {

  const [company, setCompany] = useState<Company>()
  const [formLoading, setFormLoading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    const fetchCompany = async () => {
      await delay(500)
      try {
        const data = await getCompany()
        setCompany(data)
      } catch {
        toast.error('Hubo un error al obtener la informacion')
      } finally {
        setLoading(false)

      }
    }

    void fetchCompany()
  }, [])

  const formik = useFormik({
    initialValues: {
      name: company?.name || '',
      rnc: company?.rnc || '',
      address: company?.address || '',
      phoneNumber: company?.phoneNumber || '',
      secondPhoneNumber: company?.secondPhoneNumber || '',
      nextGovernmentalNCF: company?.nextGovernmentalNCF || '',
      nextCreditNCF: company?.nextCreditNCF || '',
      nextEndConsumerNCF: company?.nextEndConsumerNCF || '',
      nextQuoteNumber: company?.nextQuoteNumber ? parseInt(company.nextQuoteNumber) : 1,
    },
    validationSchema: companySchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setFormLoading(true)
      try {
        const dataToSave = {
          ...values,
          phoneNumber: unmaskPhone(values.phoneNumber),
          secondPhoneNumber: values.secondPhoneNumber ? unmaskPhone(values.secondPhoneNumber) : ''
        }

        if (company) {
          updateCompany(dataToSave)
        } else {
          await createCompany(dataToSave)
        }
      } catch (error) {
        console.error('Error guardando empresa:', error)
      } finally {
        setFormLoading(false)

      }
    },
  })

  return (
    <Box>
      <Box mb={3} display="flex" alignItems="center" gap={2}>
        <BusinessIcon fontSize="large" color="primary" />
        <Box>
          <Typography variant="h4" component="h1" fontWeight={600}>
            Configuración de Empresa
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Administra la información de tu empresa y secuencias de NCF
          </Typography>
        </Box>
      </Box>

      {
        loading ? <Stack>
          <Box display="flex" justifyContent="center" alignItems="center" width={'100%'} minHeight={'50vh'}>
            <CircularProgress size={60} />
          </Box>
        </Stack> : <Card>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={4}>
                <Box>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Información General
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Stack spacing={3}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                      <TextField
                        fullWidth
                        label="Nombre de la Empresa *"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                      />

                      <TextField
                        fullWidth
                        label="RNC *"
                        name="rnc"
                        value={formik.values.rnc}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.rnc && Boolean(formik.errors.rnc)}
                        helperText={formik.touched.rnc && formik.errors.rnc}
                      />
                    </Stack>

                    <TextField
                      fullWidth
                      label="Dirección *"
                      name="address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.address && Boolean(formik.errors.address)}
                      helperText={formik.touched.address && formik.errors.address}
                      multiline
                      rows={2}
                    />

                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                      <TextField
                        fullWidth
                        label="Teléfono Principal *"
                        name="phoneNumber"
                        value={formik.values.phoneNumber}
                        onChange={(e) => {
                          const maskedValue = maskPhone(e.target.value)
                          formik.setFieldValue('phoneNumber', maskedValue)
                        }}
                        onBlur={formik.handleBlur}
                        error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                        helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                        placeholder="809-456-7890"
                        inputProps={{ maxLength: 12 }}
                      />

                      <TextField
                        fullWidth
                        label="Teléfono Secundario"
                        name="secondPhoneNumber"
                        value={formik.values.secondPhoneNumber}
                        onChange={(e) => {
                          const maskedValue = maskPhone(e.target.value)
                          formik.setFieldValue('secondPhoneNumber', maskedValue)
                        }}
                        onBlur={formik.handleBlur}
                        placeholder="809-456-7890"
                        inputProps={{ maxLength: 12 }}
                      />
                    </Stack>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Secuencias de Comprobantes Fiscales (NCF)
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Stack spacing={3}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                      <TextField
                        fullWidth
                        label="Próximo NCF Gubernamental *"
                        name="nextGovernmentalNCF"
                        value={formik.values.nextGovernmentalNCF}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.nextGovernmentalNCF && Boolean(formik.errors.nextGovernmentalNCF)}
                        helperText={formik.touched.nextGovernmentalNCF && formik.errors.nextGovernmentalNCF}
                        placeholder="B0100000001"
                      />

                      <TextField
                        fullWidth
                        label="Próximo NCF Crédito Fiscal *"
                        name="nextCreditNCF"
                        value={formik.values.nextCreditNCF}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.nextCreditNCF && Boolean(formik.errors.nextCreditNCF)}
                        helperText={formik.touched.nextCreditNCF && formik.errors.nextCreditNCF}
                        placeholder="B0100000001"
                      />
                    </Stack>

                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                      <TextField
                        fullWidth
                        label="Próximo NCF Consumidor Final *"
                        name="nextEndConsumerNCF"
                        value={formik.values.nextEndConsumerNCF}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.nextEndConsumerNCF && Boolean(formik.errors.nextEndConsumerNCF)}
                        helperText={formik.touched.nextEndConsumerNCF && formik.errors.nextEndConsumerNCF}
                        placeholder="B0200000001"
                      />

                      <TextField
                        fullWidth
                        type="number"
                        label="Próximo Número de Cotización *"
                        name="nextQuoteNumber"
                        value={formik.values.nextQuoteNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.nextQuoteNumber && Boolean(formik.errors.nextQuoteNumber)}
                        helperText={formik.touched.nextQuoteNumber && formik.errors.nextQuoteNumber}
                      />
                    </Stack>
                  </Stack>
                </Box>

                <Box display="flex" gap={2} justifyContent="flex-end" pt={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<SaveIcon />}
                    disabled={formLoading}
                  >
                    {formLoading ? 'Guardando...' : company ? 'Actualizar Configuración' : 'Crear Empresa'}
                  </Button>
                </Box>
              </Stack>
            </form>
          </CardContent>
        </Card>
      }
    </Box>
  )
}
