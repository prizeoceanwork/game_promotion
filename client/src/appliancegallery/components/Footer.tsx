import { Phone } from "lucide-react";
import logoImage from "../assets/logo.png";
import companyLogo2 from "../assets/Game-1(CIFUENTES INSTALLATIONS)/Assets/FAUCETS AND FIXTURES LOGO.png";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
           
            <img
              src={logoImage}
              alt="Done For You Pros"
              className="h-12 md:h-16 w-auto object-contain mr-3"
            />
            <img
              src={companyLogo2}
              alt="Done For You Pros"
              className="h-12 md:h-15 w-auto object-contain"
            />
          </div>
          
          {/* Copyright and Contact */}
          <div className="text-center">
            <p className="text-gray-700 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              All Rights Reserved © 2025 | Done For You Pros | 
              <a 
                href="tel:3102956355" 
                className="text-[#F76D46] hover:text-[#2C5CDC] transition-colors ml-1"
              >
                <Phone className="inline mr-1" size={16} />
                Call Now: (619) 871-2110
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
