import { Permission } from './permission'

export type Role = {
  name: string
  description: string
  permissions: Permission[]
}
