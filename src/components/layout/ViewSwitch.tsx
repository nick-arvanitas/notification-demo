import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function ViewSwitch()  {
    const pathname = usePathname();
    const router = useRouter();

    const routes = {
        admin: '/admin/contractors',
        client: '/client/home',
        contractor: '/contractor/home'
    };

    return (
        <div className="flex flex-col gap-2 dark -mx-2">
          <Select
            value={pathname.split('/')[1] || 'admin'}
            onValueChange={(value) => router.push(routes[value as keyof typeof routes])}
          >
            <SelectTrigger className="w-full dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              <SelectItem value="admin" className="dark:text-gray-100 dark:hover:bg-gray-700">Admin View</SelectItem>
              <SelectItem value="client" className="dark:text-gray-100 dark:hover:bg-gray-700">Client View</SelectItem>
              <SelectItem value="contractor" className="dark:text-gray-100 dark:hover:bg-gray-700">Contractor View</SelectItem>
            </SelectContent>
          </Select>
        </div>
    );
  }