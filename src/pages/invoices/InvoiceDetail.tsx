import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useInvoiceStore } from '../../store/useInvoiceStore'
import { useCompanyStore } from '../../store/useCompanyStore'
import type { Invoice } from '../../types'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Print as PrintIcon,
} from '@mui/icons-material'
import CreditFiscalInvoice from '../../components/invoices/CreditFiscalInvoice'
import BasicInvoice from '../../components/invoices/BasicInvoice'

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

  // Determinar qué componente de factura renderizar según el tipo
  const renderInvoiceContent = () => {
    switch (invoice.type) {
      case 'BASIC':
        return <BasicInvoice invoice={invoice} company={company} />
      case 'CREDIT':
      case 'GOVERNMENTAL':
      case 'ENDCONSUMER':
      default:
        return <CreditFiscalInvoice invoice={invoice} company={company} />
    }
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
        <CardContent sx={{ p: 4, display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          {renderInvoiceContent()}

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

      {/* Print styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
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
