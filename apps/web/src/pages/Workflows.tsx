import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import {
  GitBranch,
  Plus,
  Clock,
  User,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Filter,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Stage = { id: string; name: string; color: string }
type Priority = 'alta' | 'media' | 'baixa'
type Status = 'no_prazo' | 'atrasado' | 'em_risco'

interface WorkflowItem {
  id: string
  client: string
  type: string
  stage: string
  responsible: string
  daysInStage: number
  deadline: string
  priority: Priority
  status: Status
  value: number
}

const stages: Stage[] = [
  { id: 'docs', name: 'Documentação', color: 'bg-gray-100 text-gray-600' },
  { id: 'analysis', name: 'Análise', color: 'bg-blue-100 text-blue-700' },
  { id: 'contract', name: 'Contrato', color: 'bg-purple-100 text-purple-700' },
  { id: 'signature', name: 'Assinatura', color: 'bg-amber-100 text-amber-700' },
  { id: 'active', name: 'Ativo', color: 'bg-emerald-100 text-emerald-700' },
]

const items: WorkflowItem[] = [
  { id: '1', client: 'Roberto Mendes', type: 'Processo trabalhista', stage: 'signature', responsible: 'Dra. Ana Lima', daysInStage: 4, deadline: '23/04/2026', priority: 'alta', status: 'atrasado', value: 18500 },
  { id: '2', client: 'Construtora Alves', type: 'Consultoria imobiliária', stage: 'analysis', responsible: 'Dr. Carlos Souza', daysInStage: 1, deadline: '30/04/2026', priority: 'media', status: 'no_prazo', value: 52000 },
  { id: '3', client: 'Maria Fernanda Costa', type: 'Divórcio amigável', stage: 'docs', responsible: 'Dra. Juliana Reis', daysInStage: 2, deadline: '15/05/2026', priority: 'baixa', status: 'no_prazo', value: 8200 },
  { id: '4', client: 'Tech Solutions Ltda', type: 'Contrato comercial', stage: 'contract', responsible: 'Dr. Carlos Souza', daysInStage: 3, deadline: '25/04/2026', priority: 'alta', status: 'em_risco', value: 35000 },
  { id: '5', client: 'Paulo Sérgio', type: 'Indenização', stage: 'active', responsible: 'Dra. Ana Lima', daysInStage: 12, deadline: '10/06/2026', priority: 'media', status: 'no_prazo', value: 22000 },
  { id: '6', client: 'Farmácia Central', type: 'Regularização empresarial', stage: 'docs', responsible: 'Dra. Juliana Reis', daysInStage: 0, deadline: '20/05/2026', priority: 'baixa', status: 'no_prazo', value: 11500 },
]

const priorityLabel: Record<Priority, string> = { alta: 'Alta', media: 'Média', baixa: 'Baixa' }
const priorityColor: Record<Priority, string> = {
  alta: 'bg-red-50 text-red-600',
  media: 'bg-amber-50 text-amber-600',
  baixa: 'bg-gray-50 text-gray-500',
}

const statusIcon: Record<Status, React.ReactNode> = {
  no_prazo: <CheckCircle2 size={14} className="text-emerald-500" />,
  atrasado: <AlertTriangle size={14} className="text-red-500" />,
  em_risco: <Clock size={14} className="text-amber-500" />,
}

const statusLabel: Record<Status, string> = {
  no_prazo: 'No prazo',
  atrasado: 'Atrasado',
  em_risco: 'Em risco',
}

export function WorkflowsPage() {
  const [activeStage, setActiveStage] = useState<string | null>(null)

  const filtered = activeStage ? items.filter((i) => i.stage === activeStage) : items

  const stageObj = stages.find((s) => s.id === activeStage)

  return (
    <div>
      <Header
        title="Workflows"
        subtitle={`${items.length} processos ativos — ${items.filter((i) => i.status === 'atrasado').length} atrasados`}
        actions={
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-xs py-1.5 px-3">
              <Filter size={14} />
              Filtrar
            </button>
            <button className="btn-primary text-xs py-1.5 px-3">
              <Plus size={14} />
              Novo processo
            </button>
          </div>
        }
      />

      <div className="p-6 space-y-5">
        {/* Stage filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveStage(null)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-colors border',
              !activeStage
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300',
            )}
          >
            Todos ({items.length})
          </button>
          {stages.map((s) => {
            const count = items.filter((i) => i.stage === s.id).length
            return (
              <button
                key={s.id}
                onClick={() => setActiveStage(activeStage === s.id ? null : s.id)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors border',
                  activeStage === s.id
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300',
                )}
              >
                {s.name} ({count})
              </button>
            )
          })}
        </div>

        {/* Kanban view */}
        <div className="grid grid-cols-5 gap-3">
          {stages.map((stage) => {
            const stageItems = items.filter((i) => i.stage === stage.id)
            return (
              <div key={stage.id} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className={cn('badge', stage.color)}>{stage.name}</span>
                  <span className="text-xs font-semibold text-gray-400">{stageItems.length}</span>
                </div>
                <div className="space-y-2">
                  {stageItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                      <p className="text-xs font-semibold text-gray-900 truncate">{item.client}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{item.type}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <User size={10} />
                          <span className="truncate max-w-[60px]">{item.responsible.split(' ')[0]}</span>
                        </div>
                        {statusIcon[item.status]}
                      </div>
                      {item.status === 'atrasado' && (
                        <div className="mt-2 text-[10px] text-red-500 font-medium flex items-center gap-1">
                          <AlertTriangle size={10} />
                          {item.daysInStage}d nesta etapa
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* List view */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="section-title">
              {stageObj ? `Processos em "${stageObj.name}"` : 'Todos os processos'}
            </h3>
            <span className="text-sm text-gray-400">{filtered.length} processos</span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Cliente', 'Tipo', 'Etapa', 'Responsável', 'Prazo', 'Prioridade', 'Status', ''].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((item) => {
                const stage = stages.find((s) => s.id === item.stage)!
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{item.client}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{item.type}</td>
                    <td className="px-4 py-3">
                      <span className={cn('badge', stage.color)}>{stage.name}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{item.responsible}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{item.deadline}</td>
                    <td className="px-4 py-3">
                      <span className={cn('badge', priorityColor[item.priority])}>
                        {priorityLabel[item.priority]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        {statusIcon[item.status]}
                        {statusLabel[item.status]}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <ChevronRight size={14} className="text-gray-300" />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
