import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, updateUser } from "@/features/auth/authSlice";
import axiosInstance from "@/services/api/axios";
import { useUpdateProfile } from "@/services/queries/useAuth";
import {
  HiOutlineLocationMarker,
  HiOutlineClipboardList,
  HiOutlineLogout,
  HiOutlineCamera,
} from "react-icons/hi";
import { toast } from "sonner";

export const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useSelector((state: any) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const updateProfileMutation = useUpdateProfile();

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/auth/profile");
      if (data.success) {
        dispatch(updateUser(data.data));
        setFormData({
          name: data.data.name,
          phone: data.data.phone || "",
        });
        setPreviewUrl(data.data.avatar);
      }
    } catch (error: any) {
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    if (selectedFile) {
      data.append("avatar", selectedFile);
    }

    try {
      const response = await updateProfileMutation.mutateAsync(data);
      if (response.success) {
        toast.success("Profile updated successfully");
        dispatch(updateUser(response.data));
        setIsEditing(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FEFBF0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D63031]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFBF0] flex flex-col">
      <Header />

      <main className="flex-grow pt-24 lg:pt-32 pb-20 px-4 lg:px-10 max-w-[1200px] mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-64 bg-white rounded-[2rem] p-6 shadow-sm h-fit border border-gray-50">
            <div className="flex items-center gap-3 mb-8 px-2">
              <img
                src={user?.avatar || "https://i.pravatar.cc/150"}
                alt="avatar"
                className="w-12 h-12 rounded-full border-2 border-red-50 object-cover"
              />
              <span className="font-bold text-gray-900 truncate">
                {user?.name}
              </span>
            </div>
            <nav className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-[#D63031] rounded-xl transition-all cursor-pointer text-left">
                <HiOutlineLocationMarker className="text-xl" />
                <span className="font-medium">Delivery Address</span>
              </button>
              <button
                onClick={() => navigate("/orders")}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-[#D63031] rounded-xl transition-all cursor-pointer text-left"
              >
                <HiOutlineClipboardList className="text-xl" />
                <span className="font-medium">My Orders</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-[#D63031] rounded-xl transition-all mt-4 cursor-pointer text-left"
              >
                <HiOutlineLogout className="text-xl" />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </aside>

          <section className="flex-1">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
              Profile
            </h1>

            <div className="bg-white rounded-[2.5rem] p-6 lg:p-12 shadow-sm border border-gray-50 max-w-2xl">
              <div className="flex flex-col items-center lg:items-start mb-10">
                <div className="relative group">
                  <img
                    src={previewUrl || "https://i.pravatar.cc/150"}
                    alt="profile"
                    className="w-24 h-24 lg:w-32 lg:h-32 rounded-full border-4 border-white shadow-md object-cover"
                  />
                  <label className="absolute bottom-0 right-0 bg-[#D63031] p-2 rounded-full text-white cursor-pointer shadow-lg hover:scale-110 transition-transform">
                    <HiOutlineCamera size={20} />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center py-5 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">Name</span>
                  {isEditing ? (
                    <input
                      className="text-right font-bold outline-none border-b border-red-200 focus:border-[#D63031] bg-transparent"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  ) : (
                    <span className="text-gray-900 font-bold text-right">
                      {user?.name}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center py-5 border-b border-gray-50 text-gray-400">
                  <span className="font-medium">Email</span>
                  <span className="font-bold text-right italic">
                    {user?.email}
                  </span>
                </div>

                <div className="flex justify-between items-center py-5 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">
                    Nomor Handphone
                  </span>
                  {isEditing ? (
                    <input
                      className="text-right font-bold outline-none border-b border-red-200 focus:border-[#D63031] bg-transparent"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  ) : (
                    <span className="text-gray-900 font-bold text-right">
                      {user?.phone || "-"}
                    </span>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="flex gap-4 mt-12">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-100 text-gray-600 font-bold py-4 rounded-full transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={updateProfileMutation.isPending}
                    className="flex-[2] bg-[#D63031] text-white font-bold py-4 rounded-full shadow-lg shadow-red-100 hover:bg-[#b52829] disabled:bg-gray-400 transition-all cursor-pointer"
                  >
                    {updateProfileMutation.isPending
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-12 bg-[#D63031] text-white font-bold py-4 rounded-full shadow-lg shadow-red-100 hover:bg-[#b52829] transition-all cursor-pointer"
                >
                  Update Profile
                </button>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
