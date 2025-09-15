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
import LoginCifuentes from "./cifuentes/pages/LoginCifuentes";
import AdminCifuentes from "./cifuentes/pages/AdminCifuentes";
import GameCifuentes from "./cifuentes/pages/GameCifuentes";
import Cifuentes from "./cifuentes/Cifuentes";

import Soflopro from "./soflopro/Soflopro"
import LoginSoflopro from "./soflopro/pages/LoginSoflopro";
import AdminSoflopro from "./soflopro/pages/Adminsoflopro";
import GameSoflopro from "./soflopro/pages/Gamesoflopro";

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
