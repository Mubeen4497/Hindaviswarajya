import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import logoImage from 'figma:asset/96f14b6013fa7443febe54311b23cd3f8d928624.png';
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToSignup: () => void;
}

// const Navigateto = useNavigate()

export default function LoginScreen({ onLogin, onSwitchToSignup }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    	try {
				const res = await axios.post("http://localhost:8000/user/login", {
					email,
					password,
				});

				alert("Login Successful!");

				// Store token if backend sends it
				if (res.data.token) {
					localStorage.setItem("token", res.data.token);
				}

				// You can redirect or call parent function if needed
				// onLogin(email, password);  // optional
			} catch (err: any) {
				const msg = err.response?.data || "Login failed. Try again.";
				alert(msg);
			}

      if (validateForm()) {
				onLogin(email, password);
			}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF3E0] via-orange-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo and Title */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <img 
              src={logoImage} 
              alt="Hindavi Swarajya Logo" 
              className="h-24 w-auto"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">"महाराजांचे स्वप्न, आमचे कर्तव्य"</p>
        </motion.div>

        {/* Login Form */}
        <Card className="p-6 lg:p-8 shadow-xl bg-[rgb(255,255,255)]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl text-center mb-6">Welcome Back</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm mb-2 text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm mb-2 text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <button type="button" className="text-[#FF6F00] hover:underline">
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FF6F00] to-[#F57C00] hover:from-[#E65100] hover:to-[#E65100] text-white"
                size="lg"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Log In
              </Button>
            </form>

            {/* Demo Credentials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <p className="text-sm text-blue-800 mb-2">
              
              </p>
              <p className="text-xs text-blue-700">
                Email: <code className="bg-blue-100 px-2 py-0.5 rounded">demo@hindaviswarajya.com</code>
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Password: <code className="bg-blue-100 px-2 py-0.5 rounded">demo123</code>
              </p>
            </motion.div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <Button
              type="button"
              variant="outline"
              className="w-full border-[#FF6F00] text-[#FF6F00] hover:bg-[#FFF3E0]"
              onClick={onSwitchToSignup}
            >
              Create New Account
            </Button>
          </motion.div>
        </Card>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-gray-500 mt-6"
        >
          "गवार राज्यापेक्षा स्वराज्य बरे"
        </motion.p>
      </motion.div>
    </div>
  );
}