import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import InputField from "../../components/InputField";
import Loader from "../../components/Loader";
import md5 from "md5";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      Swal.fire("Error", "All fields are required", "error");
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }

    try {
      setLoading(true);

      const hashedPassword = md5(password);

      await axios.post(`${process.env.REACT_APP_BASE_URL}/users/signup`, {
        username,
        email,
        password: hashedPassword,
      });

      Swal.fire({
        icon: "success",
        title: "Signup Successful",
        text: "Please login to continue",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/login");
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";

      Swal.fire("Signup Failed", message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workspace min-h-screen">
      <div className="bg-blue-800 h-32">
        <div className="flex items-center justify-center h-full">
          <p className="text-4xl text-white font-bold uppercase">ASSignment</p>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="flex items-center justify-center py-32">
          <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 uppercase">
              Sign Up
            </h2>

            <form onSubmit={handleSubmit}>
              <InputField
                label="Username"
                type="text"
                name="username"
                placeholder="Enter username"
                onChange={handleChange}
              />

              <InputField
                label="Email"
                type="email"
                name="email"
                placeholder="abc@example.com"
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
              </div>

              <div className="relative">
                <InputField
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute top-[65%] right-3 transform -translate-y-1/2 text-black"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-700 active:scale-95 font-bold transition-transform duration-150"
              >
                Create Account
              </button>

              <p className="text-center mt-4 text-sm text-gray-600">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-blue-600 font-semibold cursor-pointer hover:underline"
                >
                  Login
                </span>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
