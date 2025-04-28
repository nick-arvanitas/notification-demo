import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 max-w-4xl w-full">
        <Link
          href="/client"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Client Portal</h2>
          <p className="text-gray-600">Access your client dashboard and manage your bookings</p>
        </Link>
        
        <Link
          href="/contractor"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Contractor Portal</h2>
          <p className="text-gray-600">Manage your services and client interactions</p>
        </Link>
        
        <Link
          href="/admin"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Admin Portal</h2>
          <p className="text-gray-600">System administration and management</p>
        </Link>
      </div>
    </div>
  );
}
