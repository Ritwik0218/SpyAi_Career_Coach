"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MiniLoader } from "@/components/mini-loader";
import { useActionLoading } from "@/hooks/use-action-loading";
import { Badge } from "@/components/ui/badge";

export default function LoadingDemoPage() {
  const [examples, setExamples] = useState({});
  const { startAction, updateProgress, finishAction, getActionState } = useActionLoading();

  const simulateAction = async (actionId, description, duration = 3000) => {
    const { actionId: id } = startAction(actionId, { description });
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => finishAction(id), 500);
      }
      updateProgress(id, progress);
    }, 200);
  };

  const toggleExample = (key, state) => {
    setExamples(prev => ({ ...prev, [key]: state }));
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
          🎨 Loading System Demo
        </Badge>
        <h1 className="text-4xl font-bold gradient-title">
          Enhanced Loading Components
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Showcase of the enhanced loading system with theme-matched colors and smooth animations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Spinner Loader */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Spinner Loader</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <MiniLoader isLoading={examples.spinner} variant="spinner" size="sm">
                Small Spinner
              </MiniLoader>
              <MiniLoader isLoading={examples.spinner} variant="spinner" size="md">
                Medium Spinner
              </MiniLoader>
              <MiniLoader isLoading={examples.spinner} variant="spinner" size="lg">
                Large Spinner
              </MiniLoader>
            </div>
            <Button 
              onClick={() => toggleExample('spinner', !examples.spinner)}
              variant="outline"
              size="sm"
            >
              Toggle Spinner
            </Button>
          </CardContent>
        </Card>

        {/* Pulse Loader */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pulse Loader</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <MiniLoader isLoading={examples.pulse} variant="pulse" size="sm">
                Pulse Effect
              </MiniLoader>
              <MiniLoader isLoading={examples.pulse} variant="pulse" size="md">
                Medium Pulse
              </MiniLoader>
              <MiniLoader isLoading={examples.pulse} variant="pulse" size="lg">
                Large Pulse
              </MiniLoader>
            </div>
            <Button 
              onClick={() => toggleExample('pulse', !examples.pulse)}
              variant="outline"
              size="sm"
            >
              Toggle Pulse
            </Button>
          </CardContent>
        </Card>

        {/* Dots Loader */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dots Loader</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <MiniLoader isLoading={examples.dots} variant="dots" size="sm">
                Loading...
              </MiniLoader>
              <MiniLoader isLoading={examples.dots} variant="dots" size="md">
                Processing...
              </MiniLoader>
              <MiniLoader isLoading={examples.dots} variant="dots" size="lg">
                Please wait...
              </MiniLoader>
            </div>
            <Button 
              onClick={() => toggleExample('dots', !examples.dots)}
              variant="outline"
              size="sm"
            >
              Toggle Dots
            </Button>
          </CardContent>
        </Card>

        {/* Progress Loader */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Progress Loader</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <MiniLoader 
                isLoading={getActionState('demo-progress')?.isLoading || false}
                progress={getActionState('demo-progress')?.progress || 0}
                variant="progress"
                size="md"
              >
                {Math.round(getActionState('demo-progress')?.progress || 0)}% Complete
              </MiniLoader>
            </div>
            <Button 
              onClick={() => simulateAction('demo-progress', 'Demo Progress')}
              variant="outline"
              size="sm"
              disabled={getActionState('demo-progress')?.isLoading || false}
            >
              Start Progress Demo
            </Button>
          </CardContent>
        </Card>

        {/* Success/Error States */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Success/Error States</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <MiniLoader success size="sm">
                Operation successful!
              </MiniLoader>
              <MiniLoader error size="sm">
                Something went wrong
              </MiniLoader>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-green-600">
                ✓ Success
              </Button>
              <Button variant="outline" size="sm" className="text-red-600">
                ✗ Error
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Combined Example */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">File Upload Simulation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {getActionState('file-upload').isLoading && (
                <MiniLoader 
                  isLoading={true}
                  progress={getActionState('file-upload').progress}
                  variant="progress"
                  size="md"
                >
                  {getActionState('file-upload').description}
                </MiniLoader>
              )}
              
              {!getActionState('file-upload').isLoading && (
                <MiniLoader variant="spinner" size="sm" isLoading={false}>
                  Ready to upload
                </MiniLoader>
              )}
            </div>
            
            <Button 
              onClick={() => {
                simulateAction('file-upload', 'Uploading file...', 4000);
                setTimeout(() => updateProgress('file-upload', 25, 'Reading file...'), 500);
                setTimeout(() => updateProgress('file-upload', 50, 'Processing...'), 1500);
                setTimeout(() => updateProgress('file-upload', 75, 'Almost done...'), 2500);
              }}
              variant="outline"
              size="sm"
              disabled={getActionState('file-upload').isLoading}
            >
              Simulate File Upload
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle>Color Theme Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            All loading components automatically match your website's color theme using CSS custom properties:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded"></div>
              <span>Primary</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary-foreground border rounded"></div>
              <span>Primary Foreground</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted rounded"></div>
              <span>Muted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-destructive rounded"></div>
              <span>Destructive</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
