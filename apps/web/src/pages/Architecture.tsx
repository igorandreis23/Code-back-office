import { Header } from '@/components/layout/Header'
import { ArchitectureDiagram } from '@/components/ArchitectureDiagram'
import { Download, RefreshCw } from 'lucide-react'

export function ArchitecturePage() {
  return (
    <div className="flex flex-col h-screen">
      <Header
        title="Arquitetura do Sistema"
        subtitle="OpCenter — diagrama interativo de módulos e integrações"
        actions={
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-xs py-1.5 px-3">
              <RefreshCw size={14} />
              Atualizar status
            </button>
            <button className="btn-secondary text-xs py-1.5 px-3">
              <Download size={14} />
              Exportar PDF
            </button>
          </div>
        }
      />
      <div className="flex-1 overflow-hidden">
        <ArchitectureDiagram />
      </div>
    </div>
  )
}
