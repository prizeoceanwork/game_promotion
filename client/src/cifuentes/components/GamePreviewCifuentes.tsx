import { useQuery } from "@tanstack/react-query";
import gameCardImage from "../assets/homepage.png";
import { apiRequest } from "@/lib/queryClient";

type StatsResponse = {
  registrationCount: number;
};



export default function GamePreviewCifuentes() {
  const { data: stats } = useQuery<StatsResponse>({
    queryKey: ["/api/stats"],
    queryFn: async () => {
      const res = await apiRequest("GET" ,"/api/cifuentes/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });

  return (
    <section className="bg-gradient-to-r from-[#DEB406] via-[#DEB406]  to-[#10155E] py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl uppercase md:text-5xl font-black text-white mb-4">
           Homeowners all over the country are winning our amazing prizes! Are you next?
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
            IT'S TIME TO PLAY OUR SCRATCH & WIN GAME
          </h3>
          <p className="text-xl font-bold text-white">
            2 CHANCES TO WIN AMAZING PRIZES!
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Game Card Preview */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-8 transform hover:scale-105 transition-all duration-300 max-w-4xl w-full">
              <img
                src={gameCardImage}
                alt="Scratch & Win Game Card"
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
          </div>

          {/* Trust Indicator */}
         <div className="text-center bg-white bg-opacity-90 rounded-xl p-6 max-w-5xl mx-auto">
            <p className="text-[hsl(225,47%,32%)] font-bold text-lg mb-2">
             OVER 1 MILLION APPLIANCE CONNECTION PARTS PROFESSIONALY INSTALLED AND TESTED!
            </p>
             <div className="hidden">

            {
              stats ? (
                <p className="text-[hsl(225,47%,32%)] font-semibold text-2xl">
                  Join <span className="text-red-500">{stats.registrationCount.toLocaleString()}</span> homeowners who have already registered!
                </p>
              ) : (
                <p className="text-[hsl(225,47%,32%)] font-semibold text-2xl">
                  Loading registration stats...
                </p>
              )
            }
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
