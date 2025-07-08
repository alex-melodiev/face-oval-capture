
import React, { useState } from 'react';
import ConsentScreen from '@/components/ConsentScreen';
import VideoRecordingScreen from '@/components/VideoRecordingScreen';
import CompletionScreen from '@/components/CompletionScreen';

type AppState = 'consent' | 'recording' | 'complete';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('consent');

  const handleConsent = () => {
    setCurrentState('recording');
  };

  const handleComplete = () => {
    setCurrentState('complete');
  };

  const handleRestart = () => {
    setCurrentState('consent');
  };

  switch (currentState) {
    case 'consent':
      return <ConsentScreen onConsent={handleConsent} />;
    case 'recording':
      return <VideoRecordingScreen onComplete={handleComplete} />;
    case 'complete':
      return <CompletionScreen onRestart={handleRestart} />;
    default:
      return <ConsentScreen onConsent={handleConsent} />;
  }
};

export default Index;
