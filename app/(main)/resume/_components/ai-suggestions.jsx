"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Loader2, X } from "lucide-react";
import { generateSuggestions } from "@/actions/resume";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

export function AISuggestions({ section, currentContent, onApplySuggestion }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const {
    loading: isGenerating,
    fn: generateSuggestionsFn,
    data: suggestions,
    error: suggestionsError,
  } = useFetch(generateSuggestions);

  const handleGetSuggestions = async () => {
    try {
      await generateSuggestionsFn(section, currentContent);
      setShowSuggestions(true);
    } catch (error) {
      toast.error(`Failed to generate suggestions: ${error.message}`);
    }
  };

  const handleApplySuggestion = (suggestion) => {
    if (onApplySuggestion) {
      onApplySuggestion(suggestion);
    }
    toast.success("Suggestion applied!");
  };

  if (suggestionsError) {
    toast.error(suggestionsError.message || "Failed to generate suggestions");
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleGetSuggestions}
        disabled={isGenerating}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Getting suggestions...
          </>
        ) : (
          <>
            <Lightbulb className="h-4 w-4" />
            Get AI Suggestions
          </>
        )}
      </Button>

      {showSuggestions && suggestions && (
        <Card className="mt-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              AI Suggestions for {section}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSuggestions(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <p className="text-sm text-blue-800 mb-2">{suggestion}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleApplySuggestion(suggestion)}
                  className="text-blue-600 border-blue-300 hover:bg-blue-100"
                >
                  Apply Suggestion
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
