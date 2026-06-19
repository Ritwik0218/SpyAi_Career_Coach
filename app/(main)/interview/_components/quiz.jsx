"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import QuizResult from "./quiz-result";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { Mic, MicOff, Volume2 } from "lucide-react";

import { useSearchParams } from "next/navigation";

export default function Quiz() {
  const searchParams = useSearchParams();
  const topicParam = searchParams.get("topic");
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [customTopic, setCustomTopic] = useState("");

  useEffect(() => {
    if (topicParam) {
      setCustomTopic(topicParam);
    }
  }, [topicParam]);
  
  // Voice states
  const [voiceMode, setVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [speechSupported, setSpeechSupported] = useState(false);

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);

  const {
    loading: savingResult,
    fn: saveQuizResultFn,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizResult);

  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
    }
  }, [quizData]);

  // Speech Recognition Support Check
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
      }
    }
  }, []);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    // Stop recording and speech synthesis if active
    stopRecording();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
      setTranscription("");
    } else {
      finishQuiz();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === quizData[index].correctAnswer) {
        correct++;
      }
    });
    return (correct / quizData.length) * 100;
  };

  const finishQuiz = async () => {
    const score = calculateScore();
    try {
      await saveQuizResultFn(quizData, answers, score);
      toast.success("Quiz completed!");
    } catch (error) {
      toast.error(error.message || "Failed to save quiz results");
    }
  };

  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    setTranscription("");
    generateQuizFn(customTopic);
    setResultData(null);
  };

  // Recording functionality
  const startRecording = () => {
    if (!speechSupported) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }
    
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false; // Stop automatically when user finishes speaking
      recognition.interimResults = false;
      recognition.lang = "en-US";
      
      recognition.onstart = () => {
        setIsRecording(true);
      };
      
      recognition.onresult = (event) => {
        const resultText = event.results[0][0].transcript;
        setTranscription(resultText);
        
        // Check if the user spoke one of the option letters (A, B, C, D)
        const spokenLower = resultText.toLowerCase().trim();
        const question = quizData[currentQuestion];
        
        let selectedIndex = -1;
        if (spokenLower === "option a" || spokenLower === "a" || spokenLower.startsWith("first")) {
          selectedIndex = 0;
        } else if (spokenLower === "option b" || spokenLower === "b" || spokenLower.startsWith("second")) {
          selectedIndex = 1;
        } else if (spokenLower === "option c" || spokenLower === "c" || spokenLower.startsWith("third")) {
          selectedIndex = 2;
        } else if (spokenLower === "option d" || spokenLower === "d" || spokenLower.startsWith("fourth")) {
          selectedIndex = 3;
        }
        
        if (selectedIndex >= 0 && selectedIndex < question.options.length) {
          const optionVal = question.options[selectedIndex];
          handleAnswer(optionVal);
          toast.success(`Selected Option ${String.fromCharCode(65 + selectedIndex)}: "${optionVal}"`);
        } else {
          // If they didn't dictate a specific option, check if they spoke the exact text of one of the options
          const matchedOption = question.options.find(opt => 
            spokenLower.includes(opt.toLowerCase()) || opt.toLowerCase().includes(spokenLower)
          );
          if (matchedOption) {
            handleAnswer(matchedOption);
            toast.success(`Selected: "${matchedOption}"`);
          }
        }
      };
      
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        toast.error(`Mic Error: ${event.error}`);
        setIsRecording(false);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      window._currentRecognition = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (window._currentRecognition) {
      window._currentRecognition.stop();
    }
    setIsRecording(false);
  };

  const speakQuestion = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(question.question);
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes("en") && (v.name.includes("Google") || v.name.includes("Natural")));
      if (preferredVoice) utterance.voice = preferredVoice;
      
      window.speechSynthesis.speak(utterance);
      toast.info("Speaking question...");
    } else {
      toast.error("Text-to-speech is not supported in this browser.");
    }
  };

  if (generatingQuiz) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
  }

  // Show results if quiz is completed
  if (resultData) {
    return (
      <div className="mx-2">
        <QuizResult result={resultData} onStartNew={startNewQuiz} />
      </div>
    );
  }

  if (!quizData) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Ready to test your knowledge?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This quiz contains 10 questions specific to your industry and
            skills. Take your time and choose the best answer for each question.
          </p>
          <div className="space-y-2 pt-2 border-t">
            <Label htmlFor="customTopic" className="font-semibold text-sm">
              Custom Topic / Skill (Optional)
            </Label>
            <Input
              id="customTopic"
              type="text"
              placeholder="e.g. React, Python, Data Structures & Algorithms, System Design"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Type any language, framework, or core topic to fetch 10 specialized industry-level questions. Leave blank to use your default profile skills.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => generateQuizFn(customTopic)} className="w-full">
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <Card className="mx-2 border border-muted/50 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between border-b border-muted/20 pb-4">
        <CardTitle className="text-xl">
          Question {currentQuestion + 1} of {quizData.length}
        </CardTitle>
        {speechSupported && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setVoiceMode(!voiceMode)}
            className={`gap-1.5 border ${voiceMode ? "bg-primary/10 text-primary border-primary/30" : "border-muted"}`}
          >
            <Mic className={`h-4 w-4 ${voiceMode ? "animate-pulse" : ""}`} />
            <span>{voiceMode ? "Voice Mode ON" : "Voice Mode OFF"}</span>
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        <div className="flex items-start justify-between gap-4">
          <p className="text-lg font-semibold text-foreground leading-snug flex-grow">{question.question}</p>
          {voiceMode && (
            <Button
              variant="outline"
              size="icon"
              onClick={speakQuestion}
              title="Read question aloud"
              className="flex-shrink-0"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {voiceMode && (
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Mic className="h-3.5 w-3.5" />
              Practice Verbal Answer
            </h4>
            <div className="flex items-center gap-3">
              {isRecording ? (
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                  className="gap-2 animate-pulse"
                >
                  <MicOff className="h-4 w-4" />
                  Stop Recording
                </Button>
              ) : (
                <Button
                  onClick={startRecording}
                  variant="default"
                  className="gap-2 bg-primary hover:bg-primary/95 text-white"
                >
                  <Mic className="h-4 w-4" />
                  Start Speaking
                </Button>
              )}
            </div>
            {transcription && (
              <div className="text-sm bg-background border rounded-lg p-3 space-y-1">
                <span className="text-xs text-muted-foreground font-semibold">Speech-to-Text Transcription:</span>
                <p className="italic text-foreground">"{transcription}"</p>
              </div>
            )}
            <p className="text-[11px] text-muted-foreground leading-normal">
              <strong>Tip:</strong> Select an option below, and click <strong>Start Speaking</strong> to practice explaining your reasoning or speak the letter option (e.g., "Option A") to auto-select.
            </p>
          </div>
        )}

        <RadioGroup
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
          className="space-y-3"
        >
          {question.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index); // A, B, C, D
            const isSelected = answers[currentQuestion] === option;
            
            return (
              <div 
                key={index} 
                className={`flex items-center space-x-3 border rounded-xl p-3.5 hover:bg-muted/40 transition-all cursor-pointer ${
                  isSelected ? "border-primary/50 bg-primary/5 font-medium" : "border-muted/60"
                }`}
                onClick={() => handleAnswer(option)}
              >
                <RadioGroupItem value={option} id={`option-${index}`} className="mt-0.5" />
                <Label htmlFor={`option-${index}`} className="flex items-baseline gap-2 cursor-pointer w-full text-sm sm:text-base leading-snug">
                  <span className="font-bold text-primary mr-1">{letter}.</span>
                  <span>{option}</span>
                </Label>
              </div>
            );
          })}
        </RadioGroup>

        {showExplanation && (
          <div className="mt-4 p-4 bg-muted/50 border rounded-xl space-y-1">
            <p className="font-bold text-sm text-foreground">Explanation:</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{question.explanation}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t border-muted/20 pt-4 mt-2">
        {!showExplanation && (
          <Button
            onClick={() => setShowExplanation(true)}
            variant="outline"
            disabled={!answers[currentQuestion]}
            className="rounded-lg"
          >
            Show Explanation
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion] || savingResult}
          className="ml-auto rounded-lg"
        >
          {savingResult && (
            <BarLoader className="mt-4" width={"100%"} color="gray" />
          )}
          {currentQuestion < quizData.length - 1
            ? "Next Question"
            : "Finish Quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
}
