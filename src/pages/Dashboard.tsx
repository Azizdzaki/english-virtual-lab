import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Video, Trophy, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-learning.jpg";

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [averageScore, setAverageScore] = useState(0);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadStats();
    }
  }, [user]);

  const loadProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();
    setProfile(data);
  };

  const loadStats = async () => {
    const { data: quizzes } = await supabase
      .from("quiz_results")
      .select("*")
      .eq("user_id", user?.id);

    if (quizzes && quizzes.length > 0) {
      setTotalQuizzes(quizzes.length);
      const avg = quizzes.reduce((acc, q) => acc + (q.score / q.total_questions) * 100, 0) / quizzes.length;
      setAverageScore(Math.round(avg));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/80" />
        </div>
        <div className="container relative py-20">
          <div className="max-w-3xl">
            <h1 className="mb-4 text-5xl font-bold text-white">
              Welcome back, {profile?.full_name || "Student"}!
            </h1>
            <p className="text-xl text-white/90">
              Continue your English learning journey with interactive materials, videos, and quizzes.
            </p>
          </div>
        </div>
      </section>

      <div className="container py-12">
        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalQuizzes}</div>
              <p className="text-xs text-muted-foreground">Completed assessments</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore}%</div>
              <p className="text-xs text-muted-foreground">Across all quizzes</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
              <Trophy className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">🔥 Keep going!</div>
              <p className="text-xs text-muted-foreground">Stay consistent</p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Reading Articles</CardTitle>
              <CardDescription>
                Explore curated English articles to improve your reading comprehension and vocabulary.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/articles">Browse Articles</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <Video className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle>Video Lessons</CardTitle>
              <CardDescription>
                Watch engaging video content covering grammar, pronunciation, and conversation skills.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="secondary" className="w-full">
                <Link to="/videos">Watch Videos</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Trophy className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Interactive Quizzes</CardTitle>
              <CardDescription>
                Test your knowledge with quizzes on grammar, vocabulary, and comprehension.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-accent hover:bg-accent/90">
                <Link to="/quiz">Take Quiz</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* About Section */}
        <Card className="mt-8 shadow-card">
          <CardHeader>
            <CardTitle>About English Virtual Lab</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Welcome to the English Virtual Lab, an interactive learning platform designed specifically 
              for TPB ITB students. This platform combines modern web technologies with proven language 
              learning methodologies to create an engaging educational experience.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-semibold text-foreground">Key Features:</h4>
                <ul className="list-inside list-disc space-y-1">
                  <li>Personalized learning dashboard</li>
                  <li>Progress tracking and analytics</li>
                  <li>Interactive reading materials</li>
                  <li>Video lessons with transcripts</li>
                  <li>Self-assessment quizzes</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-foreground">Technology Stack:</h4>
                <ul className="list-inside list-disc space-y-1">
                  <li>React + TypeScript frontend</li>
                  <li>Authentication system</li>
                  <li>Cloud database storage</li>
                  <li>Responsive modern design</li>
                  <li>Real-time progress sync</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;