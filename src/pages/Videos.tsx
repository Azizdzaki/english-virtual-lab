import { useState, useEffect } from "react"; 
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; 
import { Clock, Play, CheckCircle } from "lucide-react"; 

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const videosData = [
  {
    id: "1",
    title: "English Grammar Basics: Present Simple Tense",
    description: "Learn the fundamentals of present simple tense with clear examples.",
    duration: "12:30",
    level: "Beginner",
    category: "Grammar",
    embedId: "hAU7IDSAc1E",
    thumbnail: "https://img.youtube.com/vi/hAU7IDSAc1E/0.jpg",
  },
  {
    id: "2",
    title: "Improve Your English Pronunciation",
    description: "Master English sounds and improve your accent with practical exercises.",
    duration: "15:45",
    level: "Intermediate",
    category: "Pronunciation",
    embedId: "tk50ektfwUg",
    thumbnail: "https://img.youtube.com/vi/tk50ektfwUg/0.jpg",
  },
  {
    id: "3",
    title: "Business English: Presentations Skills",
    description: "Learn how to deliver effective presentations in English.",
    duration: "18:20",
    level: "Advanced",
    category: "Business",
    embedId: "jXNhb-YkTp0",
    thumbnail: "https://img.youtube.com/vi/jXNhb-YkTp0/0.jpg",
  },
  {
    id: "4",
    title: "English Vocabulary Builder: Daily Routines",
    description: "Essential vocabulary for describing your daily activities in English.",
    duration: "10:15",
    level: "Beginner",
    category: "Vocabulary",
    embedId: "S4w1bm5XnCA",
    thumbnail: "https://img.youtube.com/vi/S4w1bm5XnCA/0.jpg",
  },
  {
    id: "5",
    title: "English Conversation Practice: At the Restaurant",
    description: "Common phrases and expressions used when dining out.",
    duration: "14:30",
    level: "Intermediate",
    category: "Conversation",
    embedId: "JjM8WUXReXU",
    thumbnail: "https://img.youtube.com/vi/JjM8WUXReXU/0.jpg",
  },
  {
    id: "6",
    title: "IELTS Speaking Test Tips and Strategies",
    description: "Expert advice for achieving high scores in IELTS speaking.",
    duration: "20:00",
    level: "Advanced",
    category: "Test Prep",
    embedId: "2rF1TEnkNfU",
    thumbnail: "https://img.youtube.com/vi/2rF1TEnkNfU/0.jpg",
  },
];

const categories = ["All", "Grammar", "Pronunciation", "Business", "Vocabulary", "Conversation", "Test Prep"];

const Videos = () => {
  const [filter, setFilter] = useState<string>("All");
  const { user } = useAuth();
  const { toast } = useToast();

  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserProgress();
    }
  }, [user]);

  const loadUserProgress = async () => {
    if (!user) return;
    setIsLoadingProgress(true);
    try {
      const { data, error } = await supabase
        .from("user_progress")
        .select("content_id")
        .eq("user_id", user.id)
        .eq("content_type", "video")
        .eq("completed", true); 

      if (error) throw error;

      const watchedIds = new Set(data.map(item => item.content_id));
      setWatchedVideos(watchedIds);
    } catch (error: any) {
      console.error("Error loading progress:", error.message);
      toast({ variant: "destructive", title: "Error", description: "Failed to load your progress." });
    } finally {
      setIsLoadingProgress(false);
    }
  };

  const filteredVideos = filter === "All"
    ? videosData
    : videosData.filter(video => video.category === filter);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-success/10 text-success border-success/20";
      case "Intermediate":
        return "bg-primary/10 text-primary border-primary/20";
      case "Advanced":
        return "bg-secondary/10 text-secondary border-secondary/20";
      default:
        return "bg-muted";
    }
  };

  const handleTrackProgress = async (videoId: string) => {
    if (!user) return;

    const newWatchedVideos = new Set(watchedVideos);
    newWatchedVideos.add(videoId);
    setWatchedVideos(newWatchedVideos);

    try {
      const { error } = await supabase
        .from("user_progress")
        .upsert(
          {
            user_id: user.id,
            content_type: "video",
            content_id: videoId,
            last_accessed: new Date().toISOString(),
            completed: true, 
          },
          {
            onConflict: "user_id,content_type,content_id",
          }
        );
      
      if (error) throw error;
      
      console.log("Progress tracked for video:", videoId);

    } catch (error: any) {
      console.error("Error tracking progress:", error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your progress.",
      });
      const rolledBackVideos = new Set(watchedVideos);
      rolledBackVideos.delete(videoId);
      setWatchedVideos(rolledBackVideos);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Video Lessons</h1>
          <p className="text-lg text-muted-foreground">
            Watch engaging videos to improve your English skills
          </p>
        </div>

        {/* FILTER KATEGORI*/}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              onClick={() => setFilter(category)}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
        {/* FITUR FILTER */}


        {/* Videos Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* filteredVideos */}
          {filteredVideos.map((video) => (
            <Card key={video.id} className="flex flex-col overflow-hidden shadow-card hover:shadow-elevated transition-shadow">
              <a
                href={`https://www.youtube.com/watch?v=${video.embedId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-video w-full overflow-hidden bg-muted block"
                onClick={() => handleTrackProgress(video.id)} 
              >
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90">
                    <Play className="h-8 w-8 text-primary" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                  <Clock className="mr-1 inline h-3 w-3" />
                  {video.duration}
                </div>
              </a>
              <CardHeader>
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="outline" className={getLevelColor(video.level)}>
                    {video.level}
                  </Badge>
                  <Badge variant="outline">{video.category}</Badge>
                </div>
                <CardTitle className="line-clamp-2">{video.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {video.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                {/* --- FITUR BADGE "COMPLETED" --- */}
                <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                  {!isLoadingProgress && watchedVideos.has(video.id) && (
                    <Badge 
                      variant="outline" 
                      className="border-success/20 bg-success/10 text-success"
                    >
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Watched
                    </Badge>
                  )}
                </div>
                {/* --- SELESAI FITUR BADGE --- */}
                
                <a
                  href={`https://www.youtube.com/watch?v=${video.embedId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  onClick={() => handleTrackProgress(video.id)} // Lacak progres saat tombol diklik
                >
                  <Play className="mr-2 h-4 w-4" fill="currentColor" />
                  Watch Video
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Videos;