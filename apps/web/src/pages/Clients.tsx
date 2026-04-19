import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import {
  Users,
  Search,
  Plus,
  ChevronRight,
  GitBranch,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
} from 'lucide-react'
import { cn, formatCurrency, formatRelativeTime } from '@/lib/utils'

interface Client {
  id: string
  name: string
  type: string
  email: string
  phone: string
  status: 'ativo' | 'inativo' | 'prospect'
  activeProcesses: number
  totalBilled: number
  outstanding: number
  lastActivity: string
  tags: string[]
}

const clients: Client[] = [
  { id: '1', name: 'Roberto Mendes', type: 'Pessoa Física', email: 'roberto@email.com', phone: '(11) 98765-4321', status: 'ativo', activeProcesses: 2, totalBilled: 28500, outstanding: 0, lastActivity: new Date(Date.now() - 2 * 3600000).toISOString(), tags: ['Trabalhista', 'VIP'] },
  { id: '2', name: 'Construtora Alves Ltda', type: 'Pessoa Jurídica', email: 'juridico@alves.com.br', phone: '(11) 3456-7890', status: 'ativo', activeProcesses: 3, totalBilled: 142000, outstanding: 52000, lastActivity: new Date(Date.now() - 86400000).toISOString(), tags: ['Imobiliário', 'Enterprise'] },
  { id: '3', name: 'Maria Fernanda Costa', type: 'Pessoa Física', email: 'mf.costa@gmail.com', phone: '(21) 97654-3210', status: 'ativo', activeProcesses: 1, totalBilled: 8200, outstanding: 4100, lastActivity: new Date(Date.now() - 3 * 86400000).toISOString(), tags: ['Família'] },
  { id: '4', name: 'Tech Solutions Ltda', type: 'Pessoa Jurídica', email: 'legal@techsol.com', phone: '(11) 4567-8901', status: 'ativo', activeProcesses: 1, totalBilled: 35000, outstanding: 35000, lastActivity: new Date(Date.now() - 7200000).toISOString(), tags: ['Empresarial', 'Novo'] },
  { id: '5', name: 'Paulo Sérgio Almeida', type: 'Pessoa Física', email: 'psergio@hotmail.com', phone: '(31) 96543-2109', status: 'ativo', activeProcesses: 1, totalBilled: 22000, outstanding: 0, lastActivity: new Date(Date.now() - 5 * 86400000).toISOString(), tags: ['Indenização'] },
  { id: '6', name: 'Farmácia Central', type: 'Pessoa Jurídica', email: 'admin@farmaciacentral.com', phone: '(11) 2345-6789', status: 'prospect', activeProcesses: 0, totalBilled: 0, outstanding: 0, lastActivity: new Date(Date.now() - 86400000).toISOString(), tags: ['Prospect', 'Regulatório'] },
]

const events = [
  { type: 'stage', text: 'Processo avançou para "Assinatura"', client: 'Roberto Mendes', time: new Date(Date.now() - 2 * 3600000).toISOString() },
  { type: 'payment', text: 'Pagamento de R$14.250 confirmado', client: 'Construtora Alves', time: new Date(Date.now() - 5 * 3600000).toISOString() },
  { type: 'message', text: 'E-mail de atualização enviado automaticamente', client: 'Maria Fernanda Costa', time: new Date(Date.now() - 86400000).toISOString() },
  { type: 'alert', text: 'Contrato vencendo em 3 dias', client: 'Tech Solutions Ltda', time: new Date(Date.now() - 2 * 86400000).toISOString() },
  { type: 'stage', text: 'Onboarding concluído — processo ativo', client: 'Paulo Sérgio Almeida', time: new Date(Date.now() - 5 * 86400000).toISOString() },
]

const statusColor = { ativo: 'bg-emerald-50 text-emerald-700', inativo: 'bg-gray-100 text-gray-500', prospect: 'bg-blue-50 text-blue-600' }
const statusLabel = { ativo: 'Ativo', inativo: 'Inativo', prospect: 'Prospect' }

export function ClientsPage() {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>('1')

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase()),
  )

  const selected = clients.find((c) => c.id === selectedId) ?? null

  return (
    <div>
      <Header
        title="Centralização de Clientes"
        subtitle={`${clients.filter((c) => c.status === 'ativo').length} clientes ativos`}
        actions={
          <button className="btn-primary text-xs py-1.5 px-3">
            <Plus size={14} />
            Novo cliente
          </button>
        }
      />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Client list */}
        <div className="w-80 flex-shrink-0 border-r border-gray-100 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar clientes..."
                className="input pl-8 text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {filtered.map((client) => (
              <button
                key={client.id}
                onClick={() => setSelectedId(client.id)}
                className={cn(
                  'w-full text-left p-4 hover:bg-gray-50 transition-colors',
                  selectedId === client.id && 'bg-brand-50',
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {client.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{client.name}</p>
                      <p className="text-xs text-gray-400">{client.type}</p>
                    </div>
                  </div>
                  <span className={cn('badge text-[10px]', statusColor[client.status])}>
                    {statusLabel[client.status]}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <GitBranch size={10} />
                    {client.activeProcesses} processos
                  </span>
                  {client.outstanding > 0 && (
                    <span className="text-red-500 font-medium">
                      {formatCurrency(client.outstanding)} em aberto
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        {selected ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Client header */}
            <div className="card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-lg font-bold">
                    {selected.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selected.name}</h2>
                    <p className="text-sm text-gray-400">{selected.type}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Mail size={13} /> {selected.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Phone size={13} /> {selected.phone}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selected.tags.map((tag) => (
                    <span key={tag} className="badge bg-gray-100 text-gray-600">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Financial KPIs */}
              <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">Total faturado</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(selected.totalBilled)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Em aberto</p>
                  <p className={cn('text-lg font-bold mt-1', selected.outstanding > 0 ? 'text-red-600' : 'text-emerald-600')}>
                    {formatCurrency(selected.outstanding)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Processos ativos</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{selected.activeProcesses}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="card p-5">
              <h3 className="section-title mb-4">Linha do tempo</h3>
              <div className="relative space-y-4">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100" />
                {events
                  .filter((e) => e.client === selected.name || true)
                  .slice(0, 4)
                  .map((event, i) => (
                    <div key={i} className="flex items-start gap-4 pl-8 relative">
                      <div className={cn(
                        'absolute left-2.5 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white',
                        event.type === 'payment' ? 'bg-emerald-500' :
                        event.type === 'alert' ? 'bg-amber-500' :
                        event.type === 'stage' ? 'bg-brand-500' : 'bg-gray-300',
                      )} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{event.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{formatRelativeTime(event.time)}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Users size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Selecione um cliente para ver o perfil completo</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
