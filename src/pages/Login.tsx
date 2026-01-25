import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/services/api/axios";
import { loginSchema } from "@/features/auth/authSchema";
// Gunakan path dan named import yang benar
import { AuthLayout } from "@/components/AuthLayout";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Wajib ada untuk AuthLayoutProps
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  const form = useForm({
    resolver: zodResolver(loginSchema),
    // Hapus rememberMe dari sini jika tidak ada di loginSchema
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: any) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email: values.email,
        password: values.password,
      });

      if (response.data.success) {
        dispatch(
          setCredentials({
            user: response.data.data.user,
            token: response.data.data.token,
          }),
        );
        // Redirect ke home setelah login sukses
        navigate("/");
      }
    } catch (error: any) {
      console.error(
        "Login gagal:",
        error.response?.data?.message || error.message,
      );
    }
  };

  return (
    <AuthLayout
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab);
        if (tab === "signup") navigate("/auth"); // Sesuaikan path signup Anda
      }}
    >
      <p className="text-gray-500 mb-8">Good to see you again! Let's eat</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Input
                  placeholder="Email"
                  {...field}
                  className="h-12 rounded-xl"
                />
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Input
                  type="password"
                  placeholder="Password"
                  {...field}
                  className="h-12 rounded-xl"
                />
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex items-center space-x-2 py-2">
            <Checkbox id="remember" />
            <label
              htmlFor="remember"
              className="text-sm text-gray-600 cursor-pointer"
            >
              Remember Me
            </label>
          </div>
          <Button
            type="submit"
            className="w-full h-12 bg-[#C62828] hover:bg-[#A32020] rounded-full text-lg font-semibold text-white"
          >
            Login
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}
