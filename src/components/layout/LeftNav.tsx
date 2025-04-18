import { cn } from '@/lib/utils';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
  
  
  interface NavItem {
    name: string;
    href: string;
    icon: IconProp;
    current: boolean;
  }
  
  interface LeftNavProps {
    navigation: NavItem[];
  }
  
  export default function LeftNav({ navigation }: LeftNavProps) {
    const pathname = usePathname(); 
    return (
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
        <div className="flex h-16 shrink-0 items-center">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            className="h-8 w-auto"
          />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        'group flex gap-x-2 rounded-md p-2 text-sm/6 font-semibold items-center',
                        pathname === item.href
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      )}
                    >
                      <FontAwesomeIcon icon={item.icon} className="size-6 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            
            <li className="mt-auto">
              <Link
                href="/settings"
                className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <FontAwesomeIcon icon={faCog} className="size-6 shrink-0" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    )
  }
  