import { Phone } from "lucide-react";
import logoImage from "../assets/logo.png"; 
import companyLogo4 from "../assets/SOCAL-2.png";

export default function HeaderSocialBuildingGroup() {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex py-5  items-center">
             <img
              src={companyLogo4}
              alt="Done For You Pros"
              className="h-8 sm:h-10 md:h-16 -mt-5 w-auto object-contain"
            />
            <img
              src={logoImage}
              alt="Done For You Pros"
              className="h-8 sm:h-12 md:h-16 w-auto object-contain mr-3"
            />
          </div>

          {/* Contact Information */}
          <div className="flex items-center">
            <div className="hidden md:flex items-center text-[#2C5CDC] bg-gray-50 rounded-full px-4 py-2">
              <Phone className="text-[#F76D46] mr-2" size={18} />
              <span
                className="font-bold text-sm"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                CALL NOW: (619) 871-2110
              </span>
            </div>
            <a
              href="tel:3102956355"
              className="md:hidden bg-[#F76D46] text-white rounded-full p-3 hover:bg-[#2C5CDC] transition-colors"
            >
              <Phone size={20} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
