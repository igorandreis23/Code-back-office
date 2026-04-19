import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import {
  Zap,
  Plus,
  Play,
  Pause,
  ChevronRight,
  Clock,
  Mail,
  MessageSquare,
  GitBranch,
  CheckCircle2,
  XCircle,
  Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type AutomationStatus = 'ativa' | 'pausada' | 'rascunho'

interface Automation {
  id: string
  name: string
  trigger: string
  action: string
  actionType: 'email' | 'whatsapp' | 'workflow' | 'task'
  status: AutomationStatus
  executions: number
  lastRun: string | null
  successRate: number
}

const automations: Automation[] = [
  { id: '1', name: 'Alerta de tarefa parada', trigger: 'Tarefa sem movimentação há 3 dias', action: 'Enviar e-mail para responsável + gestor', actionType: 'email', status: 'ativa', executions: 47, lastRun: '2h atrás', successRate: 100 },
  { id: '2', name: 'Confirmação de onboarding', trigger: 'Etapa "Documentação recebida" concluída', action: 'WhatsApp automático para o cliente com próximos passos', actionType: 'whatsapp', status: 'ativa', executions: 28, lastRun: '1d atrás', successRate: 96 },
  { id: '3', name: 'Escalonamento de SLA', trigger: 'Prazo de etapa ultrapassado em >24h', action: 'Notificar sócio responsável via WhatsApp e e-mail', actionType: 'whatsapp', status: 'ativa', executions: 12, lastRun: '3d atrás', successRate: 100 },
  { id: '4', name: 'Lembrete de vencimento', trigger: '5 dias antes do prazo final do processo', action: 'E-mail de lembrete para advogado responsável', actionType: 'email', status: 'ativa', executions: 31, lastRun: '5h atrás', successRate: 100 },
  { id: '5', name: 'Aprovação de alto valor', trigger: 'Processo criado com valor > R$50.000', action: 'Criar tarefa de aprovação para sócio sênior', actionType: 'task', status: 'ativa', executions: 6, lastRun: '1 semana atrás', successRate: 100 },
  { id: '6', name: 'Relatório semanal automático', trigger: 'Toda segunda-feira às 8h', action: 'Enviar PDF de resumo operacional para gestores', actionType: 'email', status: 'pausada', executions: 8, lastRun: '8d atrás', successRate: 87 },
  { id: '7', name: 'Boas-vindas cliente novo', trigger: 'Novo cliente cadastrado no sistema', action: 'E-mail de boas-vindas com template personalizado por nicho', actionType: 'email', status: 'rascunho', executions: 0, lastRun: null, successRate: 0 },
]

const recentLogs = [
  { automationId: '1', status: 'success', client: 'Roberto Mendes', time: '2h atrás', detail: 'E-mail enviado para dra.ana@silva.adv.br' },
  { automationId: '2', status: 'success', client: 'Farmácia Central', time: '5h atrás', detail: 'WhatsApp entregue com confirmação de leitura' },
  { automationId: '4', status: 'success', client: 'Tech Solutions Ltda', time: '5h atrás', detail: 'E-mail enviado para dr.carlos@silva.adv.br' },
  { automationId: '3', status: 'failed', client: 'Maria Fernanda Costa', time: '1d atrás', detail: 'Falha ao enviar WhatsApp — número inválido' },
  { automationId: '5', status: 'success', client: 'Construtora Alves', time: '1 semana atrás', detail: 'Tarefa criada para Dr. Paulo Soares' },
]

const actionIcon = {
  email: <Mail size={14} className="text-brand-500" />,
  whatsapp: <MessageSquare size={14} className="text-emerald-500" />,
  workflow: <GitBranch size={14} className="text-blue-500" />,
  task: <CheckCircle2 size={14} className="text-amber-500" />,
}

const statusColor: Record<AutomationStatus, string> = {
  ativa: 'bg-emerald-50 text-emerald-700',
  pausada: 'bg-amber-50 text-amber-600',
  rascunho: 'bg-gray-100 text-gray-500',
}

export function AutomationsPage() {
  const [selected, setSelected] = useState<string | null>(null)

  const activeCount = automations.filter((a) => a.status === 'ativa').length
  const totalExecs = automations.reduce((s, a) => s + a.executions, 0)

  return (
    <div>
      <Header
        title="Automações"
        subtitle={`${activeCount} automações ativas — ${totalExecs} execuções totais`}
        actions={
          <button className="btn-primary text-xs py-1.5 px-3">
            <Plus size={14} />
            Nova automação
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Automações ativas', value: activeCount, icon: Zap, color: 'text-brand-600', bg: 'bg-brand-50' },
            { label: 'Execuções este mês', value: totalExecs, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Taxa de sucesso', value: '97%', icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Horas economizadas', value: '62h', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="card p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{label}</p>
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', bg)}>
                  <Icon size={16} className={color} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-4">
          {/* Automation list */}
          <div className="col-span-3 card overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="section-title">Regras configuradas</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {automations.map((auto) => (
                <button
                  key={auto.id}
                  onClick={() => setSelected(selected === auto.id ? null : auto.id)}
                  className={cn(
                    'w-full text-left p-4 hover:bg-gray-50 transition-colors',
                    selected === auto.id && 'bg-brand-50',
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <Zap size={16} className="text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">{auto.name}</p>
                        <span className={cn('badge text-[10px]', statusColor[auto.status])}>
                          {auto.status}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-gray-400 space-y-0.5">
                        <p className="flex items-center gap-1.5">
                          <Clock size={10} className="flex-shrink-0" />
                          Quando: <span className="text-gray-600">{auto.trigger}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          {actionIcon[auto.actionType]}
                          Então: <span className="text-gray-600 truncate">{auto.action}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-400 flex-shrink-0">
                      <p className="font-medium text-gray-700">{auto.executions}x</p>
                      <p>{auto.lastRun ?? '—'}</p>
                    </div>
                  </div>

                  {selected === auto.id && (
                    <div className="mt-3 pt-3 border-t border-brand-100 flex items-center gap-2">
                      {auto.status === 'ativa' ? (
                        <button className="btn-secondary text-xs py-1 px-2.5 text-amber-600 border-amber-200 hover:bg-amber-50">
                          <Pause size={12} /> Pausar
                        </button>
                      ) : (
                        <button className="btn-secondary text-xs py-1 px-2.5 text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                          <Play size={12} /> Ativar
                        </button>
                      )}
                      <button className="btn-secondary text-xs py-1 px-2.5">Editar regra</button>
                      <button className="btn-secondary text-xs py-1 px-2.5">Ver histórico</button>
                      <div className="ml-auto text-xs text-gray-400">
                        Sucesso: <span className="font-medium text-gray-700">{auto.successRate}%</span>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Recent log */}
          <div className="col-span-2 card overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="section-title">Log de execuções recentes</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {recentLogs.map((log, i) => (
                <div key={i} className="p-4 flex items-start gap-3">
                  {log.status === 'success' ? (
                    <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{log.client}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{log.detail}</p>
                    <p className="text-xs text-gray-400 mt-1">{log.time}</p>
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
