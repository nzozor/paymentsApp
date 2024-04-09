export interface IDto {
  totalNumberOfItems: number
  numberOfPages: number
  currentPage: number
  pageSize: number
  hasNext: boolean
  items: Item[]
}

export interface Item {
  id: string
  amount: number
  currency: string
  description: string
  status: string
  createdAt: string
}

export enum StatusFilterEnum {
  ALL = '',
  CAPTURED = 'CAPTURED',
  COMPLETED = 'COMPLETED',
  CREATED = 'CREATED',
  FAILED = 'FAILED',
  SETTLED = 'SETTLED',
}
