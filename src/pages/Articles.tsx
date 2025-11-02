import { useState, useEffect } from "react"; 
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { BookOpen, Clock, ExternalLink, CheckCircle } from "lucide-react"; 

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const articlesData = [
  {
    id: "1",
    title: "The Importance of Grammar in English Communication",
    description: "Understanding the foundational role of grammar in effective communication.",
    level: "Beginner",
    readTime: "5 min",
    category: "Grammar",
    url: "https://5minuteenglish.com/mastering-english-grammar-for-effective-communication/",
  },
  {
    id: "2",
    title: "10 Tips to Improve Your English Vocabulary",
    description: "Practical strategies to expand your English word knowledge effectively.",
    level: "Intermediate",
    readTime: "7 min",
    category: "Vocabulary",
    url: "https://ghoorilearning.com/blogs/tips-to-improve-english-vocabulary",
  },
  {
    id: "3",
    title: "Common English Idioms and Their Meanings",
    description: "Learn popular English expressions used in everyday conversations.",
    level: "Intermediate",
    readTime: "8 min",
    category: "Idioms",
    url: "https://englishexplorer.com.sg/english-idioms",
  },
  {
    id: "4",
    title: "Business English: Professional Email Writing",
    description: "Master the art of writing clear and professional emails in English.",
    level: "Advanced",
    readTime: "10 min",
    category: "Business",
    url: "https://aforabhishek.com/online-communication-skills/",
  },
  {
    id: "5",
    title: "English Pronunciation Guide for Non-Native Speakers",
    description: "Tips and techniques to improve your English pronunciation.",
    level: "Beginner",
    readTime: "6 min",
    category: "Pronunciation",
    url: "https://www.speakometer.net/",
  },
  {
    id: "6",
    title: "Understanding English Tenses: A Complete Guide",
    description: "Comprehensive overview of all English tenses with examples.",
    level: "Intermediate",
    readTime: "12 min",
    category: "Grammar",
    url: "https://5minuteenglish.com/mastering-english-grammar-for-effective-communication/",
  },
];

const Articles = () => {
  const [filter, setFilter] = useState<string>("All");
  const { user } = useAuth();
  const { toast } = useToast();

  const [readArticles, setReadArticles] = useState<Set<string>>(new Set());
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  const categories = ["All", "Grammar", "Vocabulary", "Idioms", "Business", "Pronunciation"];
  
  const filteredArticles = filter === "All" 
    ? articlesData 
    : articlesData.filter(article => article.category === filter);

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
        .eq("content_type", "article")
        .eq("completed", true); 

      if (error) throw error;

      const readIds = new Set(data.map(item => item.content_id));
      setReadArticles(readIds);
    } catch (error: any) {
      console.error("Error loading progress:", error.message);
      toast({ variant: "destructive", title: "Error", description: "Failed to load your progress." });
    } finally {
      setIsLoadingProgress(false);
    }
  };


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

  const handleTrackProgress = async (articleId: string) => {
    if (!user) return;

    const newReadArticles = new Set(readArticles);
    newReadArticles.add(articleId);
    setReadArticles(newReadArticles);

    try {
      const { error } = await supabase
        .from("user_progress")
        .upsert(
          {
            user_id: user.id,
            content_type: "article",
            content_id: articleId,
            last_accessed: new Date().toISOString(),
            completed: true,
          },
          {
            onConflict: "user_id,content_type,content_id",
          }
        );
      
      if (error) throw error;
      
      console.log("Progress tracked for article:", articleId);

    } catch (error: any) {
      console.error("Error tracking progress:", error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your progress.",
      });
      const rolledBackArticles = new Set(readArticles);
      rolledBackArticles.delete(articleId);
      setReadArticles(rolledBackArticles);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Reading Articles</h1>
          <p className="text-lg text-muted-foreground">
            Explore curated English articles to improve your reading comprehension
          </p>
        </div>

        {/* Category Filter */}
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

        {/* Articles Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="flex flex-col shadow-card hover:shadow-elevated transition-shadow">
              <CardHeader>
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="outline" className={getLevelColor(article.level)}>
                    {article.level}
                  </Badge>
                  <Badge variant="outline">{article.category}</Badge>
                </div>
                <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {article.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {article.readTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    Read
                  </div>

                  {/* Tambahkan Indikator Completed*/}
                  {!isLoadingProgress && readArticles.has(article.id) && (
                    <Badge 
                      variant="outline" 
                      className="ml-auto border-success/20 bg-success/10 text-success"
                    >
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Completed
                    </Badge>
                  )}
                  {/* Selesai */}

                </div>
                <Button 
                  asChild 
                  className="w-full"
                  onClick={() => handleTrackProgress(article.id)}
                >
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Read Article
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Articles;