export default function AdminPage() {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Admin Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
              <p className="mt-2 text-gray-500">Manage users, contractors, and clients</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-medium text-gray-900">System Status</h2>
              <p className="mt-2 text-gray-500">View system health and performance</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
              <p className="mt-2 text-gray-500">Monitor recent system changes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}