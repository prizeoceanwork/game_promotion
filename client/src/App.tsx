import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Game from "@/pages/Game";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";
import './App.css'
import { useEffect } from "react";
import LoginCifuentes from "./cifuentes/pages/Login";
import AdminCifuentes from "./cifuentes/pages/Admin";
import GameCifuentes from "./cifuentes/pages/Game";
import Cifuentes from "./cifuentes/Cifuentes";

import Soflopro from "./soflopro/Soflopro"
import LoginSoflopro from "./soflopro/pages/Login";
import AdminSoflopro from "./soflopro/pages/Admin";
import GameSoflopro from "./soflopro/pages/Game";

import ApplianceGallery from "./appliancegallery/ApplianceGallery"
import LoginApplianceGallery from "./appliancegallery/pages/Login";
import AdminApplianceGallery from "./appliancegallery/pages/Admin";
import GameApplianceGallery from "./appliancegallery/pages/Game";

import SocalBuildingGroup from "./socalbuildinggroup/SocalBuildingGroup";
import LoginSocalBuildingGroup from "./socalbuildinggroup/pages/Login";
import AdminSocalBuildingGroup from "./socalbuildinggroup/pages/Admin";
import GameSocalBuildingGroup from "./socalbuildinggroup/pages/Game";

import PlayCity from "./playcity/PlayCity";
import LoginPlayCity from "./playcity/pages/Login";
import AdminPlayCity from "./playcity/pages/Admin";
import GamePlayCity from "./playcity/pages/Game";



function Router() { 
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/game"  component={Game} />
      <Route path="/admin" component={Admin} />
      <Route path="/login" component={Login} />
       <Route path="/cifuentes" component={Cifuentes} />
       <Route path="/cifuentes/login" component={LoginCifuentes} />
       <Route path="/cifuentes/admin" component={AdminCifuentes} />
      <Route path="/cifuentes/game"  component={GameCifuentes} />

       <Route path="/soflopro" component={Soflopro} />
       <Route path="/soflopro/login" component={LoginSoflopro} />
       <Route path="/soflopro/admin" component={AdminSoflopro} />
      <Route path="/soflopro/game"  component={GameSoflopro} />

       <Route path="/appliancegallery" component={ApplianceGallery} />
       <Route path="/appliancegallery/login" component={LoginApplianceGallery} />
       <Route path="/appliancegallery/admin" component={AdminApplianceGallery} />
      <Route path="/appliancegallery/game"  component={GameApplianceGallery} />

       <Route path="/socal" component={SocalBuildingGroup} />
       <Route path="/socal/login" component={LoginSocalBuildingGroup} />
       <Route path="/socal/admin" component={AdminSocalBuildingGroup} />
      <Route path="/socal/game"  component={GameSocalBuildingGroup} />

       <Route path="/playcity" component={PlayCity} />
       <Route path="/playcity/login" component={LoginPlayCity} />
       <Route path="/playcity/admin" component={AdminPlayCity} />
      <Route path="/playcity/game"  component={GamePlayCity} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {

   useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
