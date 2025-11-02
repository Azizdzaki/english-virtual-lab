import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trophy, CheckCircle, XCircle } from "lucide-react";

const quizData = {
  title: "English Grammar & Vocabulary Quiz",
  questions: [
    {
      id: 1,
      question: "Which sentence is grammatically correct?",
      options: [
        "She don't like coffee.",
        "She doesn't likes coffee.",
        "She doesn't like coffee.",
        "She not like coffee.",
      ],
      correctAnswer: 2,
    },
    {
      id: 2,
      question: "What is the past tense of 'go'?",
      options: ["Goed", "Went", "Gone", "Going"],
      correctAnswer: 1,
    },
    {
      id: 3,
      question: "Choose the correct word: 'I have ___ homework to do.'",
      options: ["many", "much", "a lot", "few"],
      correctAnswer: 1,
    },
    {
      id: 4,
      question: "What does the idiom 'break the ice' mean?",
      options: [
        "To damage frozen water",
        "To start a conversation in a social situation",
        "To end a relationship",
        "To make someone cold",
      ],
      correctAnswer: 1,
    },
    {
      id: 5,
      question: "Which preposition completes this sentence? 'I'm interested ___ learning English.'",
      options: ["on", "at", "in", "for"],
      correctAnswer: 2,
    },
  ],
};

const Quiz = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    quizData.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = async () => {
    if (selectedAnswers.length !== quizData.questions.length) {
      toast({
        variant: "destructive",
        title: "Incomplete Quiz",
        description: "Please answer all questions before submitting.",
      });
      return;
    }

    setIsSubmitting(true);
    const score = calculateScore();

    try {
      const { error } = await supabase.from("quiz_results").insert({
        user_id: user?.id,
        quiz_title: quizData.title,
        score: score,
        total_questions: quizData.questions.length,
      });

      if (error) throw error;

      setShowResults(true);
      toast({
        title: "Quiz Submitted!",
        description: `You scored ${score} out of ${quizData.questions.length}`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / quizData.questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="container py-12">
          <Card className="mx-auto max-w-2xl shadow-elevated">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary">
                <Trophy className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
              <CardDescription className="text-lg">
                Here are your results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="mb-2 text-6xl font-bold text-primary">
                  {percentage.toFixed(0)}%
                </div>
                <p className="text-xl text-muted-foreground">
                  You scored {score} out of {quizData.questions.length}
                </p>
              </div>

              <div className="space-y-4">
                {quizData.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="rounded-lg border p-4"
                  >
                    <div className="mb-2 flex items-start gap-2">
                      {selectedAnswers[index] === question.correctAnswer ? (
                        <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{question.question}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Your answer: {question.options[selectedAnswers[index]]}
                        </p>
                        {selectedAnswers[index] !== question.correctAnswer && (
                          <p className="mt-1 text-sm text-success">
                            Correct answer: {question.options[question.correctAnswer]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button onClick={handleRetake} className="flex-1">
                  Retake Quiz
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <a href="/dashboard">Back to Dashboard</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const question = quizData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="container py-12">
        <Card className="mx-auto max-w-2xl shadow-elevated">
          <CardHeader>
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
                <span>Question {currentQuestion + 1} of {quizData.questions.length}</span>
                <span>{progress.toFixed(0)}% Complete</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-gradient-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <CardTitle className="text-2xl">{quizData.title}</CardTitle>
            <CardDescription>Choose the best answer for each question</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-semibold">{question.question}</h3>
              <RadioGroup
                value={selectedAnswers[currentQuestion]?.toString()}
                onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              >
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              {currentQuestion === quizData.questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || selectedAnswers[currentQuestion] === undefined}
                  className="bg-accent hover:bg-accent/90"
                >
                  {isSubmitting ? "Submitting..." : "Submit Quiz"}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQuestion] === undefined}
                >
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;
