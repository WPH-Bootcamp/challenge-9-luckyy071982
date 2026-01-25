import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import { loginSchema, registerSchema } from "@/features/auth/authSchema";
import { useLogin, useRegister } from "@/services/queries/useAuth";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { setCredentials } from "@/features/auth/authSlice";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState<"signin" | "signup">(
    location.state?.initialTab || "signin",
  );

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  useEffect(() => {
    if (location.state?.initialTab) {
      setActiveTab(location.state.initialTab);
    }
  }, [location.state]);

  const {
    register: regLogin,
    handleSubmit: handleLogin,
    formState: { errors: errLogin },
    reset: resetLogin,
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const {
    register: regSignUp,
    handleSubmit: handleSignUp,
    formState: { errors: errSignUp },
    reset: resetSignUp,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onLoginSubmit = (data: any) => {
    loginMutation.mutate(data, {
      onSuccess: (response: any) => {
        const userData = response.data?.data?.user || response.data?.user;
        const tokenData = response.data?.data?.token || response.data?.token;

        if (tokenData) {
          dispatch(
            setCredentials({
              user: userData,
              token: tokenData,
            }),
          );
          toast.success("Login Berhasil!");
          resetLogin();
          navigate("/", { replace: true });
        }
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Login Gagal!");
      },
    });
  };

  const onRegisterSubmit = (data: any) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Akun berhasil dibuat! Silakan login.");
        resetSignUp();
        setActiveTab("signin");
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Registrasi Gagal!");
      },
    });
  };

  return (
    <AuthLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="w-full">
        <p className="text-gray-500 mb-8">
          {activeTab === "signin"
            ? "Good to see you again! Let's eat"
            : "Join us and start your culinary journey"}
        </p>

        {activeTab === "signin" ? (
          <form
            key="form-signin"
            onSubmit={handleLogin(onLoginSubmit)}
            className="space-y-4"
          >
            <div className="space-y-1">
              <input
                {...regLogin("email")}
                type="email"
                placeholder="Email"
                className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none transition-all"
              />
              {errLogin.email && (
                <p className="text-red-500 text-xs">
                  {errLogin.email.message as string}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <div className="relative">
                <input
                  {...regLogin("password")}
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errLogin.password && (
                <p className="text-red-500 text-xs">
                  {errLogin.password.message as string}
                </p>
              )}
            </div>
            <Button
              disabled={loginMutation.isPending}
              className="w-full h-12 bg-[#C62828] hover:bg-[#A32020] font-bold rounded-xl text-white transition-all active:scale-95 disabled:opacity-70"
            >
              {loginMutation.isPending ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        ) : (
          <form
            key="form-signup"
            onSubmit={handleSignUp(onRegisterSubmit)}
            className="space-y-3"
          >
            <div className="space-y-1">
              <input
                {...regSignUp("name")}
                placeholder="Full Name"
                className="w-full h-11 px-4 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-red-500"
              />
              {errSignUp.name && (
                <p className="text-red-500 text-xs">
                  {errSignUp.name.message as string}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <input
                {...regSignUp("email")}
                type="email"
                placeholder="Email"
                className="w-full h-11 px-4 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-red-500"
              />
              {errSignUp.email && (
                <p className="text-red-500 text-xs">
                  {errSignUp.email.message as string}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <input
                {...regSignUp("phone")}
                type="tel"
                placeholder="Phone Number"
                className="w-full h-11 px-4 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-red-500"
              />
              {errSignUp.phone && (
                <p className="text-red-500 text-xs">
                  {errSignUp.phone.message as string}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <div className="relative">
                <input
                  {...regSignUp("password")}
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  className="w-full h-11 px-4 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-2.5 text-gray-400"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errSignUp.password && (
                <p className="text-red-500 text-xs">
                  {errSignUp.password.message as string}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <div className="relative">
                <input
                  {...regSignUp("confirmPassword")}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full h-11 px-4 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2.5 text-gray-400"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errSignUp.confirmPassword && (
                <p className="text-red-500 text-xs">
                  {errSignUp.confirmPassword.message as string}
                </p>
              )}
            </div>
            <Button
              disabled={registerMutation.isPending}
              className="w-full h-12 bg-[#C62828] hover:bg-[#A32020] font-bold rounded-xl text-white mt-2 transition-all active:scale-95 disabled:opacity-70"
            >
              {registerMutation.isPending ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                "Register"
              )}
            </Button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
