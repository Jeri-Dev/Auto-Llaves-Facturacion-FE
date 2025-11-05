import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useInvoiceStore } from '../../store/useInvoiceStore'
import { useCompanyStore } from '../../store/useCompanyStore'
import type { Invoice } from '../../types'
import dayjs from 'dayjs'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Grid as MuiGrid,
  CircularProgress,
  Chip,
} from '@mui/material'

const Grid = MuiGrid
import {
  ArrowBack as ArrowBackIcon,
  Print as PrintIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material'

const invoiceTypeLabels: Record<string, string> = {
  GOVERNMENTAL: 'Gubernamental',
  QUOTE: 'Cotización',
  CREDIT: 'Crédito Fiscal',
  BASIC: 'Básica',
  ENDCONSUMER: 'Consumidor Final',
}

const invoiceTypeColors: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'info'> = {
  GOVERNMENTAL: 'primary',
  QUOTE: 'info',
  CREDIT: 'success',
  BASIC: 'secondary',
  ENDCONSUMER: 'warning',
}

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getInvoiceById, loading } = useInvoiceStore()
  const { company, fetchCurrentCompany } = useCompanyStore()
  const [invoice, setInvoice] = useState<Invoice | null>(null)

  useEffect(() => {
    fetchCurrentCompany()
  }, [fetchCurrentCompany])

  useEffect(() => {
    if (id) {
      getInvoiceById(Number(id)).then(setInvoice).catch(console.error)
    }
  }, [id])

  const handlePrint = () => {
    window.print()
  }

  if (loading || !invoice) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" gap={2} mb={3} className="no-print">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/invoices')}
        >
          Volver
        </Button>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
        >
          Imprimir
        </Button>
      </Box>

      <Card>
        <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          <Stack alignItems={'center'}>
            <Typography variant='h5' sx={{
              color: '#137ec5',
              fontWeight: 800
            }}>{company?.name}</Typography>
            <Typography sx={{
              color: '#d02323',
              fontSize: '14px',
              fontWeight: 'bold',
              fontStyle: 'italic'
            }}>RNC. {company?.rnc}</Typography>
          </Stack>
          <Box sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <Typography sx={{
              fontSize: '14px',
              fontWeight: 'bold',
            }}>
              {company?.address.toUpperCase()}
            </Typography>
            <Typography sx={{
              fontSize: '14px',
              fontWeight: 'bold',
            }}>
              FECHA: {dayjs(invoice.createdAt).format('DD-MM-YYYY')}
            </Typography>
          </Box>
          <Box sx={{
            width: '100%',
            display: 'flex',
          }}>
            <Typography sx={{
              fontSize: '14px',
              fontWeight: 'bold',
            }}>
              TEL. {company?.phoneNumber}
            </Typography>
            {
              company?.secondPhoneNumber && (
                <Typography sx={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}>
                  {', CEL. '} {company?.secondPhoneNumber}
                </Typography>
              )
            }
          </Box>
          <Box sx={{
            width: '100%',
            paddingY: '2px',
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: '#a3a3a3',
            fontSize: '14px',
            fontWeight: 'bold',
          }}>
            FACTURA DE CREDITO FISCAL
          </Box>
          <Box sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'end'
          }}>
            <Typography sx={{
              fontSize: '14px',
              fontWeight: 'bold',
            }}>
              NCF: <span style={{
                fontStyle: 'italic', color: '#d02323',
              }}>{invoice.ncf}</span>
            </Typography>
          </Box>
          <Box sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'end'
          }}>
            <Typography sx={{
              fontSize: '12px',
              fontWeight: 'bold',
              fontStyle: 'italic',
              color: '#17557e'
            }}>
              VALIDA HASTA 31/12/2025
            </Typography>
          </Box>
          <Box width={'100%'}>
            <Typography>
              <strong>CLIENTE O RAZON SOCIAL: </strong>{invoice.customer?.name}
            </Typography>
          </Box>
          <Box width={'100%'}>
            <Typography>
              <strong>RNC / CEDULA: </strong>{invoice.document}
            </Typography>
          </Box>
          <Box width={'100%'}>
            <Typography>
              <strong>DIRECCION: </strong>{invoice.customer?.address || 'N/A'}
            </Typography>
          </Box>

          {/* Tabla de productos */}
          <TableContainer sx={{ width: '100%', mt: 2 }}>
            <Table size="small" sx={{ border: '1px solid #000' }}>
              <TableHead >
                <TableRow sx={{ bgcolor: '#a3a3a3' }} >
                  <TableCell align="center" sx={{ height: '50px', border: '1px solid #000', fontWeight: 'bold', fontSize: '12px', padding: '4px' }}>
                    CANT.
                  </TableCell>
                  <TableCell align="center" sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '12px', padding: '4px' }}>
                    CODIGO
                  </TableCell>
                  <TableCell align="center" sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '12px', padding: '4px' }}>
                    DESCRIPCION
                  </TableCell>
                  <TableCell align="center" sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '12px', padding: '4px' }}>
                    PRECIO UNITARIO
                  </TableCell>
                  <TableCell align="center" sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '12px', padding: '4px' }}>
                    IMPORTE SIN ITBIS
                  </TableCell>
                  <TableCell align="center" sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '12px', padding: '4px' }}>
                    ITBIS
                  </TableCell>
                  <TableCell align="center" sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '12px', padding: '4px' }}>
                    TOTAL
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoice.items.map((item, index) => {
                  const importeSinItbis = item.price * item.quantity
                  const itbis = importeSinItbis * 0.18
                  const total = importeSinItbis + itbis

                  return (
                    <TableRow key={index}>
                      <TableCell align="center" sx={{ border: '1px solid #000', fontSize: '12px', fontWeight: 'bold', padding: '4px' }}>
                        {item.quantity}
                      </TableCell>
                      <TableCell align="center" sx={{ border: '1px solid #000', fontSize: '12px', fontWeight: 'bold', padding: '4px' }}>
                        {/* Código vacío por ahora */}
                      </TableCell>
                      <TableCell sx={{ border: '1px solid #000', fontSize: '12px', fontWeight: 'bold', padding: '4px' }}>
                        {item.name}
                      </TableCell>
                      <TableCell align="right" sx={{ border: '1px solid #000', fontSize: '12px', fontWeight: 'bold', padding: '4px' }}>
                        {item.price.toFixed(2)}
                      </TableCell>
                      <TableCell align="right" sx={{ border: '1px solid #000', fontSize: '12px', fontWeight: 'bold', padding: '4px' }}>
                        {importeSinItbis.toFixed(2)}
                      </TableCell>
                      <TableCell align="right" sx={{ border: '1px solid #000', fontSize: '12px', fontWeight: 'bold', padding: '4px' }}>
                        {itbis.toFixed(2)}
                      </TableCell>
                      <TableCell align="right" sx={{ border: '1px solid #000', fontSize: '12px', fontWeight: 'bold', padding: '4px' }}>
                        {total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )
                })}

                <TableRow>

                  <TableCell colSpan={6} align="right" sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '12px', padding: '4px' }}>
                    SUB.TOTAL
                  </TableCell>
                  <TableCell align="right" sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '12px', padding: '4px' }}>
                    {invoice.subtotal.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={6} align="right" sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '12px', padding: '4px' }}>
                    ITBIS
                  </TableCell>
                  <TableCell align="right" sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '12px', padding: '4px' }}>
                    {invoice.taxes.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={6} align="right" sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '12px', padding: '4px' }}>
                    TOTAL
                  </TableCell>
                  <TableCell align="right" sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '12px', padding: '4px' }}>
                    {invoice.total.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            mt: 6,
            gap: 4
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: '150px'
            }}>
              <Box sx={{
                width: '100%',
                borderBottom: '1px dashed #000',
                mb: 1,
                height: '50px'
              }} />
              <Typography sx={{
                fontWeight: 'bold',
                fontSize: '13px',
                textAlign: 'center'
              }}>
                DESPACHADO
              </Typography>
            </Box>

            {/* Firma Derecha - RECIBIDO */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: '150px'
            }}>
              <Box sx={{
                width: '100%',
                borderBottom: '1px dashed #000',
                mb: 1,
                height: '50px'
              }} />
              <Typography sx={{
                fontWeight: 'bold',
                fontSize: '13px',
                textAlign: 'center'
              }}>
                RECIBIDO
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>


      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 1.5cm;
          }

          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          body * {
            visibility: hidden;
          }

          .MuiCard-root, .MuiCard-root * {
            visibility: visible;
          }

          .no-print {
            display: none !important;
          }

          .MuiCard-root {
            box-shadow: none !important;
            border: none !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 100%;
          }

          .MuiCardContent-root {
            padding: 1cm !important;
          }

          /* Forzar colores de fondo */
          .MuiBox-root {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Asegurar que las tablas no se corten entre páginas */
          table {
            page-break-inside: auto;
          }

          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
        }
      `}</style>
    </Box>
  )
}
