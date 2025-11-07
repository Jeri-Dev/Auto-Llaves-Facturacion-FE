import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from '../../utils/useDebounce'
import { formatPhone } from '../../utils/formatPhone'
import { useLoadingStore } from '../../store/loadingStore'
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  TextField,
  Card,
  CardContent,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material'
import { toast } from 'sonner'
import { getCustomersList } from '../../services/customer'
import type { Customer, PaginatedResponse } from '../../types'

export default function CustomerList() {
  const navigate = useNavigate()
  const { showLoading, hideLoading } = useLoadingStore()

  const [data, setData] = useState<PaginatedResponse<Customer>>()

  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [orderSort, setOrderSort] = useState<'asc' | 'desc'>('desc')

  const debouncedSearch = useDebounce(search, 600)

  useEffect(() => {
    const fetchCustomers = async () => {
      showLoading('Cargando clientes...')
      try {
        const data = await getCustomersList({
          page,
          max: rowsPerPage,
          search: debouncedSearch,
          startDate,
          endDate,
          orderSort,
        })

        setData(data)
      } catch {
        toast.error('Error al cargar los clientes')
      } finally {
        hideLoading()
      }

    }
    fetchCustomers()
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



  return (
    <Box>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" component="h1" fontWeight={600}>
          Clientes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/customers/new')}
          size="large"
        >
          Nuevo Cliente
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Buscar"
              placeholder="Buscar por nombre o documento"
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

      {data?.data.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No hay clientes registrados
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Nombre</strong></TableCell>
                  <TableCell><strong>Documento</strong></TableCell>
                  <TableCell><strong>Teléfono</strong></TableCell>
                  <TableCell><strong>Dirección</strong></TableCell>
                  <TableCell align="center"><strong>Acciones</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data.map((customer) => (
                  <TableRow
                    key={customer.id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        #{customer.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {customer.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{customer.document}</TableCell>
                    <TableCell>{customer.phone ? formatPhone(customer.phone) : '-'}</TableCell>
                    <TableCell>{customer.address || '-'}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/customers/edit/${customer.id}`)}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {data?.metadata && (
            <TablePagination
              component="div"
              count={data?.metadata.total}
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
