"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  generateBehavioralQuestions,
  analyzeBehavioralResponse,
  saveBehavioralResult
} from "@/actions/interview";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { Mic, Square, Play, CheckCircle2, XCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function BehavioralQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [results, setResults] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [speechSupported, setSpeechSupported] = useState(true);
  const [timeSpent, setTimeSpent] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  const {
    loading: generatingQuestions,
    fn: fetchQuestionsFn,
    data: questions,
  } = useFetch(generateBehavioralQuestions);

  const {
    loading: analyzing,
    fn: analyzeResponseFn,
    data: analysisData,
  } = useFetch(analyzeBehavioralResponse);

  const {
    loading: savingResult,
    fn: saveResultFn,
    data: finalResultData,
  } = useFetch(saveBehavioralResult);

  useEffect(() => {
    fetchQuestionsFn();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
      }
    }
  }, []);

  const countFillerWords = (text) => {
    const fillers = ["um", "uh", "like", "you know", "basically", "actually"];
    let count = 0;
    const lowerText = text.toLowerCase();
    fillers.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      const matches = lowerText.match(regex);
      if (matches) count += matches.length;
    });
    return count;
  };

  const startRecording = () => {
    if (!speechSupported) {
      toast.error("Speech recognition is not supported in your browser.");
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      
      recognition.onstart = () => {
        setIsRecording(true);
        setTranscription("");
        setTimeSpent(0);
        
        timerRef.current = setInterval(() => {
          setTimeSpent((prev) => prev + 1);
        }, 1000);
      };
      
      recognition.onresult = (event) => {
        let finalTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
        setTranscription(finalTranscript);
      };
      
      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (event.error !== "no-speech") {
          toast.error(`Recording error: ${event.error}`);
          stopRecording();
        }
      };

      recognition.onend = () => {
        // Handle auto-stop or continuous loop if needed
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      toast.error("Could not start microphone.");
    }
  };

  const stopRecording = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    clearInterval(timerRef.current);
    setIsRecording(false);

    if (transcription.trim().length < 10) {
      toast.error("Response too short. Please try again.");
      return;
    }

    const fillerCount = countFillerWords(transcription);
    const questionText = questions[currentQuestion];
    
    // Process response via AI
    await analyzeResponseFn(questionText, transcription, timeSpent, fillerCount);
  };

  const handleNext = async () => {
    // Save current result
    const currentResult = {
      question: questions[currentQuestion],
      transcript: transcription,
      score: analysisData?.score || 0,
      feedback: analysisData?.feedback || "",
      starAnalysis: analysisData?.starAnalysis || {},
      timeSpent,
      fillerCount: countFillerWords(transcription)
    };
    
    const updatedResults = [...results, currentResult];
    setResults(updatedResults);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTranscription("");
      setTimeSpent(0);
      // Reset the analysis hook state is tricky with custom useFetch,
      // but we can rely on it being overwritten by the next call.
    } else {
      setQuizFinished(true);
      await saveResultFn(updatedResults);
    }
  };

  if (generatingQuestions) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <BarLoader className="mb-4" width={"100%"} color="gray" />
        <p className="text-muted-foreground">Preparing behavioral questions...</p>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <Card className="mx-auto max-w-lg mt-10">
        <CardHeader>
          <CardTitle>Error Generating Interview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Failed to load questions. Please try again.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={fetchQuestionsFn}>Retry</Button>
        </CardFooter>
      </Card>
    );
  }

  if (quizFinished) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Interview Complete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You have completed the behavioral interview!</p>
            {savingResult && <p className="text-muted-foreground">Saving your results...</p>}
            
            <div className="grid gap-4 mt-6">
              {results.map((r, i) => (
                <Card key={i} className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="text-lg">Q\${i+1}: {r.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm font-semibold">Your Answer (\${r.timeSpent}s, \${r.fillerCount} filler words):</p>
                    <p className="text-sm italic border-l-2 pl-4 py-1">"\${r.transcript}"</p>
                    <p className="text-sm font-semibold mt-4">AI Feedback (Score: \${r.score}/100):</p>
                    <ReactMarkdown className="text-sm prose prose-sm dark:prose-invert">
                      {r.feedback}
                    </ReactMarkdown>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.href = "/interview"}>
              Back to Interview Prep
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const hasAnalysis = analysisData && !analyzing && !isRecording;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Question {currentQuestion + 1} of {questions.length}</CardTitle>
            <span className="text-sm text-muted-foreground">{timeSpent}s</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-xl font-medium">{question}</p>
          
          <div className="p-4 bg-muted/50 rounded-lg min-h-[100px] border">
            {transcription ? (
              <p className="text-sm">{transcription}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic flex items-center justify-center h-full">
                {isRecording ? "Listening..." : "Your spoken response will appear here..."}
              </p>
            )}
          </div>

          {!hasAnalysis && (
            <div className="flex justify-center mt-6">
              {!isRecording ? (
                <Button 
                  size="lg" 
                  onClick={startRecording} 
                  className="rounded-full h-16 w-16 bg-blue-600 hover:bg-blue-700"
                  disabled={analyzing}
                >
                  <Mic className="h-8 w-8 text-white" />
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  onClick={stopRecording} 
                  variant="destructive"
                  className="rounded-full h-16 w-16 animate-pulse"
                >
                  <Square className="h-6 w-6" />
                </Button>
              )}
            </div>
          )}

          {analyzing && (
            <div className="flex flex-col items-center justify-center py-4">
              <BarLoader className="mb-2" width={"100%"} color="gray" />
              <p className="text-xs text-muted-foreground">Analyzing response with AI...</p>
            </div>
          )}

          {hasAnalysis && (
            <div className="mt-6 space-y-4 bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">AI Feedback</h3>
                <span className="font-bold text-lg text-primary">{analysisData.score}/100</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 my-4">
                {Object.entries(analysisData.starAnalysis || {}).map(([key, val]) => (
                  <div key={key} className="flex items-center space-x-2 text-sm">
                    {val.toString().toLowerCase().includes("fail") ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    <span className="font-medium">{key}:</span>
                    <span className="truncate">{val}</span>
                  </div>
                ))}
              </div>

              <ReactMarkdown className="text-sm prose prose-sm dark:prose-invert">
                {analysisData.feedback}
              </ReactMarkdown>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {!hasAnalysis ? (
            <p className="text-xs text-muted-foreground">Speak clearly and use the STAR method.</p>
          ) : (
            <Button onClick={handleNext} className="w-full">
              {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Interview"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
