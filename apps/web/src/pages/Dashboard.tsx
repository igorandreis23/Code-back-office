import { Header } from '@/components/layout/Header'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  GitBranch,
  DollarSign,
  Download,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const revenueData = [
  { month: 'Jan', receita: 62000, despesa: 38000 },
  { month: 'Fev', receita: 71000, despesa: 42000 },
  { month: 'Mar', receita: 68000, despesa: 39000 },
  { month: 'Abr', receita: 84000, despesa: 44000 },
  { month: 'Mai', receita: 91000, despesa: 47000 },
  { month: 'Jun', receita: 88000, despesa: 45000 },
  { month: 'Jul', receita: 97000, despesa: 51000 },
]

const workflowData = [
  { name: 'Onboarding', atrasados: 3, no_prazo: 18 },
  { name: 'Análise', atrasados: 1, no_prazo: 12 },
  { name: 'Contrato', atrasados: 5, no_prazo: 9 },
  { name: 'Pós-atend.', atrasados: 2, no_prazo: 21 },
  { name: 'Cobrança', atrasados: 7, no_prazo: 14 },
]

const statusData = [
  { name: 'No prazo', value: 74, color: '#10b981' },
  { name: 'Em risco', value: 18, color: '#f59e0b' },
  { name: 'Atrasado', value: 8, color: '#ef4444' },
]

const alerts = [
  { type: 'error', text: '7 processos de cobrança atrasados mais de 5 dias', time: '2h atrás' },
  { type: 'warning', text: 'Contrato de Roberto Mendes parado há 4 dias na etapa "Assinatura"', time: '5h atrás' },
  { type: 'warning', text: 'SLA da etapa "Validação de docs" ultrapassado para 3 clientes', time: '1d atrás' },
  { type: 'success', text: '28 novos clientes onboardados com sucesso este mês', time: '2d atrás' },
]

interface KpiCardProps {
  label: string
  value: string
  delta: string
  positive: boolean
  icon: React.ElementType
  iconColor: string
  iconBg: string
}

function KpiCard({ label, value, delta, positive, icon: Icon, iconColor, iconBg }: KpiCardProps) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <div className={`flex items-center gap-1 mt-1.5 text-sm ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
            {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{delta}</span>
          </div>
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={20} className={iconColor} />
        </div>
      </div>
    </div>
  )
}

export function DashboardPage() {
  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="Escritório de Advocacia Silva & Associados"
        actions={
          <button className="btn-secondary text-xs py-1.5 px-3">
            <Download size={14} />
            Exportar PDF
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-4">
          <KpiCard
            label="Processos ativos"
            value="147"
            delta="+12 esta semana"
            positive
            icon={GitBranch}
            iconColor="text-brand-600"
            iconBg="bg-brand-50"
          />
          <KpiCard
            label="Receita mensal"
            value={formatCurrency(97000)}
            delta="+11% vs. mês anterior"
            positive
            icon={DollarSign}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50"
          />
          <KpiCard
            label="Inadimplência"
            value={formatCurrency(12400)}
            delta="-18% vs. mês anterior"
            positive
            icon={AlertTriangle}
            iconColor="text-amber-500"
            iconBg="bg-amber-50"
          />
          <KpiCard
            label="Clientes ativos"
            value="312"
            delta="+28 este mês"
            positive
            icon={Users}
            iconColor="text-blue-600"
            iconBg="bg-blue-50"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Revenue chart */}
          <div className="card p-5 col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="section-title">Fluxo financeiro</h3>
                <p className="text-sm text-gray-400">Receitas vs. despesas (7 meses)</p>
              </div>
              <span className="badge bg-emerald-50 text-emerald-700">+14% a/a</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="receitaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5a63f5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#5a63f5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="despesaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$${v / 1000}k`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Area type="monotone" dataKey="receita" name="Receita" stroke="#5a63f5" fill="url(#receitaGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="despesa" name="Despesa" stroke="#ef4444" fill="url(#despesaGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Status pie */}
          <div className="card p-5">
            <h3 className="section-title mb-1">Status dos processos</h3>
            <p className="text-sm text-gray-400 mb-4">Distribuição atual (147 total)</p>
            <div className="flex justify-center">
              <PieChart width={140} height={140}>
                <Pie data={statusData} cx={65} cy={65} innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div className="space-y-2 mt-2">
              {statusData.map(({ name, value, color }) => (
                <div key={name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-gray-600">{name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Workflow delays */}
          <div className="card p-5">
            <h3 className="section-title mb-1">Atrasos por etapa de workflow</h3>
            <p className="text-sm text-gray-400 mb-4">Comparativo no prazo vs. atrasado</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={workflowData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={75} />
                <Tooltip />
                <Bar dataKey="no_prazo" name="No prazo" fill="#10b981" radius={[0, 4, 4, 0]} stackId="a" />
                <Bar dataKey="atrasados" name="Atrasados" fill="#ef4444" radius={[0, 4, 4, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Alerts */}
          <div className="card p-5">
            <h3 className="section-title mb-4">Alertas do sistema</h3>
            <div className="space-y-3">
              {alerts.map((alert, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {alert.type === 'error' && <AlertTriangle size={16} className="text-red-500" />}
                    {alert.type === 'warning' && <Clock size={16} className="text-amber-500" />}
                    {alert.type === 'success' && <CheckCircle2 size={16} className="text-emerald-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 leading-snug">{alert.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
