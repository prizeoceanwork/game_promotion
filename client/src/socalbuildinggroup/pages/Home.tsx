import Header from "../components/Header";
import VideoSection from "../components/VideoSection";
import GamePreview from "../components/GamePreview";
import RegistrationForm from "../components/RegistrationForm";
import Footer from "../components/Footer";
import { useState } from "react";
import companyLogo from "../assets/SOCAL-2.png";
import logoImage from "../assets/logo.png"; 


export default function Home() {
  const [videoWatched, setVideoWatched] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-800  to-gray-600 py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-4 h-4 bg-yellow-300 rounded-full animate-float" style={{ top: '20%', left: '10%' }}></div>
          <div className="absolute w-6 h-6 bg-white rounded-full animate-bounce-slow" style={{ top: '70%', left: '15%' }}></div>
          <div className="absolute w-3 h-3 bg-yellow-300 rounded-full animate-pulse" style={{ top: '40%', right: '20%' }}></div>
          <div className="absolute w-5 h-5 bg-white rounded-full animate-float" style={{ bottom: '30%', right: '10%' }}></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-10xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
               OFFICIAL SPONSOR
            </h1>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-6 ">
            <div className="glowing-element-socialbuildinggroup " >
             <img
              src={companyLogo}
              alt="Done For You Pros"
              className="h-17 md:h-25 w-auto object-contain "
            />
            </div>
             <div className="hidden md:block w-2 h-40 bg-white rounded-full  glowing-element-line"></div>
             <div className="block md:hidden  w-80 h-2 bg-white rounded-full  glowing-element-line"></div>
            <div className="glowing-element-appliancegallery-logo" >
             <img
              src={logoImage}
              alt="Done For You Pros"
              className="h-20 md:h-30 w-auto object-contain"
            />
            </div>
          </div>
            {/* Star Rating */}
            <div className="flex justify-center mb-8">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-6 h-6 md:w-8 md:h-8 text-[#FFDF20]">
                    <svg fill="currentColor" viewBox="0 0 20 20" className="w-full h-full">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
             <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-semibold mb-2 px-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
           OUR SHARED VISION TO PROVIDE HOMEOWNERS EXCEPTIONAL SERVICES BROUGHT US TOGETHER!
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-semibold mb-8 px-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Watch our Video to see the Amazing Prizes you can WIN to protect your home!
              <br />
              You get to play TWO of our Scratch and Win Games! Yes, TWO chances to be an INSTANT WINNER,
              <span className="text-[#FFDF20]  font-black block sm:inline"> $5 Million</span> in Instant Prizes!
            </p>
          </div>
        </div>
      </section>

      <VideoSection onVideoComplete={() => setVideoWatched(true)} />
      <GamePreview />
      <RegistrationForm videoWatched={videoWatched} />
      <Footer />
    </div>
  );
}
