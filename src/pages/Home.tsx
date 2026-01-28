import { useState, useEffect } from 'react'
import { Button } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { toast } from 'sonner'
import { TodaySalesCard, MonthComparisonCard } from '../components/sales/DashboardCards'
import { YearlySalesChart } from '../components/sales/YearlySalesChart'
import { TodaySalesList } from '../components/sales/TodaySalesList'
import { CreateSaleForm } from '../components/sales/CreateSaleForm'
import { getTodaySales, getMonthSales, getYearlySales, createSale, deleteSale } from '../services/sales'
import type {
  TodaySalesResponse,
  MonthSalesResponse,
  YearlySalesResponse,
  CreateSaleDTO,
  Sale,
} from '../types/sales'

export default function Home() {
  const [todaySales, setTodaySales] = useState<TodaySalesResponse | null>(null)
  const [monthSales, setMonthSales] = useState<MonthSalesResponse | null>(null)
  const [yearlySales, setYearlySales] = useState<YearlySalesResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      const [today, month, yearly] = await Promise.all([
        getTodaySales(),
        getMonthSales(),
        getYearlySales(),
      ])

      setTodaySales(today)
      setMonthSales(month)
      setYearlySales(yearly)
    } catch (error) {
      toast.error('Error al cargar los datos del dashboard')
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateSale = async (data: CreateSaleDTO) => {
    setIsSubmitting(true)
    try {
      await createSale(data)
      toast.success('Venta registrada exitosamente')
      setIsFormOpen(false)
      await loadDashboardData()
    } catch (error) {
      toast.error('Error al registrar la venta')
      console.error('Error creating sale:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSale = async (sale: Sale) => {
    if (!confirm(`¿Estás seguro de eliminar la venta #${sale.id} (${sale.item})?`)) {
      return
    }

    try {
      await deleteSale(sale.id)
      toast.success('Venta eliminada exitosamente')
      await loadDashboardData()
    } catch (error) {
      toast.error('Error al eliminar la venta')
      console.error('Error deleting sale:', error)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Ventas</h1>
          <p className="text-muted-foreground">
            Resumen de ventas y métricas principales
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          variant="contained"
          startIcon={<AddIcon />}
        >
          Registrar Venta
        </Button>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {todaySales && (
          <TodaySalesCard
            totalAmount={todaySales.totalAmount}
            salesCount={todaySales.salesCount}
            averageTicket={todaySales.averageTicket}
          />
        )}

        {monthSales && (
          <MonthComparisonCard
            currentMonth={monthSales.currentMonth}
            previousMonth={monthSales.previousMonth}
            comparison={monthSales.comparison}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Yearly Chart */}
      {yearlySales && (
        <YearlySalesChart data={yearlySales} isLoading={isLoading} />
      )}

      {/* Today's Sales List */}
      {todaySales && (
        <TodaySalesList
          sales={todaySales.sales}
          isLoading={isLoading}
          onDelete={handleDeleteSale}
        />
      )}

      {/* Create Sale Form Modal */}
      {isFormOpen && (
        <CreateSaleForm
          onSubmit={handleCreateSale}
          onCancel={() => setIsFormOpen(false)}
          isLoading={isSubmitting}
        />
      )}
    </div>
  )
}
