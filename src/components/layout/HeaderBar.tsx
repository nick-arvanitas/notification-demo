import { TopNav } from './TopNav';

interface HeaderBarProps {
  title: string;
  tabs?: { name: string; href: string }[];
  subnavigation?: { name: string; href: string }[];
}

export default function HeaderBar({ title, tabs = [], subnavigation }: HeaderBarProps) {
  return (
    <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold leading-6 text-gray-900">{title}</h1>
        {subnavigation && subnavigation.length > 0 && <TopNav tabs={subnavigation} />}
      </div>
    </div>
  );
}
