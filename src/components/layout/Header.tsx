import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const session = useSession();
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="text-xl font-bold text-primary cursor-pointer"
          onClick={() => navigate("/")}
        >
          NScanner
        </div>
        <nav className="flex items-center gap-4">
          {session ? (
            <>
              <Button 
                onClick={() => navigate("/dashboard")}
                className="text-black border-black hover:bg-black/5"
              >
                Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-black text-black hover:bg-black/5"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => navigate("/login")}
                className="border-black text-black hover:bg-black/5"
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate("/register")}
                className="text-black border-black hover:bg-black/5"
              >
                Register
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}