import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../utils/axiosInstance";
import MainLayout from "../../layouts/MainLayout";

const LoginHistory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/users/login-history");
      setLogs(res.data.data || []);
    } catch (err) {
      setError("Unable to load login history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Login History</h1>

        {loading && (
          <p className="text-center text-gray-500">Loading login history...</p>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded text-center">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="w-full border border-gray-200 border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border px-4 py-3">Email</th>
                  <th className="border px-4 py-3">Role</th>
                  <th className="border px-4 py-3">IP</th>
                  <th className="border px-4 py-3">User Agent</th>
                  <th className="border px-4 py-3">Login Time</th>
                </tr>
              </thead>

              <tbody>
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <tr
                      key={log.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="border px-4 py-2">{log.email}</td>
                      <td className="border px-4 py-2">{log.role}</td>
                      <td className="border px-4 py-2">{log.ip}</td>
                      <td className="border px-4 py-2 truncate max-w-xs">
                        {log.userAgent}
                      </td>
                      <td className="border px-4 py-2">
                        {new Date(log.loginAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-6 text-gray-500 border"
                    >
                      No login history found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default LoginHistory;
