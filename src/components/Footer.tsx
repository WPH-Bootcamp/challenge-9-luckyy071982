import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
} from "react-icons/fa";
import WebLogo from "@/assets/WebLogo.svg";

export const Footer = () => {
  return (
    <footer className="bg-[#0B0D17] text-white pt-16 pb-10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[120px]">
        {/* Konten Utama: Stack di mobile, Grid di desktop */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-12 lg:gap-20 mb-16">
          {/* Bagian Brand & Deskripsi */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-6">
              <img
                src={WebLogo}
                alt="Foody"
                className="w-10 h-10 lg:w-12 lg:h-12"
              />
              <span className="text-2xl lg:text-3xl font-bold">Foody</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-8 text-sm lg:text-base">
              Enjoy homemade flavors & chef's signature dishes, freshly prepared
              every day. Order online or visit our nearest branch.
            </p>

            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-lg">Follow on Social Media</h4>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                >
                  <FaFacebookF size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                >
                  <FaInstagram size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                >
                  <FaLinkedinIn size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                >
                  <FaTiktok size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Bagian Link Navigation */}
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-10 lg:gap-32">
            {/* Explore Column */}
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-lg mb-2">Explore</h4>
              <ul className="flex flex-col gap-3 text-gray-400 text-sm lg:text-base">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    All Food
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Nearby
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Discount
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Best Seller
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Delivery
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Lunch
                  </a>
                </li>
              </ul>
            </div>

            {/* Help Column */}
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-lg mb-2">Help</h4>
              <ul className="flex flex-col gap-3 text-gray-400 text-sm lg:text-base">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    How to Order
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Payment Methods
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Track My Order
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Garis Pemisah Tipis (Opsional, sesuai estetika Figma) */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500 text-xs lg:text-sm">
            © 2026 Foody. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
