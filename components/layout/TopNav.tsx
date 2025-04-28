import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavItem } from '../../lib/navigation/types';

export function TopNav({ tabs }: { tabs: NavItem[] }) {
  const pathname = usePathname()
  
  return (
    <div className="flex gap-x-8 border-b border-gray-200">
      {tabs.map((tab) => (
        <Link 
          key={tab.name}
          href={tab.href!} 
          className="px-0.5 pb-1 font-medium text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 data-[current=true]:border-blue-600 data-[current=true]:text-blue-700"
          data-current={tab.href === pathname}
        >
          {tab.name}
        </Link>
      ))}
    </div>
  )
}
