import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import {
  BookOpen,
  Plus,
  Search,
  GitBranch,
  Clock,
  Eye,
  Star,
  FileText,
  CheckSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type DocType = 'playbook' | 'sop' | 'template' | 'checklist'

interface KnowledgeDoc {
  id: string
  title: string
  type: DocType
  linkedStage: string | null
  linkedWorkflow: string | null
  views: number
  rating: number
  lastUpdated: string
  author: string
  preview: string
  tags: string[]
}

const docs: KnowledgeDoc[] = [
  {
    id: '1',
    title: 'Checklist de análise de viabilidade processual',
    type: 'checklist',
    linkedStage: 'Análise de Viabilidade',
    linkedWorkflow: 'Onboarding de cliente',
    views: 84,
    rating: 4.9,
    lastUpdated: '15/04/2026',
    author: 'Dr. Carlos Souza',
    preview: 'Guia completo para análise de viabilidade: documentos necessários, jurisprudência relevante e critérios mínimos para aceite do caso.',
    tags: ['Análise', 'Obrigatório'],
  },
  {
    id: '2',
    title: 'Procedimento de onboarding de cliente PJ',
    type: 'playbook',
    linkedStage: 'Documentação Recebida',
    linkedWorkflow: 'Onboarding de cliente',
    views: 62,
    rating: 4.7,
    lastUpdated: '10/04/2026',
    author: 'Dra. Ana Lima',
    preview: 'Passo a passo completo para onboarding de clientes pessoa jurídica: documentos societários, procurações, contrato de honorários e configuração no sistema.',
    tags: ['Onboarding', 'PJ'],
  },
  {
    id: '3',
    title: 'Template de contrato de honorários — Trabalhista',
    type: 'template',
    linkedStage: 'Contrato Gerado',
    linkedWorkflow: null,
    views: 51,
    rating: 4.6,
    lastUpdated: '08/04/2026',
    author: 'Dr. Paulo Soares',
    preview: 'Template padrão do escritório para contratos de honorários em causas trabalhistas, com cláusulas de êxito, sigilo e rescisão.',
    tags: ['Trabalhista', 'Contratos'],
  },
  {
    id: '4',
    title: 'SOP — Como realizar audiências de conciliação',
    type: 'sop',
    linkedStage: null,
    linkedWorkflow: null,
    views: 38,
    rating: 4.8,
    lastUpdated: '02/04/2026',
    author: 'Dra. Juliana Reis',
    preview: 'Procedimento operacional padrão para audiências de conciliação: preparação prévia, conduta durante a audiência, documentação do resultado e próximos passos.',
    tags: ['Audiência', 'Operacional'],
  },
  {
    id: '5',
    title: 'Guia de cobranças de honorários em atraso',
    type: 'playbook',
    linkedStage: 'Cobrança',
    linkedWorkflow: 'Cobrança de clientes',
    views: 29,
    rating: 4.4,
    lastUpdated: '28/03/2026',
    author: 'Dra. Ana Lima',
    preview: 'Como abordar clientes inadimplentes de forma profissional: scripts de cobrança, prazos legais, acordos e quando acionar cobrança judicial.',
    tags: ['Financeiro', 'Cobrança'],
  },
]

const typeLabel: Record<DocType, string> = {
  playbook: 'Playbook',
  sop: 'SOP',
  template: 'Template',
  checklist: 'Checklist',
}

const typeColor: Record<DocType, string> = {
  playbook: 'bg-brand-50 text-brand-700',
  sop: 'bg-blue-50 text-blue-700',
  template: 'bg-purple-50 text-purple-700',
  checklist: 'bg-emerald-50 text-emerald-700',
}

const typeIcon: Record<DocType, React.ElementType> = {
  playbook: BookOpen,
  sop: FileText,
  template: FileText,
  checklist: CheckSquare,
}

export function KnowledgePage() {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string>('1')

  const filtered = docs.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())),
  )

  const selected = docs.find((d) => d.id === selectedId)!

  return (
    <div>
      <Header
        title="Base de Conhecimento"
        subtitle={`${docs.length} documentos — integrados às etapas dos workflows`}
        actions={
          <button className="btn-primary text-xs py-1.5 px-3">
            <Plus size={14} />
            Novo documento
          </button>
        }
      />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Doc list */}
        <div className="w-80 flex-shrink-0 border-r border-gray-100 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar procedimentos..."
                className="input pl-8 text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {filtered.map((doc) => {
              const Icon = typeIcon[doc.type]
              return (
                <button
                  key={doc.id}
                  onClick={() => setSelectedId(doc.id)}
                  className={cn(
                    'w-full text-left p-4 hover:bg-gray-50 transition-colors',
                    selectedId === doc.id && 'bg-brand-50',
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', typeColor[doc.type])}>
                      <Icon size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-snug">{doc.title}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={cn('badge text-[10px]', typeColor[doc.type])}>{typeLabel[doc.type]}</span>
                        {doc.linkedStage && (
                          <span className="flex items-center gap-1 text-[10px] text-gray-400">
                            <GitBranch size={9} />
                            {doc.linkedStage}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Doc detail */}
        {selected && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto space-y-5">
              {/* Header */}
              <div className="card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn('badge', typeColor[selected.type])}>{typeLabel[selected.type]}</span>
                      {selected.linkedStage && (
                        <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          <GitBranch size={11} />
                          Vinculado a: {selected.linkedStage}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">{selected.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Por {selected.author} · Atualizado em {selected.lastUpdated}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-medium">{selected.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Eye size={14} /> {selected.views} visualizações
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} /> Atualizado {selected.lastUpdated}
                  </span>
                  <div className="flex gap-1.5 ml-auto">
                    {selected.tags.map((tag) => (
                      <span key={tag} className="badge bg-gray-100 text-gray-500">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content preview */}
              <div className="card p-6">
                <h3 className="section-title mb-3">Conteúdo</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{selected.preview}</p>

                {/* Simulated checklist for checklist type */}
                {selected.type === 'checklist' && (
                  <div className="mt-5 space-y-3">
                    {[
                      { done: true, text: 'Confirmar identidade e CPF/CNPJ do cliente' },
                      { done: true, text: 'Solicitar documentação básica (RG, comprovante, etc.)' },
                      { done: true, text: 'Verificar existência de processos anteriores' },
                      { done: false, text: 'Analisar viabilidade econômica da causa' },
                      { done: false, text: 'Consultar jurisprudência recente aplicável' },
                      { done: false, text: 'Registrar parecer preliminar no sistema' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={cn(
                          'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0',
                          item.done ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300',
                        )}>
                          {item.done && <CheckSquare size={12} className="text-white" />}
                        </div>
                        <span className={cn('text-sm', item.done ? 'text-gray-400 line-through' : 'text-gray-700')}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-5 pt-5 border-t border-gray-100 flex gap-3">
                  <button className="btn-primary text-sm">Usar em processo atual</button>
                  <button className="btn-secondary text-sm">Editar documento</button>
                  <button className="btn-secondary text-sm ml-auto">Histórico de versões</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
