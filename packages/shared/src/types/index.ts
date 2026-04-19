// Shared types between frontend and backend

export type UserRole = 'admin' | 'manager' | 'operator'

export type TenantNiche = 'law' | 'clinic' | 'accounting' | 'real_estate' | 'other'

export type Priority = 'high' | 'medium' | 'low'

export type WorkflowStatus = 'active' | 'completed' | 'archived' | 'paused'

export type ClientStatus = 'active' | 'inactive' | 'prospect'

export type AutomationStatus = 'active' | 'paused' | 'draft'

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'login'
  | 'export'
  | 'stage_change'
  | 'payment'

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  statusCode: number
  message: string
  error: string
}

// Event bus event types
export type SystemEventType =
  | 'workflow.stage.changed'
  | 'workflow.created'
  | 'workflow.overdue'
  | 'client.created'
  | 'payment.received'
  | 'automation.triggered'
  | 'user.login'

export interface SystemEvent {
  type: SystemEventType
  tenantId: string
  entityId: string
  payload: Record<string, unknown>
  timestamp: string
}
