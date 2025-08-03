"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, RefreshCw, Plus, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { generateSuggestions } from "@/actions/resume";
import useFetch from "@/hooks/use-fetch";

export function AISuggestions({ section, currentContent, onApplySuggestion }) {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState(new Set());

  const {
    loading: isGenerating,
    fn: generateSuggestionsFn,
    data: suggestionsData,
    error: suggestionsError,
  } = useFetch(generateSuggestions);

  // Handle suggestions result
  useEffect(() => {
    if (suggestionsData) {
      setSuggestions(Array.isArray(suggestionsData) ? suggestionsData : [suggestionsData]);
    }
  }, [suggestionsData]);

  useEffect(() => {
    if (suggestionsError) {
      const errorMsg = suggestionsError.message?.includes('timeout')
        ? "Suggestion generation timed out. Please try again."
        : suggestionsError.message?.includes('quota')
        ? "Service temporarily unavailable. Please try again in a few minutes."
        : "Failed to generate suggestions. Please try again.";
      toast.error(errorMsg);
    }
  }, [suggestionsError]);

  const handleGenerateSuggestions = async () => {
    try {
      await generateSuggestionsFn({
        section,
        currentContent,
        count: 5
      });
    } catch (error) {
      toast.error(`Failed to generate suggestions: ${error.message}`);
    }
  };

  const handleApplySuggestion = (suggestion) => {
    onApplySuggestion(suggestion);
    setSelectedSuggestions(prev => new Set(prev).add(suggestion));
    toast.success("Suggestion applied successfully!");
  };

  const handleApplyAllSuggestions = () => {
    const unselectedSuggestions = suggestions.filter(s => !selectedSuggestions.has(s));
    if (unselectedSuggestions.length === 0) {
      toast.info("All suggestions have already been applied.");
      return;
    }
    
    const combinedSuggestions = unselectedSuggestions.join(". ");
    onApplySuggestion(combinedSuggestions);
    setSelectedSuggestions(new Set(suggestions));
    toast.success(`Applied ${unselectedSuggestions.length} suggestions!`);
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-gray-800">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            AI Suggestions for {section}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleGenerateSuggestions}
              disabled={isGenerating}
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Generate
                </>
              )}
            </Button>
            {suggestions.length > 0 && (
              <Button
                size="sm"
                onClick={handleApplyAllSuggestions}
                disabled={isGenerating || selectedSuggestions.size === suggestions.length}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Apply All
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <div className="text-center py-6">
            <Sparkles className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-blue-600 mb-3">
              Get AI-powered suggestions to improve your {section.toLowerCase()}
            </p>
            <Button
              size="sm"
              onClick={handleGenerateSuggestions}
              disabled={isGenerating || !currentContent?.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  Generating Suggestions...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-1" />
                  Get AI Suggestions
                </>
              )}
            </Button>
            {!currentContent?.trim() && (
              <p className="text-xs text-blue-500 mt-2">
                Add some content first to get personalized suggestions
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-blue-600">
                {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''} generated
              </p>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {selectedSuggestions.size}/{suggestions.length} applied
              </Badge>
            </div>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => {
                const isApplied = selectedSuggestions.has(suggestion);
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border transition-all ${
                      isApplied 
                        ? 'bg-emerald-50 border-emerald-200 opacity-75' 
                        : 'bg-white border-blue-200 hover:border-blue-300'
                    }`}
                  >
                    <p className="text-sm text-gray-600 mb-2">{suggestion}</p>
                    <Button
                      size="sm"
                      variant={isApplied ? "secondary" : "default"}
                      onClick={() => handleApplySuggestion(suggestion)}
                      disabled={isApplied}
                      className={
                        isApplied 
                          ? "bg-emerald-100 text-emerald-700 cursor-not-allowed" 
                          : "bg-blue-600 hover:bg-blue-700"
                      }
                    >
                      {isApplied ? (
                        <>
                          <Sparkles className="h-3 w-3 mr-1" />
                          Applied
                        </>
                      ) : (
                        <>
                          <Plus className="h-3 w-3 mr-1" />
                          Apply
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
