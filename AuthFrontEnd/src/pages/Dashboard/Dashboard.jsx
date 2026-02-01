import { useEffect, useState } from "react";
import crmService from "../../utils/crm.service";
import MainLayout from "../../layouts/MainLayout";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await crmService.get("/crm/stats");
        setStats(res.data);
      } catch (err) {
        setError("CRM service is currently unavailable");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500">Loading dashboard data...</p>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded text-center">
            {error}
          </div>
        )}

        {!loading && !error && stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-5 shadow rounded-lg">
                <p className="text-gray-500 text-sm">Total Logins</p>
                <p className="text-3xl font-bold text-blue-700">
                  {stats.totalLogins}
                </p>
              </div>

              <div className="bg-white p-5 shadow rounded-lg">
                <p className="text-gray-500 text-sm">Unique Users</p>
                <p className="text-3xl font-bold text-green-700">
                  {stats.uniqueUsers}
                </p>
              </div>

              <div className="bg-white p-5 shadow rounded-lg">
                <p className="text-gray-500 text-sm">Total Roles</p>
                <p className="text-3xl font-bold text-purple-700">
                  {Object.keys(stats.topRoles || {}).length}
                </p>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">
                Role-wise Login Count
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(stats.topRoles || {}).map(([role, count]) => (
                  <div
                    key={role}
                    className="border rounded-md p-4 flex justify-between items-center"
                  >
                    <span className="capitalize font-medium text-gray-700">
                      {role}
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
