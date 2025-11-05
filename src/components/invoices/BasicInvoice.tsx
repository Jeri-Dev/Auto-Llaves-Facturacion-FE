import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack } from '@mui/material'
import dayjs from 'dayjs'
import type { Invoice } from '../../types'
import type { Company } from '../../types'
import { formatPrice } from '../../utils/formatPrice'

interface BasicInvoiceProps {
  invoice: Invoice
  company: Company | null
}

export default function BasicInvoice({ invoice, company }: BasicInvoiceProps) {
  return (
    <Stack sx={{ alignItems: 'center', width: '100%', gap: 2, mb: 4 }}>
      {/* Header */}
      <Stack alignItems={'center'}>
        <Typography variant='h5' sx={{
          color: '#137ec5',
          fontWeight: 800
        }}>{company?.name}</Typography>
      </Stack>

      <Box sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
      }}>

        <Typography sx={{
          fontSize: '14px',
          fontWeight: 'bold',
        }}>
          FECHA: {dayjs(invoice.createdAt).format('DD-MM-YYYY')}
        </Typography>
      </Box>

      <Box sx={{
        width: '100%',
        paddingY: '2px',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#a3a3a3',
        fontSize: '14px',
        fontWeight: 'bold',
        border: '1px solid #000'
      }}>
        FACTURA
      </Box>

      <Box width={'100%'}>
        <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
          CLIENTE: {invoice.customer?.name || invoice.customerName || 'Cliente General'}
        </Typography>
      </Box>

      {/* Tabla de productos */}
      <TableContainer sx={{ width: '100%', mt: 2 }}>
        <Table size="small" sx={{ border: '1px solid #000' }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#a3a3a3' }}>
              <TableCell align="center" sx={{ height: '50px', border: '1px solid #000', fontWeight: 'bold', fontSize: '12px', padding: '4px' }}>
                CANT.
              </TableCell>
              <TableCell align="center" sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '12px', padding: '4px' }}>
                DESCRIPCION
              </TableCell>
              <TableCell align="center" sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '12px', padding: '4px' }}>
                PRECIO UNITARIO
              </TableCell>
              <TableCell align="center" sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '12px', padding: '4px' }}>
                TOTAL
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoice.items.map((item, index) => {
              const total = item.price * item.quantity

              return (
                <TableRow key={index}>
                  <TableCell align="center" sx={{ border: '1px solid #000', fontSize: '12px', fontWeight: 'bold', padding: '4px' }}>
                    {item.quantity}
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #000', fontSize: '12px', fontWeight: 'bold', padding: '4px' }}>
                    {item.name}
                  </TableCell>
                  <TableCell align="right" sx={{ border: '1px solid #000', fontSize: '12px', fontWeight: 'bold', padding: '4px' }}>
                    {formatPrice(item.price)}
                  </TableCell>
                  <TableCell align="right" sx={{ border: '1px solid #000', fontSize: '12px', fontWeight: 'bold', padding: '4px' }}>
                    {formatPrice(total)}
                  </TableCell>
                </TableRow>
              )
            })}
            {
              Array.from({ length: Math.max(0, 4 - invoice.items.length) }).map((_, index) => (
                <TableRow key={index + invoice.items.length}>
                  <TableCell align="center" sx={{ border: '1px solid #000', fontSize: '12px', fontWeight: 'bold', padding: '4px', height: '24px' }}>
                    &nbsp;
                  </TableCell>
                  <TableCell align="center" sx={{ border: '1px solid #000', fontSize: '12px', fontWeight: 'bold', padding: '4px' }}>
                    &nbsp;
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #000', fontSize: '12px', fontWeight: 'bold', padding: '4px' }}>
                    &nbsp;
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #000', fontSize: '12px', fontWeight: 'bold', padding: '4px' }}>
                    &nbsp;
                  </TableCell>

                </TableRow>
              ))
            }

            <TableRow>
              <TableCell colSpan={3} align="right" sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '12px', padding: '4px' }}>
                TOTAL
              </TableCell>
              <TableCell align="right" sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '12px', padding: '4px' }}>
                {formatPrice(invoice.total)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}
