import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import {
  Shield,
  Download,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  User,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type AuditAction = 'create' | 'update' | 'delete' | 'login' | 'export' | 'stage_change' | 'payment'

interface AuditEntry {
  id: string
  timestamp: string
  user: string
  userRole: string
  action: AuditAction
  module: string
  description: string
  entity: string
  ip: string
  device: string
  result: 'success' | 'failed'
  metadata?: Record<string, string>
}

const entries: AuditEntry[] = [
  { id: '1', timestamp: '2026-04-19T14:23:11', user: 'Dra. Ana Lima', userRole: 'Advogada', action: 'stage_change', module: 'Workflows', description: 'Processo avançado para etapa "Assinatura"', entity: 'Processo #2847 — Roberto Mendes', ip: '192.168.1.45', device: 'MacBook Chrome', result: 'success', metadata: { 'De': 'Contrato Gerado', 'Para': 'Assinatura', 'Observação': 'Contrato revisado e aprovado' } },
  { id: '2', timestamp: '2026-04-19T11:05:33', user: 'Dr. Carlos Souza', userRole: 'Advogado Sênior', action: 'create', module: 'Workflows', description: 'Novo processo criado', entity: 'Processo #2851 — Construtora Alves', ip: '192.168.1.22', device: 'iPhone Safari', result: 'success' },
  { id: '3', timestamp: '2026-04-19T09:48:20', user: 'Sistema (Automação)', userRole: 'Sistema', action: 'export', module: 'Automações', description: 'E-mail de lembrete enviado automaticamente', entity: 'Cliente — Tech Solutions Ltda', ip: '10.0.0.1', device: 'Sistema', result: 'success' },
  { id: '4', timestamp: '2026-04-18T17:12:55', user: 'Dra. Juliana Reis', userRole: 'Advogada', action: 'update', module: 'Conhecimento', description: 'Playbook atualizado', entity: 'Checklist de análise de viabilidade', ip: '192.168.1.67', device: 'Windows Firefox', result: 'success', metadata: { 'Versão anterior': '1.3', 'Nova versão': '1.4', 'Alterações': 'Adicionado item 6 ao checklist' } },
  { id: '5', timestamp: '2026-04-18T16:40:08', user: 'Ana Souza', userRole: 'Administradora', action: 'export', module: 'Auditoria', description: 'Exportação de log de auditoria (CSV)', entity: 'Log — Abril 2026', ip: '192.168.1.10', device: 'MacBook Chrome', result: 'success', metadata: { 'Período': '01/04 — 18/04/2026', 'Registros': '1.247', 'Formato': 'CSV' } },
  { id: '6', timestamp: '2026-04-18T14:22:01', user: 'Usuario desconhecido', userRole: 'Externo', action: 'login', module: 'Auth', description: 'Tentativa de login com credenciais inválidas', entity: 'admin@silva.adv.br', ip: '203.45.12.89', device: 'Windows Edge', result: 'failed' },
  { id: '7', timestamp: '2026-04-18T10:15:44', user: 'Dr. Carlos Souza', userRole: 'Advogado Sênior', action: 'payment', module: 'Financeiro', description: 'Pagamento registrado manualmente', entity: 'Processo #2801 — Construtora Alves', ip: '192.168.1.22', device: 'MacBook Chrome', result: 'success', metadata: { 'Valor': 'R$14.250,00', 'Método': 'PIX', 'Referência': 'NF-2024-0118' } },
]

const actionLabel: Record<AuditAction, string> = {
  create: 'Criação',
  update: 'Atualização',
  delete: 'Exclusão',
  login: 'Login',
  export: 'Exportação',
  stage_change: 'Mudança de etapa',
  payment: 'Pagamento',
}

const actionColor: Record<AuditAction, string> = {
  create: 'bg-emerald-50 text-emerald-700',
  update: 'bg-blue-50 text-blue-700',
  delete: 'bg-red-50 text-red-700',
  login: 'bg-gray-50 text-gray-600',
  export: 'bg-purple-50 text-purple-700',
  stage_change: 'bg-brand-50 text-brand-700',
  payment: 'bg-amber-50 text-amber-700',
}

function formatTimestamp(ts: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(ts))
}

export function AuditPage() {
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = entries.filter(
    (e) =>
      e.user.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.entity.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div>
      <Header
        title="Trilha de Auditoria"
        subtitle="Log imutável — todos os eventos do sistema"
        actions={
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-xs py-1.5 px-3">
              <Filter size={14} />
              Filtrar
            </button>
            <button className="btn-primary text-xs py-1.5 px-3">
              <Download size={14} />
              Exportar CSV
            </button>
          </div>
        }
      />

      <div className="p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total de eventos', value: '184.247', icon: Shield, color: 'text-brand-600', bg: 'bg-brand-50' },
            { label: 'Eventos hoje', value: entries.length.toString(), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Falhas detectadas', value: '1', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
            { label: 'Usuários ativos', value: '8', icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
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

        {/* Security alert */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Anomalia detectada</p>
            <p className="text-sm text-amber-700 mt-0.5">
              Tentativa de login com credenciais inválidas detectada em 18/04/2026 às 14:22 a partir do IP externo 203.45.12.89.
              O acesso foi bloqueado automaticamente após 3 tentativas.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar eventos..."
              className="input pl-8 text-sm"
            />
          </div>
          <span className="text-sm text-gray-400">{filtered.length} registros encontrados</span>
        </div>

        {/* Log table */}
        <div className="card overflow-hidden">
          <div className="divide-y divide-gray-50">
            {filtered.map((entry) => (
              <div key={entry.id}>
                <button
                  onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                  className="w-full text-left px-5 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Result icon */}
                    <div className="flex-shrink-0">
                      {entry.result === 'success' ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : (
                        <AlertTriangle size={16} className="text-red-500" />
                      )}
                    </div>

                    {/* Timestamp */}
                    <p className="text-xs text-gray-400 font-mono w-40 flex-shrink-0">
                      {formatTimestamp(entry.timestamp)}
                    </p>

                    {/* Action badge */}
                    <span className={cn('badge text-[10px] w-32 justify-center flex-shrink-0', actionColor[entry.action])}>
                      {actionLabel[entry.action]}
                    </span>

                    {/* User */}
                    <div className="flex items-center gap-1.5 w-40 flex-shrink-0">
                      <User size={12} className="text-gray-400" />
                      <span className="text-sm text-gray-700 truncate">{entry.user}</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 flex-1 truncate">{entry.description}</p>

                    {/* Module */}
                    <span className="text-xs text-gray-400 w-24 flex-shrink-0 text-right">{entry.module}</span>

                    {/* Expand */}
                    <ChevronDown
                      size={14}
                      className={cn('text-gray-300 flex-shrink-0 transition-transform', expandedId === entry.id && 'rotate-180')}
                    />
                  </div>
                </button>

                {/* Expanded detail */}
                {expandedId === entry.id && (
                  <div className="px-5 pb-4 bg-gray-50 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="space-y-2">
                        <DetailRow label="Entidade" value={entry.entity} />
                        <DetailRow label="Usuário" value={`${entry.user} (${entry.userRole})`} />
                        <DetailRow label="Módulo" value={entry.module} />
                        <DetailRow label="Resultado" value={entry.result === 'success' ? '✓ Sucesso' : '✗ Falhou'} />
                      </div>
                      <div className="space-y-2">
                        <DetailRow label="IP de origem" value={entry.ip} />
                        <DetailRow label="Dispositivo" value={entry.device} />
                        {entry.metadata &&
                          Object.entries(entry.metadata).map(([k, v]) => (
                            <DetailRow key={k} label={k} value={v} />
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center">
          Registros imutáveis — nenhuma linha pode ser alterada ou excluída. Retenção padrão: 5 anos.
        </p>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-400 w-28 flex-shrink-0">{label}</span>
      <span className="text-gray-700 font-medium">{value}</span>
    </div>
  )
}
