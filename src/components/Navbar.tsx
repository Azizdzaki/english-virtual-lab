import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, Home, Video, FileText, Trophy, User, LogOut } from "lucide-react";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold">English Lab</span>
        </Link>

        {user && (
          <div className="flex items-center gap-2">
            <Button
              variant={isActive("/dashboard") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button
              variant={isActive("/articles") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/articles">
                <FileText className="mr-2 h-4 w-4" />
                Articles
              </Link>
            </Button>
            <Button
              variant={isActive("/videos") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/videos">
                <Video className="mr-2 h-4 w-4" />
                Videos
              </Link>
            </Button>
            <Button
              variant={isActive("/quiz") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/quiz">
                <Trophy className="mr-2 h-4 w-4" />
                Quiz
              </Link>
            </Button>
            <Button
              variant={isActive("/profile") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
