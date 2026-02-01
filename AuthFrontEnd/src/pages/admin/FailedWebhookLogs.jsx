import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import MainLayout from "../../layouts/MainLayout";

const FailedWebhookLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/users/failed")
      .then((res) => {
        setLogs(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed webhook fetch error", err);
      });
  }, []);

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-xl underline font-bold mb-4 text-center">
          Failed Webhook Logs
        </h1>
        <p className="text-xl pb-4 text-center text-gray-600">
          This page is accessible only to admin.
        </p>

        <table className="w-full border border-gray-300 border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-4 py-2">User ID</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2 text-center">Attempts</th>
              <th className="border px-4 py-2">Last Attempt</th>
              <th className="border px-4 py-2">Error</th>
            </tr>
          </thead>

          <tbody>
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <tr
                  key={log.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border px-4 py-2">{log.userId}</td>

                  <td className="border px-4 py-2 font-semibold">
                    {log.status}
                  </td>

                  <td className="border px-4 py-2 text-center">
                    {log.attemptCount}
                  </td>

                  <td className="border px-4 py-2">
                    {log.lastAttemptAt
                      ? new Date(log.lastAttemptAt).toLocaleString()
                      : "-"}
                  </td>

                  <td className="border px-4 py-2 text-red-600 text-sm">
                    {log.errorMessage || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-4 text-gray-500 border"
                >
                  No failed webhook logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

export default FailedWebhookLogs;
