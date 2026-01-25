import { Link } from "react-router-dom";
import AuthImage from "@/assets/AuthImage.svg";
import WebLogo from "@/assets/WebLogo.svg";

interface AuthLayoutProps {
  children: React.ReactNode;
  activeTab: "signin" | "signup";
  onTabChange: (tab: "signin" | "signup") => void;
}

export const AuthLayout = ({
  children,
  activeTab,
  onTabChange,
}: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* KIRI: Visual Section */}
      <div className="hidden lg:block lg:w-1/2 h-screen sticky top-0">
        <img
          src={AuthImage}
          alt="Visual"
          className="w-full h-full object-cover"
        />
      </div>

      {/* KANAN: Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Logo dengan Link ke Homepage */}
          <Link
            to="/"
            className="flex items-center gap-2 mb-6 w-fit hover:opacity-80 transition-opacity"
          >
            <img src={WebLogo} alt="Logo" className="w-8 h-8" />
            <span className="text-xl font-bold">Foody</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {activeTab === "signin" ? "Welcome Back" : "Create Account"}
            </h1>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
            <button
              type="button"
              onClick={() => onTabChange("signin")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                activeTab === "signin"
                  ? "bg-white shadow text-black"
                  : "text-gray-500"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => onTabChange("signup")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                activeTab === "signup"
                  ? "bg-white shadow text-black"
                  : "text-gray-500"
              }`}
            >
              Sign up
            </button>
          </div>

          {/* Form Area */}
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};
