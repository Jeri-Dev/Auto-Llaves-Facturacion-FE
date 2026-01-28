import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import type { MonthlySale } from '../../types/sales'
import { formatPrice } from '../../utils/formatPrice'

interface YearlySalesChartProps {
  data: MonthlySale[]
  isLoading?: boolean
}

export function YearlySalesChart({ data, isLoading }: YearlySalesChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ventas Últimos 12 Meses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">
              Cargando gráfico...
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const maxValue = Math.max(...data.map((item) => item.totalAmount))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas Últimos 12 Meses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex items-end justify-between gap-2">
          {data.map((item, index) => {
            const heightPercentage = (item.totalAmount / maxValue) * 100

            return (
              <div
                key={`${item.month}-${item.year}-${index}`}
                className="flex-1 flex flex-col items-center group"
              >
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 text-center">
                  <p className="text-xs font-semibold whitespace-nowrap">
                    {formatPrice(item.totalAmount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.salesCount} {item.salesCount === 1 ? 'venta' : 'ventas'}
                  </p>
                </div>

                {/* Bar */}
                <div
                  className="w-full bg-primary hover:bg-primary/80 transition-colors rounded-t-md min-h-5 relative"
                  style={{ height: `${Math.max(heightPercentage, 5)}%` }}
                />

                {/* Label */}
                <p className="text-xs text-muted-foreground mt-2 text-center whitespace-nowrap">
                  {item.month.substring(0, 3)}
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  {item.year}
                </p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
