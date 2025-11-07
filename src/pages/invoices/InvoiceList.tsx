import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { useDebounce } from '../../utils/useDebounce'
import { formatPrice } from '../../utils/formatPrice'
import { useLoadingStore } from '../../store/loadingStore'
import { InvoiceType, type Invoice, type PaginatedResponse } from '../../types'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Chip,
  Card,
  CardContent,
  Stack,
} from '@mui/material'
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material'
import { toast } from 'sonner'
import { getInvoicesList } from '../../services/invoice'

const INVOICE_TYPE_LABELS: Record<InvoiceType, string> = {
  [InvoiceType.GOVERNMENTAL]: 'Gubernamental',
  [InvoiceType.QUOTE]: 'Cotización',
  [InvoiceType.CREDIT]: 'Crédito Fiscal',
  [InvoiceType.BASIC]: 'Básica',
  [InvoiceType.ENDCONSUMER]: 'Consumidor Final',
}

const INVOICE_TYPE_COLORS: Record<InvoiceType, 'primary' | 'secondary' | 'success' | 'warning' | 'info'> = {
  [InvoiceType.GOVERNMENTAL]: 'primary',
  [InvoiceType.QUOTE]: 'info',
  [InvoiceType.CREDIT]: 'success',
  [InvoiceType.BASIC]: 'secondary',
  [InvoiceType.ENDCONSUMER]: 'warning',
}

export default function InvoiceList() {
  const navigate = useNavigate()
  const { showLoading, hideLoading } = useLoadingStore()

  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [orderSort, setOrderSort] = useState<'asc' | 'desc'>('desc')

  const [invoices, setInvoices] = useState<PaginatedResponse<Invoice>>()

  const debouncedSearch = useDebounce(search, 600)

  useEffect(() => {

    console.log('hola')

    const fetchInvoices = async () => {
      showLoading('Cargando facturas...')
      try {
        const data = await getInvoicesList({
          page,
          endDate,
          max: rowsPerPage, orderSort, search, startDate
        })

        setInvoices(data)
      }
      catch {
        toast.error('Hubo un error al buscar las facturas')
      }
      finally {
        hideLoading()
      }
    }

    fetchInvoices()

  }, [page, rowsPerPage, debouncedSearch, startDate, endDate, orderSort])

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

  const getCustomerName = (invoice: Invoice) => {
    if (invoice.customer) return invoice.customer.name
    if (invoice.customerName) return invoice.customerName
    return 'Consumidor Final'
  }

  return (
    <Box>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" component="h1" fontWeight={600}>
          Facturas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/invoices/new')}
          size="large"
        >
          Nueva Factura
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Buscar"
              placeholder="Buscar por cliente, tipo o ID"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Fecha Inicio"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value)
                  handleDateChange()
                }}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                label="Fecha Fin"
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value)
                  handleDateChange()
                }}
                InputLabelProps={{ shrink: true }}
              />

              <FormControl fullWidth>
                <InputLabel>Orden</InputLabel>
                <Select
                  value={orderSort}
                  label="Orden"
                  onChange={(e) => {
                    setOrderSort(e.target.value as 'asc' | 'desc')
                    setPage(1)
                  }}
                >
                  <MenuItem value="desc">Más recientes</MenuItem>
                  <MenuItem value="asc">Más antiguos</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {invoices?.data.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No hay facturas registradas
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Cliente</strong></TableCell>
                  <TableCell><strong>Tipo</strong></TableCell>
                  <TableCell align="right"><strong>Subtotal</strong></TableCell>
                  <TableCell align="right"><strong>ITBIS</strong></TableCell>
                  <TableCell align="right"><strong>Total</strong></TableCell>
                  <TableCell><strong>Fecha</strong></TableCell>
                  <TableCell align="center"><strong>Acciones</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices?.data.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    hover
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/invoices/${invoice.id}`)}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        #{invoice.id}
                      </Typography>
                    </TableCell>
                    <TableCell>{getCustomerName(invoice)}</TableCell>
                    <TableCell>
                      <Chip
                        label={INVOICE_TYPE_LABELS[invoice.type]}
                        color={INVOICE_TYPE_COLORS[invoice.type]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {formatPrice(invoice.subtotal)}
                    </TableCell>
                    <TableCell align="right">
                      {formatPrice(invoice.taxes)}
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        {formatPrice(invoice.total)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {format(new Date(invoice.createdAt), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => navigate(`/invoices/${invoice.id}`)}
                      >
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {invoices?.metadata && (
            <TablePagination
              component="div"
              count={invoices.metadata.total}
              page={page - 1}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          )}
        </Paper>
      )}
    </Box>
  )
}
