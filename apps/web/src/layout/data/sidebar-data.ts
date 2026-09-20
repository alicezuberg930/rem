import {
  Construction,
  LayoutDashboard,
  Monitor,
  Bug,
  ListTodo,
  FileX,
  HelpCircle,
  Lock,
  Bell,
  Package,
  Palette,
  ServerOff,
  Settings,
  Wrench,
  UserCog,
  UserX,
  Users,
  MessagesSquare,
  ShieldCheck,
  Clock,
  LayoutTemplate,
  Megaphone,
  BookImage,
  Heart,
  ContactRound,
  ReceiptText,
  Truck,
  Folders,
  ScanBarcode,
  PackageSearch
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Tasks',
          url: '/tasks',
          icon: ListTodo,
        },
        {
          title: 'Storage',
          url: '/storage',
          icon: Folders,
        },
        {
          title: 'Apps',
          url: '/apps',
          icon: Package,
        },
        {
          title: 'Chats',
          url: '/chats',
          icon: MessagesSquare,
        },
      ],
    },
    {
      title: 'CRM',
      items: [
        {
          title: 'Contacts',
          url: '/contacts',
          icon: ContactRound,
        },
        {
          title: 'Customers',
          url: '/customers',
          icon: Users,
        },
        {
          title: 'Leads',
          url: '/leads',
          icon: ContactRound,
        },
        {
          title: 'Templates',
          url: '/templates',
          icon: LayoutTemplate,
        },
        {
          title: 'Campaigns',
          url: '/campaigns',
          icon: Megaphone,
        },
        {
          title: 'Bookings',
          url: '/bookings',
          icon: BookImage,
        },
        {
          title: 'Customer Service',
          icon: Heart,
          items: [
            {
              title: 'Remind booking',
              url: '/customer/remind',
              icon: Lock,
            },
            {
              title: 'No service',
              url: '/customer/no-service',
              icon: UserX,
            },
            {
              title: 'Birthday',
              url: '/customer/birthday',
              icon: FileX,
            },
            {
              title: 'Appointment unattended',
              url: '/customer/appointment-unattended',
              icon: ServerOff,
            },
            {
              title: 'After service',
              url: '/customer/after-service',
              icon: Construction,
            },
            {
              title: 'Complaints',
              url: '/customer/complaints',
              icon: Construction,
            },
            {
              title: 'Canceled',
              url: '/customer/appointment-canceled',
              icon: Construction,
            },
          ],
        },
      ],
    },
    {
      title: 'HRM',
      items: [
        {
          title: 'Attendances',
          url: '/attendances',
          icon: Clock,
        },
        {
          title: 'Payroll',
          url: '/payroll',
          icon: ReceiptText,
        },
        {
          title: 'Users',
          url: '/users',
          icon: Users,
        },
      ],
    },
    {
      title: 'ERP',
      items: [
        {
          title: 'Variant',
          url: '/variants',
          icon: LayoutTemplate,
        },
        {
          title: 'Product',
          url: '/products',
          icon: PackageSearch,
        },
      ]
    },
    {
      title: 'Logistics',
      items: [
        {
          title: 'Shipment Order',
          url: '/shipment-order',
          icon: Truck,
        },
        {
          title: 'Code Scanner',
          url: '/code-scanner',
          icon: ScanBarcode,
        },
      ]
    },
    {
      title: 'Pages',
      items: [
        {
          title: 'Auth',
          icon: ShieldCheck,
          items: [
            {
              title: 'Sign In',
              url: '/sign-in',
            },
            {
              title: 'Sign In (2 Col)',
              url: '/sign-in-2',
            },
            {
              title: 'Sign Up',
              url: '/sign-up',
            },
            {
              title: 'Forgot Password',
              url: '/forgot-password',
            },
            {
              title: 'OTP',
              url: '/otp',
            },
          ],
        },
        {
          title: 'Errors',
          icon: Bug,
          items: [
            {
              title: 'Unauthorized',
              url: '/errors/unauthorized',
              icon: Lock,
            },
            {
              title: 'Forbidden',
              url: '/errors/forbidden',
              icon: UserX,
            },
            {
              title: 'Not Found',
              url: '/errors/not-found',
              icon: FileX,
            },
            {
              title: 'Internal Server Error',
              url: '/errors/internal-server-error',
              icon: ServerOff,
            },
            {
              title: 'Maintenance Error',
              url: '/errors/maintenance-error',
              icon: Construction,
            },
          ],
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings/profile',
              icon: UserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    }
  ],
}
