import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatPercent } from '../../utils/format'
import { chart } from '../../utils/themeColors'
import { Card, CardBody, CardHeader } from '../ui/Card'

export function DeliveryPerformanceChart({ data }) {
  return (
    <Card className="fleet-chart-enter h-full">
      <CardHeader title="Delivery performance" description="Last 7 days — delivered vs delayed" />
      <CardBody className="h-72 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chart.grid} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: `1px solid ${chart.grid}`, fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="delivered" fill={chart.primary} radius={[6, 6, 0, 0]} name="Delivered" />
            <Bar dataKey="delayed" fill={chart.delayed} radius={[6, 6, 0, 0]} name="Delayed" />
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  )
}

export function FleetOverviewChart({ stats }) {
  const data = [
    { name: 'Utilization', value: stats.avgFleetUtilization },
    { name: 'Fuel score', value: stats.fuelEfficiencyScore },
    { name: 'On-time', value: stats.onTimeDeliveryRate },
  ]

  return (
    <Card className="fleet-chart-enter h-full [animation-delay:220ms]">
      <CardHeader title="Fleet performance" description="Operational KPI index (0–100)" />
      <CardBody className="h-72 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="fleetGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chart.primary} stopOpacity={0.4} />
                <stop offset="100%" stopColor={chart.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chart.grid} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(v) => formatPercent(Number(v), 1)}
              contentStyle={{ borderRadius: 12, border: `1px solid ${chart.grid}`, fontSize: 12 }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={chart.primary}
              strokeWidth={2}
              fill="url(#fleetGrad)"
              name="Score"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  )
}
