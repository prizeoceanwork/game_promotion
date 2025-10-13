import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "../../components/ui/button";
import ScratchCard from "../components/ScratchCard";
import logoPath from "../assets/logo.png";
import { apiRequest } from "@/lib/queryClient";
import bgGame from "../assets/bgWheel.png";
import wayCome from "../font/WayCome.otf"
import videoThumbnail from "../assets/poster.png";
import Hls from "hls.js"; 
import scratchSound from "../assets/assets_sounds_sound_scratch.mp3";
import { useRef } from "react";
import companyLogo1 from "../assets/Game-1(CIFUENTES INSTALLATIONS)/Assets/CIFUENTES INSTALLATIONS  LOGO.png";




interface ScratchCardData {
  id: number;
  isWinner: boolean;
  scratches: boolean[];
  prizes: string[];
  prizeValues: string[];
}

export default function GameCifuentes() {
  // Add custom font style for game page
  const wayComeFontStyle = {
    fontFamily: "WayCome, sans-serif",
    fontWeight: "bold",
  };

 useEffect(() => {
  if (typeof document !== "undefined" && wayCome) {
    const font = new FontFace("WayCome", `url(${wayCome})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    }).catch((err) => console.error("Font failed to load:", err));
  }
}, []);


  const [, setLocation] = useLocation();


  // Security: Check for registered user data
  const [userRegistrationData, setUserRegistrationData] = useState<any>(null);
  

 useEffect(() => {
    const hlsUrl =
      "https://res.cloudinary.com/dziy5sjas/video/upload/sp_auto/v1/Michael_Patrick_-_PART_2_D4UP_Scratch_Win_1_blonkc.m3u8";

    const video = document.getElementById("game-video") as HTMLVideoElement;

    if (video) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari native HLS
        video.src = hlsUrl;
      }
    }
  }, []);
  
  useEffect(() => {
    // Check if user came from registration
    const regData = localStorage.getItem('userRegistrationData');
    if (!regData) {
      // If no registration data, redirect to home
      setLocation('/cifuentes');
      return;
    }
    
    try {
      const parsedData = JSON.parse(regData);
      setUserRegistrationData(parsedData);
    } catch (error) {
      // If invalid data, redirect to home
      setLocation('/cifuentes');
    }
  }, [setLocation]);
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [hideCard2Prizes, setHideCard2Prizes] = useState(false);
  const [showLosePopup, setShowLosePopup] = useState(false);
  const [cards, setCards] = useState<ScratchCardData[]>([
    {
      id: 1,
      isWinner: false,
      scratches: new Array(9).fill(false),
      prizes: [
        "Free Standing Refrigerator New Water Line Installation",
        "Master Bathroom Sink New Hot Water Valve & Line Installation",
        "Washer New Hot & Cold Water Lines Installation",
        "Dishwasher New Water Valve Installation",
        "Kitchen Sink New Hot Water Valve & Line Installation",
        "Cooktop, Range, or Stove New Gas Line Installation",
        "Garbage Disposal New Drain Hose Installation",
        "Dishwasher New Air Cap Installation",
        "Master Bathroom Sink New Cold Water Valve & Line Installation",
      ],
      prizeValues: [
        "$197value",
        "$397value",
        "$247value",
        "$197value",
        "$397value",
        "$197value",
        "$147value",
        "$197value",
        "$397value",
      ],
    },
    {
      id: 2,
      isWinner: true,
      scratches: new Array(9).fill(false),
      prizes: [
        "Gas Dryer New Gas Line Installation",
        "Dishwasher New Water Valve Installation",
        "Dishwasher New Water Valve Installation",
        "Master Bathroom Sink New Hot Water Valve & Line Installation",
        "Over The Range Microwave & Hood Venting Retaped Pro Style",
        "Dishwasher New Water Valve Installation",
        "Kitchen Sink New Cold Water Valve & Line Installation",
        "Washer New Hot & Cold Water Lines Installation",
        "Free Standing Refrigerator New Water Line Installation",
      ],
      prizeValues: [
        "$247value",
        "$197value",
        "$197value",
        "$397value",
        "$147value",
        "$197value",
        "$397value",
        "$247value",
        "$197value",
      ],
    },
  ]);
  const [gameComplete, setGameComplete] = useState(false); 
const [winnerCard, setWinnerCard] = useState<ScratchCardData | null>(null);

  const [firstCardComplete, setFirstCardComplete] = useState(false);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [winnerEmail, setWinnerEmail] = useState("");
  const [winnerName, setWinnerName] = useState("");
  const [emailSending, setEmailSending] = useState(false);

  // Confetti component with brand colors that loops continuously
  const Confetti = () => {
    const [confettiKey, setConfettiKey] = useState(0);

    // Regenerate confetti pieces every 5 seconds to create continuous effect
    useEffect(() => {
      const interval = setInterval(() => {
        setConfettiKey(prev => prev + 1);
      }, 5000);

      return () => clearInterval(interval);
    }, []);

    const confettiPieces = Array.from({ length: 80 }, (_, i) => {
      // Use only brand colors
      const colors = ["#2C5CDC", "#F76D46", "#ffb22a"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 12 + 6;
      const leftPos = Math.random() * 100;
      const animationDelay = Math.random() * 3;
      const animationDuration = 3 + Math.random() * 2;

      return (
        <div
          key={`${confettiKey}-${i}`}
          className="absolute"
          style={{
            left: `${leftPos}%`,
            top: "-20px",
            backgroundColor: color,
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: Math.random() > 0.7 ? "50%" : "0%",
            animationDelay: `${animationDelay}s`,
            animationDuration: `${animationDuration}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `confetti-fall ${animationDuration}s ease-out ${animationDelay}s forwards`,
          }}
        />
      );
    });

    return (
      <div className="fixed inset-0 pointer-events-none z-[60]">
        <style>{`
          @keyframes confetti-fall {
            0% {
              transform: translateY(-100vh) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
        `}</style>
        {confettiPieces}
      </div>
    );
  };

  const handleScratch = (cardId: number, index: number) => {
    // Completely block scratching Card 2 until Card 1 is complete
    if (cardId === 2 && !firstCardComplete) {
      setShowWarningPopup(true);
      setHideCard2Prizes(true);
      return;
    }

    setCards((prev) =>
      prev.map((card) => {
        if (card.id === cardId) {
          const newScratches = [...card.scratches];
          newScratches[index] = true;
          return { ...card, scratches: newScratches };
        }
        return card;
      }),
    );

    // Check if this specific card is fully scratched
    const updatedCard = cards.find((card) => card.id === cardId);
    if (updatedCard) {
      const cardFullyScratched = updatedCard.scratches.every(
        (_, i) => i === index || updatedCard.scratches[i],
      );

      // If it's the first card and it's fully scratched
      if (cardId === 1 && cardFullyScratched) {
        setFirstCardComplete(true);
        // Clear any warning states when Card 1 is completed
        setShowWarningPopup(false);
        setHideCard2Prizes(false);
        
        // Show lose popup if first card is not a winner
        if (!updatedCard.isWinner) {
          setShowLosePopup(true);
        }
      }

      // If it's the second card (winner card) and it's fully scratched
      if (cardId === 2 && cardFullyScratched) {
        // Check for three matching "Dishwasher" prizes
        const dishwasherCount = updatedCard.prizes.filter((prize) =>
          prize.includes("Dishwasher New Water Valve Installation"),
        ).length;

        if (dishwasherCount >= 3) {
          setWinnerCard(updatedCard);
          setShowConfetti(true);
          setGameComplete(true);
          // Use registration data for email if available
          if (userRegistrationData) {
            sendWinnerEmailWithRegistrationData(userRegistrationData);
          } else {
            setShowEmailPrompt(true);
          }
        } else {
          // Second card complete but not a winner
          setTimeout(() => setGameComplete(true), 1000);
        }
      }
    }
  };

  const handleCardScratchComplete = (cardId: number) => {
    const card = cards.find((c) => c.id === cardId);
    if (card && card.isWinner) {
      setWinnerCard(card);
      setGameComplete(true);
    }
  };

  const isCardFullyScratched = (card: ScratchCardData) => {
    return card.scratches.every((scratch) => scratch);
  };

  const sendWinnerEmail = async () => {
    if (!winnerEmail || !winnerName) return;
    
    setEmailSending(true);
    setGameComplete(true);
    setShowEmailPrompt(false);
    try {
      await apiRequest("POST", "/api/email/winner", {
        userEmail: winnerEmail,
        userName: winnerName,
        prizeName: "Dishwasher New Water Valve Installation",
        prizeValue: "$591",
        phoneNumber: "(619) 871-2110"
      });
    
    } catch (error) {
     setEmailSending(false);
    } 
  };

  const sendWinnerEmailWithRegistrationData = async (regData: any) => {
    setEmailSending(true);
    
    try {
      await apiRequest("POST", "/api/email/winner", {
        userEmail: regData.email,
        userName: regData.name,
        prizeName: "Dishwasher New Water Valve Installation",
        prizeValue: "$591",
        phoneNumber: regData.phone
      });
      
    } catch (error) {
      setEmailSending(false);
    } 
  };

  const resetGame = () => {
    setCards((prev) =>
      prev.map((card) => ({
        ...card,
        scratches: new Array(9).fill(false),
      })),
    );
    setGameComplete(false);
    setWinnerCard(null);
    setFirstCardComplete(false);
    setShowConfetti(false);
    setShowWarningPopup(false);
    setHideCard2Prizes(false);
    setShowEmailPrompt(false);
    setWinnerEmail("");
    setWinnerName("");
  };

    const videoRef = useRef<HTMLVideoElement | null>(null);

useEffect(() => {
  if (gameComplete && winnerCard && videoRef.current) {

    const hlsUrl =
      "https://res.cloudinary.com/dziy5sjas/video/upload/sp_auto/v1/D4UP_Joint_Venture_Trailer_-_Byron_Cifuentes_SAN_DIEGO_COUNTY_EXCLUSIVE_rghsqn.m3u8";

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(videoRef.current);
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = hlsUrl;
    }
  }
}, [gameComplete, winnerCard]);


const newVideoRef = useRef<HTMLVideoElement | null>(null);

useEffect(() => {
  if (gameComplete && winnerCard && newVideoRef.current) {
    const hlsUrl =
      "https://res.cloudinary.com/dziy5sjas/video/upload/sp_auto/v1/Michael_Patrick_-_D4U_Scratch_Win_Part_2_NEW_V2_1_ycelxn.m3u8";

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(newVideoRef.current);
    } else if (newVideoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      newVideoRef.current.src = hlsUrl;
    }
  }
}, [gameComplete, winnerCard]);

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        /* Default desktop sizes */
        .prize-text-line1 {
          font-size: 6px;
        }
        .prize-text-line2, .prize-text-line3 {
          font-size: 5px;
        }
        .prize-text-value {
          font-size: 6px;
        }
        
        /* Mobile sizes - even smaller */
        @media (max-width: 768px) {
          .prize-text-line1 {
            font-size: 4px;
          }
          .prize-text-line2, .prize-text-line3 {
            font-size: 3px;
          }
          .prize-text-value {
            font-size: 4px;
          }
        }
        
        /* Extra small mobile */
        @media (max-width: 480px) {
          .prize-text-line1 {
            font-size: 3px;
          }
          .prize-text-line2, .prize-text-line3 {
            font-size: 2.5px;
          }
          .prize-text-value {
            font-size: 3px;
          }
        }
          
         
        
      `}</style>
      {/* Header Section with Logo */}
      <div className="px-4 py-4 " style={{ backgroundColor: "#ffb22a" }}>
        <div className="flex items-center sm:px-32 justify-between max-w-8xl mx-auto">
          <div className="flex items-center space-x-1">
            <div className="bg-white p-2 rounded-lg  ">
              <img
                src={companyLogo1}
                alt="Done For You Pros"
                className="h-14 sm:h-16 md:h-20 w-auto object-contain"
              />
            </div>
            <div className="bg-white p-2 rounded-lg ">
              <img
                src={logoPath}
                alt="Done For You Pros"
                className="h-14 sm:h-16 md:h-20 w-auto object-contain"
              />
            </div>
           
          </div>
          <div className="text-right">
            <h2
              className="text-lg md:text-2xl lg:text-3xl font-bold text-white"
              style={{
                ...wayComeFontStyle,
                textShadow: "3px 3px 6px rgba(0,0,0,0.7)",
                letterSpacing: "1px",
              }}
            >
              $5 MILLION{" "}
              <span
                style={{
                  color: "#000",
                  textShadow: "2px 2px 4px rgba(255,255,255,0.8)",
                }}
              >
                INSTANT PRIZES
              </span>
            </h2>
          </div>
        </div>
      </div>

      {/* Game Introduction Section */}
      <div className="text-center py-8 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h1
            className="text-3xl md:text-3xl lg:text-3xl font-bold mb-2"
            style={{
              ...wayComeFontStyle,
              color: "#DEB406",
              letterSpacing: "2px",
              lineHeight: "1.1",
            }}
          >
            IT'S TIME TO PLAY OUR SCRATCH &
          </h1>
          <h1
            className="text-3xl md:text-3xl lg:text-3xl font-bold mb-6"
            style={{
              ...wayComeFontStyle,
              color: "#DEB406",
              letterSpacing: "2px",
              lineHeight: "1.1",
            }}
          >
            WIN GAME
          </h1>
          <h2
            className="text-2xl md:text-2xl lg:text-2xl font-bold"
            style={{
              ...wayComeFontStyle,
              color: "#10155E",
              letterSpacing: "1px",
            }}
          >
            2 CHANCES TO WIN AMAZING PRIZES! 
          </h2>
        </div>
      </div>

      {/* Game Cards Section */}
      <div className="py-8 px-4 ">
        <div className="max-w-6xl maxwidth-lp mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 ">
            {cards.map((card) => (
              <ScratchOffCard
                key={card.id}
                card={card}
                onScratch={handleScratch}
                onScratchComplete={() => handleCardScratchComplete(card.id)}
                isFullyScratched={isCardFullyScratched(card)}
                hidePrizes={card.id === 2 && hideCard2Prizes}
                onInitialCardTouch={
                  card.id === 2 && !firstCardComplete
                    ? () => {
                        setShowWarningPopup(true);
                        setHideCard2Prizes(true);
                      }
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="py-2" style={{ backgroundColor: "#ffb22a" }}>
        <div className="bg-black text-white py-4 text-center">
          <p
            className="text-lg md:text-xl font-bold"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Our 20 Connection New Parts Installations Program
          </p>
          <p
            className="text-lg md:text-xl font-bold"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            is already Protecting 300,000+ Home Owners nationwide
          </p>
        </div>
      </div>

      {/* Warning Popup */}
      {showWarningPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-sm mx-4 shadow-2xl border-4 border-orange-500">
            <div className="text-center">
              <h3
                className="text-lg sm:text-xl font-bold mb-2 text-orange-600"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Hold On!
              </h3>
              <p
                className="text-sm sm:text-base text-gray-700 mb-4"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Please scratch the first card completely before moving to the
                second card.
              </p>
              <button
                onClick={() => {
                  setShowWarningPopup(false);
                  setHideCard2Prizes(false);
                }}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg font-semibold text-sm hover:from-orange-600 hover:to-red-600 transition-colors cursor-pointer"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Complete Card 1 First!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lose Popup for First Card */}
      {showLosePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#DEB406] via-[#DEB406]  to-[#10155E] p-4 rounded-3xl max-w-md w-full mx-4 shadow-2xl animate-float">
            <div className="bg-white rounded-2xl p-6 text-center">
              
              <h3
                className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-blue-500 "
                style={wayComeFontStyle}
              >
                OOPS!
              </h3>
              
              <p
                className="text-md mb-6 text-gray-700 leading-relaxed"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                You didn't win this round, but <strong>don't give up!</strong>
              </p>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg mb-6 border-2 border-yellow-400 animate-glow">
                <p
                  className="text-base font-semibold text-orange-800 mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  🎁 You still have a chance to win big!
                </p>
                <p
                  className="text-sm text-gray-600"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Try your luck with Card 2 and you could win amazing prizes!
                </p>
              </div>
              
              <button
                onClick={() => setShowLosePopup(false)}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 animate-button-pulse"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                🎲 Get My Second Card!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Collection Prompt */}
      {showEmailPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
          <div className="bg-gradient-to-br from-[#DEB406] via-[#DEB406]  to-[#10155E] p-3 sm:p-4 md:p-5 rounded-3xl max-w-sm sm:max-w-md w-full mx-3 sm:mx-4 shadow-2xl">
            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-7 text-center">
              <div className="text-4xl sm:text-5xl mb-4 animate-bounce">🎉</div>
              
              <h3
                className="text-2xl sm:text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-red-600"
                style={wayComeFontStyle}
              >
                YOU WON!
              </h3>
              
              <p
                className="text-sm sm:text-base mb-4 text-gray-700"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Enter your details to receive your prize confirmation email and claim your <strong>$591 Dishwasher Installation</strong>!
              </p>
              
              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={winnerName}
                  onChange={(e) => setWinnerName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-center font-semibold"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                />
                
                <input
                  type="email"
                  placeholder="Your Email Address"
                  value={winnerEmail}
                  onChange={(e) => setWinnerEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-center font-semibold"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={sendWinnerEmail}
                  disabled={!winnerEmail || !winnerName || emailSending}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {emailSending ? "Sending..." : "🎁 Claim Prize"}
                </button>
                
                <button
                  onClick={() => {
                    setShowEmailPrompt(false);
                    setTimeout(() => setGameComplete(true), 500);
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Winner Modal */}
  {gameComplete && winnerCard && (
        <div
          className="fixed inset-0 bg-black flex items-center justify-center z-50 p-3"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            fontFamily:
              'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          <div className="bg-[#DEB406]  p-3 rounded-2xl w-full max-w-md mx-3 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-white rounded-xl p-4 text-center relative overflow-hidden">
              
              {/* 🎥 First video */}
              <div className="my-4">
                <video
                  ref={newVideoRef}
                  controls
                  autoPlay
                  muted
                  playsInline
                  className="w-full rounded-lg shadow-md"
                  poster={videoThumbnail}
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* 📞 Call-to-action */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-lg mb-3 shadow-md">
                <h4 className="text-base mb-2">CLAIM YOUR PRIZE!</h4>
                <div className="bg-white text-gray-900 p-2 rounded shadow-inner mb-2">
                  <p className="text-sm font-semibold text-blue-600">📞 CALL NOW</p>
                  <p className="text-lg text-green-600">(619) 871-2110</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-2 rounded shadow-inner">
                  <p
                    className="text-xs font-light"
                    style={{
                      fontWeight: "bold",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    ✉️ Check your email for confirmation!
                  </p>
                </div>
              </div>

              {/* 🎥 Second video */}
                  

              {/* Professionals Section */}
              <div className="bg-[#DEB406] text-white p-3 rounded-lg mb-4 shadow-md">
                <h3 className="text-lg font-bold">
                  MEET OUR AMAZING SAN DIEGO INSTALLATION PROFESSIONALS
                </h3>
              </div>
                    <div className="my-4">
                <video
                  ref={videoRef}
                  controls
                  className="w-full rounded-lg shadow-md"
                  poster={videoThumbnail}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              {/* Back Button */}
              <button
                onClick={() => {
                  setShowConfetti(false);
                  localStorage.removeItem("userRegistrationData");
                  setLocation("/cifuentes");
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-6 rounded-lg text-sm"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Confetti */}
      {showConfetti && <Confetti />}

      {/* Non-Winner Modal */}
      {gameComplete && !winnerCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 md:p-6">
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-lg text-center max-w-md md:max-w-lg mx-4 shadow-2xl">
            <h3
              className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-600"
              style={wayComeFontStyle}
            >
              Try Again!
            </h3>
            <p
              className="text-lg md:text-xl mb-6 md:mb-8"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              No winning matches this time, but you can try again!
            </p>
            <div className="flex space-x-4 md:space-x-6">
              <Button onClick={resetGame} className="flex-1 text-base md:text-lg py-3 md:py-4">
                Play Again
              </Button>
              <Button
                onClick={() => setLocation("/cifuentes")}
                variant="outline"
                className="flex-1 text-base md:text-lg py-3 md:py-4"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ScratchOffCardProps {
  card: ScratchCardData;
  onScratch: (cardId: number, index: number) => void;
  onScratchComplete?: () => void;
  isFullyScratched: boolean;
  hidePrizes?: boolean;
  onInitialCardTouch?: () => void;
}

function ScratchOffCard({
  card,
  onScratch,
  isFullyScratched,
  hidePrizes = false,
  onInitialCardTouch,
}: ScratchOffCardProps) {
  // Add custom font style for game page
  const wayComeFontStyle = {
    fontFamily: "WayCome, sans-serif",
    fontWeight: "bold",
  };

  const [scratchedCells, setScratchedCells] = useState<boolean[]>(
    card.scratches,
  );
  const [hoveredContent, setHoveredContent] = useState<string | null>(null);

  const scratchAudioRef = useRef<HTMLAudioElement | null>(null);
   useEffect(() => {
  scratchAudioRef.current = new Audio(scratchSound);
  scratchAudioRef.current.loop = true;
  scratchAudioRef.current.volume = 0.7;

  const handleStop = () => stopScratchSound();
  document.addEventListener("mouseup", handleStop);
  document.addEventListener("touchend", handleStop);

  return () => {
    document.removeEventListener("mouseup", handleStop);
    document.removeEventListener("touchend", handleStop);
    stopScratchSound(); // cleanup on unmount
  };
}, []);



  const startScratchSound = () => {
  if (scratchAudioRef.current) {
    scratchAudioRef.current.currentTime = 0;
    scratchAudioRef.current.play().catch(() => {});
  }
};

const stopScratchSound = () => {
  if (scratchAudioRef.current) {
    scratchAudioRef.current.pause();
    scratchAudioRef.current.currentTime = 0;
  }
};

  const handleCellScratch = (index: number) => {
    const newScratched = [...scratchedCells];
    newScratched[index] = true;
    setScratchedCells(newScratched);
    onScratch(card.id, index);
    // console.log("Cell scratched:", card.prizes);
  const isMobile = window.innerWidth < 426;
  if (isMobile) {
    setHoveredContent(
      hidePrizes ? "?" : `${card.prizes[index]} ${card.prizeValues[index]}`
    );
    setTimeout(() => setHoveredContent(null), 3000);

  }
  };

  useEffect(() => {
    setScratchedCells(card.scratches);
  }, [card.scratches]);

  return (
    <div className="flex justify-center">
      <div className="relative wheel-size-lgmb wheel-size-sm wheel-size-tab wheel-size-laptop wheel-size-md wheel-size-xl  w-[415px] h-[415px] md:w-96 md:h-96 lg:w-[480px] lg:h-[480px]">
        {/* Colorful circular background - using your wheel image */}
        <div
          className="absolute inset-0 rounded-full bg-cover bg-center bg-no-repeat wheel-container "
          style={{
            backgroundImage: `url(${bgGame})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
       {hoveredContent && (
        <div className="fixed top-4 left-4 z-50 bg-yellow-400 border-2 border-yellow-400 p-4 rounded shadow-lg w-40 h-40 flex items-center justify-center">
          <div className="text-center hovertext  w-full h-full flex flex-col justify-center items-center p-1 font-[Montserrat,sans-serif] text-[0.65rem] leading-tight">
            {/* Prize Text Lines */}
            <div className="prize-text-line1 hovertext font-bold leading-none mb-0.5 max-w-full break-words">
              {hoveredContent.split(" ").slice(0, 2).join(" ")}
            </div>
            <div className="prize-text-line2 hovertext leading-none mb-0.5 max-w-full break-words">
              {hoveredContent.split(" ").slice(2, 5).join(" ")}
            </div>
            <div className="prize-text-line3 hovertext leading-none mb-0.5 max-w-full break-words">
              {hoveredContent.split(" ").slice(5, -1).join(" ")}
            </div>
            {/* Prize Value (last word) */}
            <div className="prize-text-value hovertext font-bold text-green-600 leading-none max-w-full">
              {hoveredContent.split(" ").slice(-1)}
            </div>
          </div>
        </div>
      )}



        {/* Inner content area */}
        <div className="absolute inset-4  rounded-full flex flex-col items-center justify-center p-3 md:p-4">
          {/* Match 3 Header */}
          <div className="text-center mb-2 md:mb-3">
            <div className="flex items-center justify-center mb-1 margintop">
              <span
                className="text-white font-bold text-xl md:text-2xl lg:text-4xl mr-2"
                style={{
                  ...wayComeFontStyle,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                }}
              >
                MATCH
              </span>
              <div className="bg-yellow-400 rounded-full w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 flex items-center justify-center">
                <span
                  className="text-white font-bold text-lg md:text-xl lg:text-2xl"
                  style={{
                    ...wayComeFontStyle,
                    textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                  }}
                >
                  3
                </span>
              </div>
            </div>
            <p
              className="text-white font-bold text-sm md:text-lg lg:text-xl"
              style={{
                ...wayComeFontStyle,
                textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
              }}
            >
              & YOU WIN!
            </p>
          </div>

           <style>{`

             @media (max-width: 2560px) {
                   
                     .wheel-container-xl {
                      font-size : 11px
                    }
                      .card-size-xl  {
                      width: 100px ;
                      height: 100px ;
                    }
                      .wheel-size-xl  {
                      width: 580px ;
                      height: 580px ;
                    }
                  }
            @media (max-width: 1440px) {
                   .margintop{
                   margin-top: -30px;
                   }
                   
                   .maxwidth-lp{
                    max-width: 2550px;
                   }
                     .wheel-container-xl {
                      font-size : 14px
                    }
                      .card-size-xl  {
                      width: 130px ;
                      height: 130px ;
                    }
                      .wheel-size-xl  {
                      width: 700px ;
                      height: 700px ;
                    }
                  }
                     @media (max-width: 1024px) {
                   
                     .wheel-container-laptop {
                      font-size : 9px
                    }
                      .card-size-laptop  {
                      width: 80px ;
                      height: 80px ;
                    }
                      .wheel-size-laptop  {
                      width: 480px ;
                      height: 480px ;
                    }
                  }

                   @media (max-width: 768px) {
                   
                     .wheel-container-tab {
                      font-size : 10px
                    }
                      .card-size-tab  {
                      width: 100px ;
                      height: 100px ;
                    }
                      .wheel-size-tab  {
                      width: 550px ;
                      height: 550px ;
                    }
                  }

                  @media (max-width: 426px) {
                    .wheel-container-lg {
                      font-size : 8px
                    }
                    .card-size-lg{
                    width: 78px;
                    height: 78px
                    }
                    .hovertext{
                    font-size : 15px
                    }
                    .wheel-size-lgmb  {
                      width: 420px ;
                      height: 420px ;
                    }
                  }
                   @media (max-width: 376px) {
                    .wheel-container-md {
                      font-size : 7px
                    }
                    .card-size-md{
                    width: 65px;
                    height: 65px
                    }
                    .wheel-size-md {
                      width: 360px ;
                      height: 360px ;
                    }
                  }
                     @media (max-width: 321px) {
                    .wheel-container-sm {
                      font-size : 4px
                    }
                    .card-size-sm{
                    width: 45px;
                    height: 45px
                    }
                    .wheel-size-sm  {
                      width: 310px ;
                      height: 310px ;
                    }
                  }
                `}</style>
              
          {/* Scratch Grid */}
          <div className="grid grid-cols-3 gap-1 mb-3 md:mb-4">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
              
                className=" card-size-sm card-size-md card-size-lg  card-size-tab  card-size-laptop card-size-xl w-19 h-19  md:w-12  md:h-12 lg:w-18 lg:h-18 border-2 border-yellow-400 relative overflow-hidden"
              >
                
                {scratchedCells[index] ? (
                  <div className="w-full h-full  bg-yellow-400 text-black flex items-center justify-center p-0.5 overflow-hidden">
                    <div
                      className="text-center w-full h-full flex flex-col justify-center"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {hidePrizes ? (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <div className="text-xs text-gray-600 font-bold">
                            ?
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-0.5 w-full h-full flex flex-col justify-center items-center">
                          
                          <div className="prize-text-line1 wheel-container-sm wheel-container-tab wheel-container-md wheel-container-lg wheel-container-xl wheel-container-laptop font-bold leading-none mb-0.5 max-w-full break-words"
                        >
                            {card.prizes[index]
                              .split(" ")
                              .slice(0, 2)
                              .join(" ")}
                          </div>
                          <div className="prize-text-line2 wheel-container-sm wheel-container-tab wheel-container-md wheel-container-lg wheel-container-xl wheel-container-laptop leading-none mb-0.5 max-w-full break-words">
                            {card.prizes[index]
                              .split(" ")
                              .slice(2, 5)
                              .join(" ")}
                          </div>
                          <div className="prize-text-line3  wheel-container-sm wheel-container-tab wheel-container-md wheel-container-lg wheel-container-xl  wheel-container-laptop leading-none mb-0.5 max-w-full break-words">
                            {card.prizes[index].split(" ").slice(5).join(" ")}
                          </div>
                          <div className="prize-text-value  wheel-container-sm wheel-container-tab wheel-container-md wheel-container-lg wheel-container-xl wheel-container-laptop font-bold text-green-600 leading-none max-w-full">
                            {card.prizeValues[index]}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <ScratchCard
                    width={56} // w-14 = 56px
                    height={56}
                    scratchPercent={40}
                    onScratchComplete={() => handleCellScratch(index)}
                    onInitialTouch={() => {
                      onInitialCardTouch?.();  
                      startScratchSound();   
                    }}

                  >
                    <div className="w-full h-full bg-yellow-400 text-black flex items-center justify-center p-0.5 overflow-hidden">
                      <div
                        className="text-center w-full h-full flex flex-col justify-center"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {hidePrizes ? (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <div className="text-xs text-gray-600 font-bold">
                              ?
                            </div>
                          </div>
                        ) : (
                          <div className="text-center p-0.5 w-full h-full flex flex-col justify-center items-center">
                            <div className="prize-text-line1 wheel-container-sm wheel-container-tab wheel-container-md wheel-container-lg wheel-container-xl  wheel-container-laptop font-bold leading-none mb-0.5 max-w-full break-words">
                              {card.prizes[index]
                                .split(" ")
                                .slice(0, 2)
                                .join(" ")}
                            </div>
                            <div className="prize-text-line2 wheel-container-sm wheel-container-tab wheel-container-md wheel-container-lg  wheel-container-xl wheel-container-laptop leading-none mb-0.5 max-w-full break-words">
                              {card.prizes[index]
                                .split(" ")
                                .slice(2, 5)
                                .join(" ")}
                            </div>
                            <div className="prize-text-line3 wheel-container-sm wheel-container-tab wheel-container-md wheel-container-lg wheel-container-xl  wheel-container-laptop leading-none mb-0.5 max-w-full break-words">
                              {card.prizes[index].split(" ").slice(5).join(" ")}
                            </div>
                            <div className="prize-text-value wheel-container-sm wheel-container-tab wheel-container-md wheel-container-lg wheel-container-xl wheel-container-laptop font-bold text-green-600 leading-none max-w-full">
                              {card.prizeValues[index]}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </ScratchCard>
                  
                )}
              </div>
            ))}
          </div>

          {/* Play Now Button */}
          <div
            className="bg-yellow-400 text-black font-bold py-1 px-4 md:px-6 rounded text-sm md:text-lg"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {isFullyScratched
              ? card.isWinner
                ? "WINNER!"
                : "TRY AGAIN"
              : "PLAY NOW"}
          </div>
        </div>
      </div>
    </div>
  );
}
