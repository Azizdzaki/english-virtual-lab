import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, GraduationCap, Trophy, Video } from "lucide-react";
import heroImage from "@/assets/hero-learning.jpg";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-secondary/85" />
        </div>
        <div className="container relative py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="mb-6 text-6xl font-bold text-white">
              English Virtual Lab
            </h1>
            <p className="mb-8 text-xl text-white/90">
              Interactive learning platform for TPB ITB students. Master English through articles, videos, and quizzes.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="bg-white text-primary hover:bg-white/90"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/auth")}
                className="border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold">Why Choose English Virtual Lab?</h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive learning experience with modern technology
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Curated Articles</h3>
            <p className="text-muted-foreground">
              Access high-quality English articles covering grammar, vocabulary, and more
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-secondary/10">
              <Video className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Video Lessons</h3>
            <p className="text-muted-foreground">
              Watch engaging video content to improve pronunciation and comprehension
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-accent/10">
              <Trophy className="h-8 w-8 text-accent" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Interactive Quizzes</h3>
            <p className="text-muted-foreground">
              Test your knowledge and track your progress with instant feedback
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-primary py-20">
        <div className="container text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">
            Ready to Start Learning?
          </h2>
          <p className="mb-8 text-xl text-white/90">
            Join English Virtual Lab today and enhance your English skills
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-white text-primary hover:bg-white/90"
          >
            Create Your Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
