'use client'
import { useMemo, useState } from 'react'
import type {
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
} from '@tanstack/react-table'

type SearchRecord = Record<string, string | undefined>

export type NavigateFn = (updates: Record<string, string | undefined>) => void
// (opts: {
//   search:
//   | true
//   | SearchRecord
//   | ((prev: SearchRecord) => Partial<SearchRecord> | SearchRecord)
//   replace?: boolean
// }) => void

type UseTableUrlStateParams = {
  search: SearchRecord
  navigate: NavigateFn
  pagination?: {
    pageKey?: string
    pageSizeKey?: string
    defaultPage?: number
    defaultPageSize?: number
  }
  globalFilter?: {
    enabled?: boolean
    key?: string
    trim?: boolean
  }
  columnFilters?: Array<
    | {
      columnId: string
      searchKey: string
      type?: 'string'
      // Optional transformers for custom types
      serialize?: (value: unknown) => unknown
      deserialize?: (value: unknown) => unknown
    }
    | {
      columnId: string
      searchKey: string
      type: 'array'
      serialize?: (value: unknown) => unknown
      deserialize?: (value: unknown) => unknown
    }
  >
}

type UseTableUrlStateReturn = {
  // Global filter
  globalFilter?: string
  onGlobalFilterChange?: OnChangeFn<string>
  // Column filters
  columnFilters: ColumnFiltersState
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>
  // Pagination
  pagination: PaginationState
  onPaginationChange: OnChangeFn<PaginationState>
  // Helpers
  ensurePageInRange: (
    pageCount: number,
    opts?: { resetTo?: 'first' | 'last' }
  ) => void
}

export function useTableUrlState(
  params: UseTableUrlStateParams
): UseTableUrlStateReturn {
  const {
    search,
    navigate,
    pagination: paginationCfg,
    globalFilter: globalFilterCfg,
    columnFilters: columnFiltersCfg = [],
  } = params

  const pageKey = paginationCfg?.pageKey ?? ('page' as string)
  const pageSizeKey = paginationCfg?.pageSizeKey ?? ('pageSize' as string)
  const defaultPage = paginationCfg?.defaultPage ?? 1
  const defaultPageSize = paginationCfg?.defaultPageSize ?? 10

  const globalFilterKey = globalFilterCfg?.key ?? ('filter' as string)
  const globalFilterEnabled = globalFilterCfg?.enabled ?? true
  const trimGlobal = globalFilterCfg?.trim ?? true

  // Build initial column filters from the current search params
  const initialColumnFilters: ColumnFiltersState = useMemo(() => {
    const collected: ColumnFiltersState = []
    for (const cfg of columnFiltersCfg) {
      const raw = search[cfg.searchKey]
      const deserialize = cfg.deserialize ?? ((v: unknown) => v)
      if (cfg.type === 'string') {
        const value = (deserialize(raw) as string) ?? ''
        if (typeof value === 'string' && value.trim() !== '') {
          collected.push({ id: cfg.columnId, value })
        }
      } else {
        // default to array type
        let parsed: unknown[] = []
        try {
          parsed = raw ? JSON.parse(raw) : []
        } catch {
          parsed = []
        }
        const value = (deserialize(raw) as unknown[]) ?? []
        if (Array.isArray(value) && value.length > 0) {
          collected.push({ id: cfg.columnId, value })
        }
      }
    }
    return collected
  }, [columnFiltersCfg, search])

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialColumnFilters)

  const pagination: PaginationState = useMemo(() => {
    const rawPage = search[pageKey]
    const rawPageSize = search[pageSizeKey]
    const pageNum = !isNaN(parseInt(rawPage!)) ? parseInt(rawPage!) : defaultPage
    const pageSizeNum = !isNaN(parseInt(rawPageSize!)) ? parseInt(rawPageSize!) : defaultPageSize
    return { pageIndex: Math.max(0, pageNum - 1), pageSize: pageSizeNum, }
  }, [search, pageKey, pageSizeKey, defaultPage, defaultPageSize])

  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === 'function' ? updater(pagination) : updater
    const nextPage = next.pageIndex + 1
    const nextPageSize = next.pageSize
    const updates: Record<string, string | undefined> = {
      ...search,
      [pageKey]: nextPage <= defaultPage ? undefined : String(nextPage),
      [pageSizeKey]: nextPageSize === defaultPageSize ? undefined : String(nextPageSize),
    }
    navigate(updates)
  }

  const [globalFilter, setGlobalFilter] = useState<string | undefined>(() => {
    if (!globalFilterEnabled) return undefined
    const raw = search[globalFilterKey]
    return typeof raw === 'string' ? raw : ''
  })

  const onGlobalFilterChange: OnChangeFn<string> | undefined = globalFilterEnabled ? (updater) => {
    const next = typeof updater === 'function' ? updater(globalFilter ?? '') : updater
    const value = trimGlobal ? next.trim() : next
    setGlobalFilter(value)
    const updates: Record<string, string | undefined> = {
      ...search,
      [pageKey]: undefined,
      [globalFilterKey]: value ? value : undefined,
    }
    navigate(updates)
  } : undefined

  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (updater) => {
    const next = typeof updater === 'function' ? updater(columnFilters) : updater
    setColumnFilters(next)
    const patch: Record<string, unknown> = {}
    for (const cfg of columnFiltersCfg) {
      const found = next.find((f) => f.id === cfg.columnId)
      const serialize = cfg.serialize ?? ((v: unknown) => v)
      if (cfg.type === 'string') {
        const value = typeof found?.value === 'string' ? (found.value as string) : ''
        patch[cfg.searchKey] = value.trim() !== '' ? String(serialize(value)) : undefined
      } else {
        const value = Array.isArray(found?.value) ? (found!.value as unknown[]) : []
        patch[cfg.searchKey] = value.length > 0 ? JSON.stringify(serialize(value)) : undefined
      }
    }
    const updates: Record<string, string | undefined> = {
      ...search,
      [pageKey]: undefined,
      ...patch as Record<string, undefined>,
    }
    navigate(updates)
  }

  const ensurePageInRange = (
    pageCount: number,
    opts: { resetTo?: 'first' | 'last' } = { resetTo: 'first' }
  ) => {
    const currentPage = search[pageKey]
    const pageNum = !isNaN(parseInt(currentPage!)) ? parseInt(currentPage!) : defaultPage
    if (pageCount > 0 && pageNum > pageCount) {
      const updates: Record<string, string | undefined> = {
        ...search,
        [pageKey]: opts.resetTo === 'last' ? String(pageCount) : undefined,
      }
      navigate(updates)
    }
  }

  return {
    globalFilter: globalFilterEnabled ? (globalFilter ?? '') : undefined,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  }
}