import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputField from "../../components/InputField";

import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";
import md5 from "md5";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.email && formData.password) {
      setLoading(true);
      try {
        const hashedPassword = md5(formData.password);

        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/users/login`,
          {
            email: formData.email,
            password: hashedPassword,
          },
        );

        const { accessToken, refreshToken } = response.data;

        login(accessToken);
        sessionStorage.setItem("refreshToken", refreshToken);

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          showConfirmButton: false,
          timer: 1500,
        });

        navigate("/home");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: error.response?.data?.message,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="workspace min-h-screen">
      <div className="bg-blue-800 h-32">
        <div className="flex flex-row items-center h-full justify-center">
          <div className="">
            <p className="text-4xl text-white font-bold uppercase">
              Assignment
            </p>
          </div>
        </div>
      </div>
      <div>
        {loading ? (
          <Loader />
        ) : (
          <div className="flex items-center justify-center py-32">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 uppercase">
                Login
              </h2>
              <form onSubmit={handleSubmit}>
                <InputField
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="Info@example.com"
                  onChange={handleChange}
                />

                <div className="relative">
                  <InputField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute top-[65%] right-3 transform -translate-y-1/2 text-black"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-700 active:scale-95 font-bold transition-transform duration-150 ease-in-out"
                >
                  Submit
                </button>

                <p className="text-center mt-4 text-sm text-gray-600">
                  Don’t have an account?{" "}
                  <span
                    onClick={() => navigate("/signup")}
                    className="text-blue-600 font-semibold cursor-pointer hover:underline"
                  >
                    Sign Up
                  </span>
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
