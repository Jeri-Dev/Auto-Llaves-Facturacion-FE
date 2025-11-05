import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack } from '@mui/material'
import dayjs from 'dayjs'
import type { Invoice } from '../../types'
import type { Company } from '../../types'
import { formatPrice } from '../../utils/formatPrice'
import { formatPhone } from '../../utils/formatPhone'

interface CreditFiscalInvoiceProps {
  invoice: Invoice
  company: Company | null
}

export default function CreditFiscalInvoice({ invoice, company }: CreditFiscalInvoiceProps) {
  return (
    <Stack sx={{ alignItems: 'center', width: '100%', gap: 2, mb: 4, pt: '40px' }}>
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
          TEL. {formatPhone(company?.phoneNumber)}
        </Typography>
        {
          company?.secondPhoneNumber && (
            <Typography sx={{
              fontSize: '14px',
              fontWeight: 'bold',
            }}>
              {', CEL. '} {formatPhone(company?.secondPhoneNumber)}
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
        border: '1px solid #000',
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
          <TableHead>
            <TableRow sx={{ bgcolor: '#a3a3a3' }}>
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
                  <TableCell align="right" sx={{ textWrap: 'nowrap', border: '1px solid #000', fontSize: '12px', fontWeight: 'bold', padding: '4px' }}>
                    {formatPrice(item.price)}
                  </TableCell>
                  <TableCell align="right" sx={{ textWrap: 'nowrap', border: '1px solid #000', fontSize: '12px', fontWeight: 'bold', padding: '4px' }}>
                    {formatPrice(importeSinItbis)}
                  </TableCell>
                  <TableCell align="right" sx={{ textWrap: 'nowrap', border: '1px solid #000', fontSize: '12px', fontWeight: 'bold', padding: '4px' }}>
                    {formatPrice(itbis)}
                  </TableCell>
                  <TableCell align="right" sx={{ textWrap: 'nowrap', border: '1px solid #000', fontSize: '12px', fontWeight: 'bold', padding: '4px' }}>
                    {formatPrice(total)}
                  </TableCell>
                </TableRow>
              )
            })}
            {
              Array.from({ length: Math.max(0, 10 - invoice.items.length) }).map((_, index) => (
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
                  <TableCell align="right" sx={{ textWrap: 'nowrap', border: '1px solid #000', fontSize: '12px', fontWeight: 'bold', padding: ' 4px' }}>              &nbsp;
                  </TableCell>
                  <TableCell align="right" sx={{ textWrap: 'nowrap', border: '1px solid #000', fontSize: '12px', fontWeight: 'bold', padding: '4px' }}>
                    &nbsp;
                  </TableCell>
                  <TableCell align="right" sx={{ textWrap: 'nowrap', border: '1px solid #000', fontSize: '12px', fontWeight: 'bold', padding: '4px' }}>
                    &nbsp;
                  </TableCell>
                  <TableCell align="right" sx={{ textWrap: 'nowrap', border: '1px solid #000', fontSize: '12px', fontWeight: 'bold', padding: '4px' }}>
                    &nbsp;
                  </TableCell>
                </TableRow>
              ))
            }

            <TableRow>
              <TableCell colSpan={6} align="right" sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '12px', padding: '4px' }}>
                SUB.TOTAL
              </TableCell>
              <TableCell align="right" sx={{ textWrap: 'nowrap', border: '1px solid #000', fontWeight: 'bold', fontSize: '12px', padding: '4px' }}>
                {formatPrice(invoice.subtotal)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={6} align="right" sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '12px', padding: '4px' }}>
                ITBIS
              </TableCell>
              <TableCell align="right" sx={{ textWrap: 'nowrap', border: '1px solid #000', fontWeight: 'bold', fontSize: '12px', padding: '4px' }}>
                {formatPrice(invoice.taxes)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={6} align="right" sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '12px', padding: '4px' }}>
                TOTAL
              </TableCell>
              <TableCell align="right" sx={{ textWrap: 'nowrap', border: '1px solid #000', fontWeight: 'bold', fontSize: '12px', padding: '4px' }}>
                {formatPrice(invoice.total)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}
