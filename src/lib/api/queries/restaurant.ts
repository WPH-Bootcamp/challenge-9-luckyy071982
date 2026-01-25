import axiosInstance from "../../../services/api/axios";

export const getRestaurants = async () => {
  try {
    // Gunakan endpoint yang benar dari Gambar 98cad5
    const response = await axiosInstance.get("/resto/recommended");
    // Kembalikan response.data.data sesuai struktur di Gambar 98619e
    return response.data.data;
  } catch (error) {
    console.error("Gagal mengambil data restaurant:", error);
    throw error;
  }
};
