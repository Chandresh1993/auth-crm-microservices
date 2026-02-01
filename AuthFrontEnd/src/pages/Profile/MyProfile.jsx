import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import MainLayout from "../../layouts/MainLayout";

const MyProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axiosInstance.get("/users/me").then((res) => {
      setUser(res.data);
    });
  }, []);

  const roleStyle = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-red-50 text-red-700 border-red-200";
      case "manager":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-green-50 text-green-700 border-green-200";
    }
  };

  return (
    <MainLayout>
      <div className="p-8 flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">
              Profile Overview
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Your account information
            </p>
          </div>

          {user ? (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="px-6 py-5 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-lg font-medium text-gray-800">
                      {user.email}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-1 text-sm font-medium rounded-full border ${roleStyle(
                      user.accessRole,
                    )}`}
                  >
                    {user.accessRole}
                  </span>
                </div>
              </div>

              <div className="px-6 py-6 grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium text-gray-800">{user.username}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-mono text-sm text-gray-700 truncate">
                    {user.id || "—"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border rounded-lg p-6 text-center text-gray-500">
              Loading profile information...
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default MyProfile;
