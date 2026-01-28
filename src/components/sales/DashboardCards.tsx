import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { formatPrice } from '../../utils/formatPrice'

interface TodaySalesCardProps {
  totalAmount: number
  salesCount: number
  averageTicket: number
  isLoading?: boolean
}

export function TodaySalesCard({
  totalAmount,
  salesCount,
  averageTicket,
  isLoading,
}: TodaySalesCardProps) {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-5 w-24 bg-gray-200 rounded" />
          <div className="h-5 w-5 bg-gray-200 rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Ventas de Hoy</CardTitle>
        <DollarSign className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-primary">
          {formatPrice(totalAmount)}
        </div>
        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
          <span>
            <strong className="text-foreground">{salesCount}</strong>{' '}
            {salesCount === 1 ? 'venta' : 'ventas'}
          </span>
          <span>•</span>
          <span>
            Ticket promedio: <strong className="text-foreground">{formatPrice(averageTicket)}</strong>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

interface MonthComparisonCardProps {
  currentMonth: {
    month: string
    year: number
    totalAmount: number
    salesCount: number
  }
  previousMonth: {
    month: string
    year: number
    totalAmount: number
  }
  comparison: {
    growth: number
    growthPercentage: number
    growthStatus: 'increase' | 'decrease'
  }
  isLoading?: boolean
}

export function MonthComparisonCard({
  currentMonth,
  previousMonth,
  comparison,
  isLoading,
}: MonthComparisonCardProps) {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-5 w-32 bg-gray-200 rounded" />
          <div className="h-5 w-5 bg-gray-200 rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </CardContent>
      </Card>
    )
  }

  const isPositive = comparison.growthStatus === 'increase'

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {currentMonth.month} {currentMonth.year}
        </CardTitle>
        {isPositive ? (
          <TrendingUp className="h-5 w-5 text-green-600" />
        ) : (
          <TrendingDown className="h-5 w-5 text-red-600" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-primary">
          {formatPrice(currentMonth.totalAmount)}
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          <span>
            <strong className="text-foreground">{currentMonth.salesCount}</strong>{' '}
            {currentMonth.salesCount === 1 ? 'venta' : 'ventas'}
          </span>
        </div>
        <div className="mt-3 pt-3 border-t">
          <div className="text-xs text-muted-foreground">
            vs {previousMonth.month}: {formatPrice(previousMonth.totalAmount)}
          </div>
          <div
            className={`text-sm font-semibold mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'
              }`}
          >
            {isPositive ? '+' : ''}
            {comparison.growthPercentage}% ({isPositive ? '+' : ''}
            {formatPrice(comparison.growth)})
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
