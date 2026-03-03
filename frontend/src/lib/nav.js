import {
  LayoutDashboard,
  Inbox,
  AlertTriangle,
  ClipboardCheck,
  ShoppingBag,
  MessageSquareText,
  MessageCircleHeart,
  ShieldCheck,
} from 'lucide-react'

export const navItems = [
  { key: 'dashboard', label: 'Dashboard', to: '/', Icon: LayoutDashboard },
  {
    key: 'found',
    label: 'Found Items',
    to: '/found',
    Icon: Inbox,
    color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
  },
  {
    key: 'lost',
    label: 'Lost Items',
    to: '/lost',
    Icon: AlertTriangle,
    color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
  },
  {
    key: 'claims',
    label: 'Claims',
    to: '/claims',
    Icon: ClipboardCheck,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
  },
  {
    key: 'market',
    label: 'Marketplace',
    to: '/marketplace',
    Icon: ShoppingBag,
    color: 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100',
  },
  {
    key: 'social',
    label: 'Social Feed',
    to: '/social',
    Icon: MessageSquareText,
    color: 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100',
  },
  {
    key: 'feedback',
    label: 'Feedback',
    to: '/feedback',
    Icon: MessageCircleHeart,
    color: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100',
  },
  // Admin page is shown in nav but you can hide it based on role later
  {
    key: 'admin',
    label: 'Admin Panel',
    to: '/admin',
    Icon: ShieldCheck,
    color: 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200',
  },
]
