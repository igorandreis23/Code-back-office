import { useState } from 'react'
import {
  GitBranch,
  Users,
  LayoutDashboard,
  Zap,
  BookOpen,
  Shield,
  Network,
  Database,
  Globe,
  Server,
  X,
  ChevronRight,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

interface Module {
  id: string
  label: string
  sublabel: string
  icon: React.ElementType
  color: string
  bgColor: string
  borderColor: string
  route: string
  description: string
  features: string[]
  integrations: string[]
  kpis: { label: string; value: string; delta: string }[]
}

const modules: Module[] = [
  {
    id: 'workflows',
    label: 'Workflows',
    sublabel: 'Motor de processos',
    icon: GitBranch,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    route: '/workflows',
    description:
      'Motor de workflows com etapas customizáveis, lógica condicional e SLA monitorado com escalonamento automático.',
    features: [
      'Etapas nomeadas com responsáveis e prazos',
      'Lógica condicional (ex: valor > R$50k → aprovação gerente)',
      'SLA automático com escalonamento por e-mail e WhatsApp',
      'Visualização em kanban e lista',
      'Histórico completo de cada transição',
    ],
    integrations: ['Notificações por e-mail', 'WhatsApp Business API', 'Calendário Google/Outlook'],
    kpis: [
      { label: 'Processos ativos', value: '147', delta: '+12 esta semana' },
      { label: 'SLA cumprido', value: '94%', delta: '+3% vs. mês anterior' },
      { label: 'Tempo médio de etapa', value: '2.4d', delta: '-0.8d vs. mês anterior' },
    ],
  },
  {
    id: 'clients',
    label: 'Centralização',
    sublabel: 'Data lake navegável',
    icon: Users,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    route: '/clients',
    description:
      'Linha do tempo unificada por cliente com todos os eventos de todos os módulos. Elimina a pergunta "onde fica essa informação?".',
    features: [
      'Perfil 360° de cada cliente/processo',
      'Linha do tempo unificada de eventos',
      'Filtros por status, responsável, prazo',
      'Importação via CSV/XLSX',
      'Histórico financeiro integrado',
    ],
    integrations: ['Importação CSV/XLSX', 'Google Sheets (bidirecional)', 'ERPs via webhook'],
    kpis: [
      { label: 'Clientes ativos', value: '312', delta: '+28 este mês' },
      { label: 'Dados migrados', value: '100%', delta: 'Completo' },
      { label: 'Tempo de busca', value: '<10s', delta: '-85% vs. planilha' },
    ],
  },
  {
    id: 'dashboards',
    label: 'Dashboards',
    sublabel: 'Inteligência operacional',
    icon: LayoutDashboard,
    color: 'text-brand-600',
    bgColor: 'bg-brand-50',
    borderColor: 'border-brand-200',
    route: '/dashboard',
    description:
      'KPIs pré-configurados por nicho. Gestores veem o que importa imediatamente sem configurar gráficos.',
    features: [
      'Templates por nicho (advocacia, clínicas, contabilidade)',
      'Alertas proativos de desvios',
      'Fluxo de caixa projetado 30/60/90 dias',
      'Ranking de desempenho por responsável',
      'Exportação em PDF para reuniões',
    ],
    integrations: ['Open Banking/PIX', 'ERPs financeiros', 'Google Data Studio'],
    kpis: [
      { label: 'Alertas ativos', value: '5', delta: '2 críticos' },
      { label: 'Inadimplência', value: 'R$12.4k', delta: '-18% vs. mês anterior' },
      { label: 'Receita prevista/30d', value: 'R$84k', delta: '+7% vs. meta' },
    ],
  },
  {
    id: 'automations',
    label: 'Automação',
    sublabel: 'Gatilhos inteligentes',
    icon: Zap,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    route: '/automations',
    description:
      'Transforme eventos em ações com linguagem natural estruturada. Sem código — qualquer operador configura seus gatilhos.',
    features: [
      'Editor visual "Quando → Então"',
      'Disparo por tempo, evento ou condição',
      'Templates de automação por nicho',
      'Log de execução com resultado',
      'Testador antes de ativar',
    ],
    integrations: ['n8n self-hosted', 'Zapier/Make', 'Twilio (SMS/WhatsApp)', 'SendGrid (email)'],
    kpis: [
      { label: 'Automações ativas', value: '23', delta: '+5 este mês' },
      { label: 'Ações executadas/dia', value: '184', delta: 'Média 7 dias' },
      { label: 'Horas economizadas/mês', value: '62h', delta: 'Estimativa' },
    ],
  },
  {
    id: 'knowledge',
    label: 'Conhecimento',
    sublabel: 'Procedimentos integrados',
    icon: BookOpen,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    route: '/knowledge',
    description:
      'Playbooks e SOPs integrados diretamente às etapas do workflow. O procedimento correto aparece no momento certo, para a pessoa certa.',
    features: [
      'Editor rich-text para playbooks',
      'Vinculação direta a etapas de workflow',
      'Versionamento de procedimentos',
      'Busca full-text',
      'Checklist interativo na execução',
    ],
    integrations: ['Notion (importação)', 'Confluence (importação)', 'Google Docs'],
    kpis: [
      { label: 'Playbooks ativos', value: '41', delta: '+8 este mês' },
      { label: 'Consultas/dia', value: '67', delta: '+120% vs. mês anterior' },
      { label: 'Dependência de pessoa-chave', value: '-72%', delta: 'Autopercepção da equipe' },
    ],
  },
  {
    id: 'audit',
    label: 'Auditoria',
    sublabel: 'Trilha imutável',
    icon: Shield,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    route: '/audit',
    description:
      'Trilha imutável de todos os eventos do sistema. Quem fez o quê, quando, de qual dispositivo e com qual resultado.',
    features: [
      'Log append-only (sem UPDATE/DELETE)',
      'Filtros por usuário, módulo, período, ação',
      'Exportação CSV para auditorias externas',
      'Alertas de ações suspeitas',
      'Retenção configurável (padrão 5 anos)',
    ],
    integrations: ['SIEM externo via webhook', 'Slack (alertas críticos)', 'SMTP'],
    kpis: [
      { label: 'Eventos registrados', value: '184.2k', delta: 'Total acumulado' },
      { label: 'Alertas de anomalia', value: '2', delta: 'Últimos 30 dias' },
      { label: 'Integridade', value: '100%', delta: 'Sem brechas detectadas' },
    ],
  },
]

const layers = [
  { id: 'sources', label: 'Fontes Externas', color: 'from-gray-100 to-gray-50', border: 'border-gray-200' },
  { id: 'integration', label: 'Camada de Integração', color: 'from-purple-50 to-purple-25', border: 'border-purple-100' },
  { id: 'core', label: 'OpCenter Core — Event Bus', color: 'from-brand-50 to-brand-25', border: 'border-brand-200' },
  { id: 'data', label: 'Camada de Dados', color: 'from-slate-100 to-slate-50', border: 'border-slate-200' },
]

interface DetailPanelProps {
  module: Module
  onClose: () => void
}

function DetailPanel({ module, onClose }: DetailPanelProps) {
  const navigate = useNavigate()
  const Icon = module.icon

  return (
    <div className="animate-slide-in-right w-[420px] flex-shrink-0 bg-white border-l border-gray-100 h-full overflow-y-auto">
      {/* Header */}
      <div className={cn('p-6 border-b border-gray-100', module.bgColor)}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm border', module.borderColor)}>
              <Icon size={20} className={module.color} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{module.label}</h3>
              <p className="text-sm text-gray-500">{module.sublabel}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">{module.description}</p>
      </div>

      <div className="p-6 space-y-6">
        {/* KPIs */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            Indicadores em tempo real
          </p>
          <div className="space-y-2">
            {module.kpis.map((kpi) => (
              <div key={kpi.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">{kpi.label}</span>
                <div className="text-right">
                  <span className="font-semibold text-gray-900">{kpi.value}</span>
                  <p className="text-xs text-gray-400">{kpi.delta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            Funcionalidades
          </p>
          <ul className="space-y-2">
            {module.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                <ChevronRight size={14} className={cn('mt-0.5 flex-shrink-0', module.color)} />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Integrations */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            Integrações
          </p>
          <div className="flex flex-wrap gap-2">
            {module.integrations.map((int) => (
              <span key={int} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                {int}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate(module.route)}
          className={cn('w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white transition-colors', {
            'bg-blue-600 hover:bg-blue-700': module.id === 'workflows',
            'bg-emerald-600 hover:bg-emerald-700': module.id === 'clients',
            'bg-brand-600 hover:bg-brand-700': module.id === 'dashboards',
            'bg-amber-500 hover:bg-amber-600': module.id === 'automations',
            'bg-rose-600 hover:bg-rose-700': module.id === 'knowledge',
            'bg-slate-600 hover:bg-slate-700': module.id === 'audit',
          })}
        >
          Abrir módulo
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}

export function ArchitectureDiagram() {
  const [selected, setSelected] = useState<Module | null>(null)

  const handleModuleClick = (mod: Module) => {
    setSelected((prev) => (prev?.id === mod.id ? null : mod))
  }

  return (
    <div className="flex h-full">
      {/* Main diagram area */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* External Sources Layer */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Fontes Externas
            </p>
            <div className="flex gap-3 flex-wrap">
              {[
                { icon: Globe, label: 'API REST / Webhooks' },
                { icon: Database, label: 'CSV / XLSX Import' },
                { icon: Server, label: 'ERP Integration' },
                { icon: Network, label: 'WhatsApp / Email' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm"
                >
                  <Icon size={14} className="text-gray-400" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Flow arrow */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-0.5 h-4 bg-gradient-to-b from-gray-300 to-brand-400" />
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-brand-400" />
            </div>
          </div>

          {/* Integration Layer */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-25 border border-purple-100 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-3">
              Camada de Integração — Normalização e Roteamento
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Webhook Receiver', desc: 'Recebe e valida payloads externos' },
                { label: 'Schema Normalizer', desc: 'Converte para formato padrão interno' },
                { label: 'Rate Limiter', desc: 'Proteção e throttling por tenant' },
              ].map(({ label, desc }) => (
                <div key={label} className="bg-white border border-purple-100 rounded-lg p-3">
                  <p className="text-xs font-semibold text-purple-700">{label}</p>
                  <p className="text-xs text-gray-500 mt-1">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Flow arrow */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-0.5 h-4 bg-gradient-to-b from-purple-400 to-brand-500" />
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-brand-500" />
            </div>
          </div>

          {/* OpCenter Core Event Bus */}
          <div className="bg-gradient-to-r from-brand-50 to-indigo-50 border-2 border-brand-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-brand-600 rounded-md flex items-center justify-center">
                <Network size={14} className="text-white" />
              </div>
              <p className="text-sm font-bold text-brand-800">OpCenter Core — Event Bus (BullMQ + Redis)</p>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs text-emerald-600 font-medium">Online</span>
              </div>
            </div>

            {/* Six modules */}
            <div className="grid grid-cols-3 gap-3">
              {modules.map((mod) => {
                const Icon = mod.icon
                const isSelected = selected?.id === mod.id
                return (
                  <button
                    key={mod.id}
                    onClick={() => handleModuleClick(mod)}
                    className={cn(
                      'module-card p-3.5 bg-white rounded-xl border-2 text-left transition-all',
                      isSelected
                        ? `${mod.borderColor} shadow-lg ring-2 ring-offset-1 ring-brand-400`
                        : 'border-gray-100 hover:border-gray-200 shadow-sm',
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', mod.bgColor)}>
                        <Icon size={15} className={mod.color} />
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-500">
                          Selecionado
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{mod.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{mod.sublabel}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className={cn('text-xs px-1.5 py-0.5 rounded font-medium', mod.bgColor, mod.color)}>
                        Ativo
                      </span>
                      <ChevronRight size={12} className="text-gray-300" />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Flow arrow */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-0.5 h-4 bg-gradient-to-b from-brand-500 to-slate-400" />
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-400" />
            </div>
          </div>

          {/* Data Layer */}
          <div className="bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Camada de Dados
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Database, label: 'PostgreSQL', desc: 'Dados principais + auditoria append-only', color: 'text-blue-500' },
                { icon: Server, label: 'Redis', desc: 'Cache + filas BullMQ + sessões', color: 'text-red-500' },
                { icon: Globe, label: 'Object Storage', desc: 'Arquivos, documentos e exportações', color: 'text-amber-500' },
              ].map(({ icon: Icon, label, desc, color }) => (
                <div key={label} className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                  <Icon size={18} className={color} />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{label}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 pt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-brand-400 rounded" />
              Fluxo de dados
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border-2 border-brand-400" />
              Clique para detalhar
            </span>
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Sistema online
            </span>
          </div>
        </div>
      </div>

      {/* Detail panel */}
      {selected && <DetailPanel module={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
