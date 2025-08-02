"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Plus, Search } from "lucide-react";
import { searchSkills, popularSkills } from "@/data/skills";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const SkillSelector = ({ 
  selectedSkills = [], 
  onSkillsChange, 
  placeholder = "Search skills or add new ones",
  maxSkills = 20,
  showPopularSkills = true,
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState("bottom");
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Filter skills based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchSkills(searchQuery, 8);
      // Filter out already selected skills
      const unselectedResults = results.filter(
        skill => !selectedSkills.includes(skill)
      );
      setFilteredSkills(unselectedResults);
    } else {
      setFilteredSkills([]);
    }
  }, [searchQuery, selectedSkills]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery("");
        setCustomSkill("");
      }
    };

    const calculateDropdownPosition = () => {
      if (containerRef.current && isOpen) {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        // If there's more space above and not enough below, show dropdown above
        if (spaceAbove > spaceBelow && spaceBelow < 300) {
          setDropdownPosition("top");
        } else {
          setDropdownPosition("bottom");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", calculateDropdownPosition);
    window.addEventListener("resize", calculateDropdownPosition);
    
    calculateDropdownPosition();
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", calculateDropdownPosition);
      window.removeEventListener("resize", calculateDropdownPosition);
    };
  }, [isOpen]);

  const addSkill = (skill) => {
    if (!skill.trim()) return;
    
    const trimmedSkill = skill.trim();
    if (selectedSkills.includes(trimmedSkill)) return;
    if (selectedSkills.length >= maxSkills) return;

    const newSkills = [...selectedSkills, trimmedSkill];
    onSkillsChange(newSkills);
    setSearchQuery("");
    setCustomSkill("");
    setIsOpen(false); // Close dropdown after adding skill
    inputRef.current?.focus();
  };

  const removeSkill = (skillToRemove) => {
    const newSkills = selectedSkills.filter(skill => skill !== skillToRemove);
    onSkillsChange(newSkills);
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      addSkill(customSkill);
      setIsOpen(false); // Close dropdown after adding custom skill
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredSkills.length > 0) {
        addSkill(filteredSkills[0]);
        setIsOpen(false); // Close dropdown after Enter
      } else if (searchQuery.trim()) {
        addSkill(searchQuery);
        setIsOpen(false); // Close dropdown after Enter
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  const unselectedPopularSkills = popularSkills.filter(
    skill => !selectedSkills.includes(skill)
  ).slice(0, 12);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Selected Skills Display */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedSkills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="px-3 py-1 text-sm bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-2 hover:text-destructive transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input Field */}
      <div className="relative">
        <Search className={cn(
          "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors",
          isOpen ? "text-primary" : "text-muted-foreground"
        )} />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)} // Reopen dropdown when clicking input
          onKeyDown={handleKeyDown}
          className={cn(
            "pl-10 pr-4 transition-colors",
            isOpen && "border-primary/50 ring-1 ring-primary/20"
          )}
          disabled={selectedSkills.length >= maxSkills}
        />
        {selectedSkills.length >= maxSkills && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
            Max {maxSkills}
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && selectedSkills.length < maxSkills && (
        <Card 
          ref={dropdownRef}
          className={cn(
            "absolute left-0 right-0 z-[9999] max-h-60 overflow-y-auto shadow-xl border-2 border-primary/20 bg-background",
            dropdownPosition === "top" ? "bottom-full mb-1" : "top-full mt-1"
          )}
        >
          <CardContent className="p-4">
            {/* Filtered Skills */}
            {filteredSkills.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Suggested Skills</h4>
                <div className="space-y-1">
                  {filteredSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill)}
                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors flex items-center justify-between group"
                    >
                      <span>{skill}</span>
                      <Plus className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Skill Input */}
            {searchQuery && !filteredSkills.some(skill => skill.toLowerCase() === searchQuery.toLowerCase()) && (
              <div className="space-y-2 mt-3 pt-3 border-t">
                <h4 className="text-sm font-medium text-muted-foreground">Add Custom Skill</h4>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter custom skill..."
                    value={customSkill || searchQuery}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomSkill();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      addCustomSkill();
                    }}
                    disabled={!(customSkill || searchQuery).trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Popular Skills */}
            {showPopularSkills && !searchQuery && unselectedPopularSkills.length > 0 && (
              <div className="space-y-2 mt-3 pt-3 border-t">
                <h4 className="text-sm font-medium text-muted-foreground">Popular Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {unselectedPopularSkills.map((skill) => (
                    <Button
                      key={skill}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSkill(skill)}
                      className="text-xs h-7 px-2"
                    >
                      {skill}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!searchQuery && filteredSkills.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Start typing to search for skills</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Skills Counter */}
      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
        <span>{selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} selected</span>
        <span>Max {maxSkills} skills</span>
      </div>
    </div>
  );
};

export default SkillSelector;
