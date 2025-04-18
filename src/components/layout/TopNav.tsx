import Link from 'next/link'

export function TopNav({ tabs }: { tabs: { name: string, href: string }[] }) {
  return (
    <div className="flex gap-4">
      {tabs.map((tab) => (
        <Link 
          key={tab.name}
          href={tab.href} 
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          {tab.name}
        </Link>
      ))}
    </div>
  )
}
