"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrGenerateProblem, getProblemsByCategory } from "@/actions/coding-prep";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Play, CheckCircle2, ChevronLeft, Bot, Send, Loader2, Copy, Lightbulb, ListFilter, Search, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import Editor from "@monaco-editor/react";
import { getNeetCodeTutorResponse } from "@/actions/coding";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { neetcodeOrder } from "@/data/neetcodeOrder";

// Global order mapping for NeetCode 150
const orderMap = new Map(neetcodeOrder.map((p, i) => [p.id, i + 1]));

// Wandbox API mapping
const WANDBOX_COMPILERS = {
  javascript: "nodejs-20.17.0",
  python: "cpython-3.14.0",
  cpp: "gcc-13.2.0",
  java: "openjdk-jdk-22+36"
};

export default function ProblemWorkspace() {
  const { problemId } = useParams();
  const router = useRouter();
  const [problem, setProblem] = useState(null);
  const [problemsList, setProblemsList] = useState([]);
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const [navTopicFilter, setNavTopicFilter] = useState("All");
  const [navDiffFilter, setNavDiffFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [language, setLanguage] = useState("python");
  const [solutionLanguage, setSolutionLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isPassed, setIsPassed] = useState(false);

  // AI Tutor State
  const [chatHistory, setChatHistory] = useState([
    { role: "tutor", content: "Hi! I'm your SPY AI Algo Coach. Try to solve the problem on the left. If you get stuck or want to discuss the optimal time/space complexity, just ask!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTutorTyping, setIsTutorTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Load problem data
  useEffect(() => {
    async function loadProblem() {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch both the problem and the list of all problems for navigation
        const [data, allProblems] = await Promise.all([
          getOrGenerateProblem(problemId),
          getProblemsByCategory()
        ]);
        setProblem(data);
        setProblemsList(allProblems);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadProblem();
  }, [problemId]);

  // Initialize code when problem or language changes
  useEffect(() => {
    if (problem && problem.starterCode) {
      setCode(problem.starterCode[language]);
    }
  }, [problem, language]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] bg-background">
        <div className="relative flex items-center justify-center w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <Image src="/logo.png" alt="SPY AI" width={32} height={32} className="animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-3">Initializing Workspace</h2>
        <p className="text-muted-foreground text-center max-w-sm text-sm">
          SPY AI Algo Coach is structuring the problem data...
        </p>
      </div>
    );
  }

  if (error || !problem) {
    return <div className="p-8 text-center text-red-400">{error || "Problem not found."}</div>;
  }

  const handleLanguageChange = (val) => {
    setLanguage(val);
    setCode(problem.starterCode[val]);
    setOutput("");
    setIsPassed(false);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("Running code...\n");
    try {
      const executionCode = (code + "\n\n" + (problem.testExecutionCode?.[language] || ""));
      const response = await fetch("https://wandbox.org/api/compile.json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          compiler: WANDBOX_COMPILERS[language],
          code: executionCode
        }),
      });
      const data = await response.json();
      let newOutput = "";
      if (data.status === "0") {
        newOutput = data.program_message || "Program finished with no output.";
      } else {
        newOutput = (data.compiler_error || "") + "\n" + (data.program_error || "");
      }
      
      setOutput(newOutput);
      
      // Check if output contains our specific success string from the AI generated test code
      const match = newOutput.match(/Test Cases:\s*(\d+)\/(\d+)\s*Passed/i);
      if (match) {
        const passed = parseInt(match[1]);
        const total = parseInt(match[2]);
        if (passed === total && total > 0) {
          setIsPassed(true);
          toast.success(`Awesome! ${passed}/${total} Test Cases Passed.`);
        } else {
          setIsPassed(false);
          toast.error(`${passed}/${total} Test Cases Passed. Keep trying!`);
        }
      } else {
        setIsPassed(false);
      }

    } catch (error) {
      setOutput("Failed to execute code. Please try again.");
    } finally {
      setIsRunning(false);
    }
  };

  const markAsSolved = () => {
    const saved = localStorage.getItem("spyai_solved_problems");
    const solvedIds = saved ? JSON.parse(saved) : [];
    if (!solvedIds.includes(problemId)) {
      solvedIds.push(problemId);
      localStorage.setItem("spyai_solved_problems", JSON.stringify(solvedIds));
      toast.success("Problem marked as solved!");
    } else {
      toast.info("Already marked as solved.");
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: "user", content: chatInput };
    setChatHistory((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsTutorTyping(true);

    try {
      const response = await getNeetCodeTutorResponse(
        problemId,
        code,
        language,
        chatHistory.slice(-5), // Send last 5 messages for context
        { title: problem.title, category: problem.category, description: problem.description }
      );
      setChatHistory((prev) => [...prev, { role: "tutor", content: response }]);
    } catch (error) {
      toast.error("Tutor failed to respond.");
      setChatHistory((prev) => [...prev, { role: "tutor", content: "Sorry, I ran into an error. Please try again." }]);
    } finally {
      setIsTutorTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      {/* Top Navbar */}
      <div className="h-14 border-b flex items-center justify-between px-2 sm:px-6 bg-card/80 backdrop-blur-md shadow-sm shrink-0 z-10 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Button variant="ghost" size="sm" onClick={() => router.push("/coding-prep")} className="h-8 gap-1 px-1 sm:px-2 text-muted-foreground hover:text-foreground shrink-0">
            <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="w-px h-6 bg-border mx-1 sm:mx-2 hidden sm:block shrink-0"></div>
          
          <Popover open={navigatorOpen} onOpenChange={setNavigatorOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="h-8 gap-2 px-2 hover:bg-white/5 font-bold text-sm sm:text-lg max-w-[140px] md:max-w-xs justify-start shrink-0">
                <span className="truncate">{problem.title}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[340px] sm:w-[450px] p-0 border-white/10 bg-[#0d0d0d] flex flex-col" align="start">
              <div className="p-2 border-b border-white/10 bg-white/5 flex gap-2">
                <Select value={navTopicFilter} onValueChange={setNavTopicFilter}>
                  <SelectTrigger className="h-7 text-xs flex-1 bg-transparent border-white/10 text-gray-300">
                    <SelectValue placeholder="Topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Topics ({problemsList.length})</SelectItem>
                    {Array.from(new Set(problemsList.map(p => p.category))).map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat} ({problemsList.filter(p => p.category === cat).length})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={navDiffFilter} onValueChange={setNavDiffFilter}>
                  <SelectTrigger className="h-7 text-xs w-[110px] bg-transparent border-white/10 text-gray-300">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Diff.</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Command 
                className="bg-transparent"
                filter={(value, search) => {
                  const s = search.toLowerCase();
                  const v = value.toLowerCase();
                  
                  // If the user is searching purely by numbers, match against the start of the serial or start of a word
                  if (/^\d+$/.test(s)) {
                    if (v.startsWith(`#${s}`)) return 1;
                    
                    const words = v.split(" ");
                    if (words.some(w => w.startsWith(s) && !w.startsWith("#"))) return 1;
                    
                    return 0;
                  }

                  if (v.includes(s)) return 1;
                  return 0;
                }}
              >
                <CommandInput 
                  placeholder={`Search ${problemsList.filter(p => (navTopicFilter === "All" || p.category === navTopicFilter) && (navDiffFilter === "All" || p.difficulty === navDiffFilter)).length} problems...`} 
                  className="border-none focus:ring-0 text-sm" 
                />
                <CommandList className="max-h-[350px] scrollbar-thin overflow-y-auto">
                  <CommandEmpty>No problems found.</CommandEmpty>
                  {(() => {
                    const filteredProblems = problemsList
                      .filter(p => (navTopicFilter === "All" || p.category === navTopicFilter) && (navDiffFilter === "All" || p.difficulty === navDiffFilter))
                      .sort((a, b) => (orderMap.get(a.id) || 999) - (orderMap.get(b.id) || 999));
                    
                    return Array.from(new Set(filteredProblems.map(p => p.category))).map(category => {
                      const groupProblems = filteredProblems.filter(p => p.category === category);
                      return (
                        <CommandGroup key={category} heading={`${category} (${groupProblems.length})`} className="text-muted-foreground">
                          {groupProblems.map(p => (
                            <CommandItem 
                              key={p.id} 
                              value={`#${orderMap.get(p.id) || ""} ${orderMap.get(p.id) || ""} ${p.title} ${p.category} ${p.difficulty}`}
                              onSelect={() => {
                                setNavigatorOpen(false);
                                router.push(`/coding-prep/${p.id}`);
                              }}
                              className={`flex items-center gap-2 cursor-pointer ${p.id === problem?.id ? 'bg-primary/10 text-primary' : ''}`}
                            >
                              <span className="text-xs text-muted-foreground w-6 text-right font-mono shrink-0">
                                {orderMap.get(p.id)}
                              </span>
                              <span className="truncate flex-1 font-medium">{p.title}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${
                                p.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-400/10' :
                                p.difficulty === 'Medium' ? 'text-yellow-400 bg-yellow-400/10' :
                                'text-red-400 bg-red-400/10'
                              }`}>
                                {p.difficulty}
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )
                    })
                  })()}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full border shrink-0 hidden sm:inline-flex ${
            problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20' :
            problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-400/20' :
            'bg-red-500/10 text-red-400 border-red-400/20'
          }`}>
            {problem.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
          <Button 
            onClick={markAsSolved} 
            disabled={!isPassed}
            variant={isPassed ? "default" : "outline"}
            size="sm" 
            className={`gap-1 sm:gap-2 h-8 text-xs sm:text-sm px-2 sm:px-3 ${isPassed ? "bg-emerald-500 hover:bg-emerald-600 text-white" : ""}`}
          >
            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Submit</span>
          </Button>
          <Button onClick={handleRunCode} disabled={isRunning} size="sm" className="gap-1 sm:gap-2 h-8 text-xs sm:text-sm px-2 sm:px-3 button-premium">
            {isRunning ? <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
            <span className="hidden sm:inline">Run Code</span><span className="inline sm:hidden">Run</span>
          </Button>
        </div>
      </div>

      {/* Main Workspace */}
      <ResizablePanelGroup direction={isTablet ? "vertical" : "horizontal"} className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Description & Solution */}
        <ResizablePanel defaultSize={isTablet ? 33 : 30} minSize={isTablet ? 15 : 20} className="flex flex-col bg-background">
          <Tabs defaultValue="description" className="flex-1 flex flex-col">
            <div className="h-10 border-b flex items-center px-4 bg-muted/20 shrink-0">
              <TabsList className="h-7 p-0 bg-transparent gap-4">
                <TabsTrigger 
                  value="description" 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 h-full text-xs font-semibold"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger 
                  value="solution" 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 h-full text-xs font-semibold"
                >
                  Solution
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="description" className="flex-1 overflow-y-auto p-4 lg:p-6 scrollbar-thin mt-0 border-none outline-none">
              <h2 className="text-2xl font-bold mb-4">{problem.title}</h2>
              <div className="prose prose-invert max-w-none text-muted-foreground text-sm md:text-base prose-p:leading-relaxed">
                <ReactMarkdown
                  components={{
                    h3({node, children, ...props}) {
                      return <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mt-8 mb-4 border-b border-white/10 pb-2 block" {...props}>{children}</h3>
                    },
                    ul({node, children, ...props}) {
                      return <ul className="list-none space-y-2 my-4" {...props}>{children}</ul>
                    },
                    li({node, children, ...props}) {
                      return (
                        <li className="flex items-start gap-2" {...props}>
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 shrink-0"></div>
                          <span className="text-muted-foreground">{children}</span>
                        </li>
                      )
                    },
                    code({node, inline, className, children, ...props}) {
                      return (
                        <code className={`${className} bg-primary/10 px-1.5 py-0.5 rounded-md text-emerald-400 font-mono text-sm border border-primary/20`} {...props}>
                          {children}
                        </code>
                      )
                    },
                    strong({node, children, ...props}) {
                      const text = String(children);
                      if (text.includes("Constraints") || text.includes("Expected Time & Space Complexity") || text.includes("Expected Complexity") || text.includes("Time:") || text.includes("Space:")) {
                        return <span className="text-sm font-semibold text-primary uppercase tracking-wider mt-8 mb-4 border-b border-white/10 pb-2 block" {...props}>{children}</span>
                      }
                      return <strong className="text-foreground font-semibold" {...props}>{children}</strong>
                    }
                  }}
                >
                  {problem.description}
                </ReactMarkdown>
              </div>
              
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Examples</h3>
                {problem.examples.map((ex, i) => (
                  <div key={i} className="bg-muted/30 p-4 rounded-lg border border-muted/50 font-mono text-sm">
                    <div className="font-semibold text-muted-foreground mb-1">Input: <span className="font-normal text-foreground">{ex.input}</span></div>
                    <div className="font-semibold text-muted-foreground">Output: <span className="font-normal text-foreground">{ex.output}</span></div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="solution" className="flex-1 overflow-y-auto p-4 scrollbar-thin mt-0 border-none outline-none bg-[#0d0d0d] relative">
              <div className="flex items-center justify-between gap-2 mb-4 sticky top-0 bg-[#0d0d0d]/90 backdrop-blur pb-3 pt-1 z-10 border-b border-white/10">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="p-1 rounded bg-primary/20">
                      <Lightbulb className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest hidden 2xl:block">
                      Solution
                    </h3>
                  </div>
                  
                  <div className="w-px h-4 bg-white/10 hidden 2xl:block"></div>
                  
                  <Select value={solutionLanguage} onValueChange={setSolutionLanguage}>
                    <SelectTrigger className="w-[100px] sm:w-[120px] h-7 text-xs bg-white/5 border-white/10 text-gray-300 focus:ring-1 focus:ring-primary/50 transition-colors hover:bg-white/10 shrink-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2 sm:px-2.5 text-xs gap-1.5 border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all shrink-0"
                  onClick={() => {
                    navigator.clipboard.writeText(problem.solutionCode[solutionLanguage]);
                    toast.success("Copied to clipboard!");
                  }}
                >
                  <Copy className="h-3.5 w-3.5" /> 
                  <span className="hidden xl:inline-block">Copy</span>
                </Button>
              </div>
              <div className="mt-4 flex-1 h-[calc(100vh-15rem)] min-h-[400px] border border-white/10 rounded-md overflow-hidden">
                {problem.solutionCode ? (
                  <Editor
                    height="100%"
                    language={solutionLanguage}
                    theme="vs-dark"
                    value={problem.solutionCode[solutionLanguage]}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      wordWrap: "on",
                      readOnly: true,
                      scrollBeyondLastLine: false,
                      padding: { top: 16 }
                    }}
                  />
                ) : (
                  <div className="text-muted-foreground p-4">No solution provided.</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </ResizablePanel>

        <ResizableHandle withHandle className={isTablet ? "flex" : "hidden lg:flex"} />

        {/* Middle Panel: Code Editor & Output */}
        <ResizablePanel defaultSize={isTablet ? 34 : 40} minSize={isTablet ? 20 : 30} className={`flex flex-col ${isTablet ? "border-y border-muted/20" : "border-r border-l border-muted/20"}`}>
          <div className="h-10 border-b flex items-center px-4 bg-muted/20 justify-between shrink-0">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[140px] h-7 text-xs bg-transparent border-none focus:ring-0">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python 3</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="java">Java</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 min-h-0 relative">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                scrollBeyondLastLine: false,
                padding: { top: 16 }
              }}
            />
          </div>

          {/* Terminal Output */}
          <div className="h-1/3 border-t flex flex-col shrink-0 bg-[#0d0d0d]">
            <div className="h-8 border-b border-white/10 flex items-center px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider shrink-0 bg-[#161616]">
              Terminal Output
            </div>
            <div className="flex-1 p-4 font-mono text-sm overflow-y-auto text-emerald-400 whitespace-pre-wrap">
              {output || "Run your code to see output here."}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className={isTablet ? "flex" : "hidden lg:flex"} />

        {/* Right Panel: AI Tutor */}
        <ResizablePanel defaultSize={isTablet ? 33 : 30} minSize={isTablet ? 15 : 20} className="flex flex-col bg-card/50">
          <div className="h-14 border-b flex items-center px-4 gap-2 font-bold shrink-0 bg-card">
            <div className="p-1 rounded-md bg-primary/10 flex items-center justify-center w-8 h-8">
              <Image src="/logo.png" alt="SPY AI" width={20} height={20} className="object-contain" />
            </div>
            SPY AI Algo Coach
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                  msg.role === "user" 
                    ? "bg-primary text-primary-foreground rounded-tr-sm" 
                    : "bg-background border border-border/60 rounded-tl-sm prose prose-invert prose-sm prose-p:leading-relaxed prose-pre:p-0"
                }`}>
                  {msg.role === "user" ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          const codeString = String(children).replace(/\n$/, "");
                          return !inline && match ? (
                            <div className="relative group mt-2 mb-2">
                              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="icon"
                                  variant="secondary"
                                  className="h-6 w-6"
                                  onClick={() => {
                                    navigator.clipboard.writeText(codeString);
                                    toast.success("Copied to clipboard!");
                                  }}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <pre className={className} {...props}>
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              </pre>
                            </div>
                          ) : (
                            <code className={`${className} bg-primary/10 px-1.5 py-0.5 rounded-md text-emerald-400 font-mono text-sm border border-primary/20`} {...props}>
                              {children}
                            </code>
                          );
                        },
                        strong({node, children, ...props}) {
                          const text = String(children);
                          if (text.includes("Constraints") || text.includes("Expected Time & Space Complexity") || text.includes("Expected Complexity") || text.includes("Time:") || text.includes("Space:")) {
                            return <span className="text-sm font-semibold text-primary uppercase tracking-wider mt-8 mb-4 border-b border-white/10 pb-2 block" {...props}>{children}</span>
                          }
                          return <strong className="text-foreground font-semibold" {...props}>{children}</strong>
                        }
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            {isTutorTyping && (
              <div className="flex items-start">
                <div className="bg-muted border border-muted/50 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce delay-75" />
                  <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce delay-150" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-card border-t shrink-0 shadow-sm z-10">
            <div className="relative flex items-center shadow-sm rounded-md">
              <Textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask about time complexity, get a hint, or request the optimal solution..."
                className="min-h-[60px] pr-12 resize-none bg-background border-border/60 focus-visible:ring-primary/50"
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isTutorTyping}
                className="absolute right-2 bottom-2 h-8 w-8 rounded-full shadow-md"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </ResizablePanel>

      </ResizablePanelGroup>
    </div>
  );
}
