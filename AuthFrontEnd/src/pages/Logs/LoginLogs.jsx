import { useEffect, useState } from "react";
import crmService from "../../utils/crm.service";
import MainLayout from "../../layouts/MainLayout";

const LoginLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    crmService.get("/crm/logins").then((res) => {
      setLogs(res.data.data);
    });
  }, []);

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-xl underline font-bold mb-4 text-center ">
          Login Logs
        </h1>

        <table className="w-full border border-gray-300 border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">IP</th>
              <th className="border px-4 py-2">Login Date</th>
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
                  <td className="border px-4 py-2">
                    {new Date(log.loginAt).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-4 text-gray-500 border"
                >
                  No login records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

export default LoginLogs;
