import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { UploadZone } from './components/UploadZone';
import { ProcessingState } from './components/ProcessingState';
import { ComparisonView } from './components/ComparisonView';
import { Button } from './components/Button';
import { checkApiKey, promptForApiKey, generateDripImage } from './services/geminiService';
import { AppState, GeneratedImage } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.INITIAL);
  const [resultData, setResultData] = useState<GeneratedImage | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    // Check initial key status on mount
    checkApiKey().then((hasKey) => {
      setState(hasKey ? AppState.IDLE : AppState.INITIAL);
    });
  }, []);

  const handleStart = async () => {
    try {
      setState(AppState.SELECTING_KEY);
      await promptForApiKey();
      // Assume success as per race condition guidance, immediately go to idle (uploader)
      setState(AppState.IDLE);
    } catch (e) {
      console.error(e);
      // Even if failed, we might want to try to let them upload to trigger the key check again later or show error
      // But let's assume valid flow
      setState(AppState.IDLE);
    }
  };

  const handleFileSelect = async (file: File) => {
    setState(AppState.PROCESSING);
    
    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const mimeType = file.type;

      try {
        const generatedImageBase64 = await generateDripImage(base64, mimeType, 0);
        setResultData({
          original: base64,
          result: generatedImageBase64,
          mimeType: 'image/png' // Response is usually png from genai parts
        });
        setState(AppState.SUCCESS);
      } catch (err: any) {
        if (err.message === "API_KEY_INVALID") {
            setState(AppState.INITIAL); // Reset to force new key selection
            setErrorMsg("API Key invalid or expired. Please select a project again.");
        } else {
            setState(AppState.ERROR);
            setErrorMsg("Failed to generate the drip. The AI might be overwhelmed by the potential.");
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRedo = async () => {
    if (!resultData) return;
    
    setState(AppState.PROCESSING);
    
    // Extract mime type from original data URL if possible, otherwise default to jpeg as standard fallback for inputs
    // Data URL format: data:[<mediatype>][;base64],<data>
    const matches = resultData.original.match(/^data:(.+);base64,/);
    const sourceMime = matches ? matches[1] : 'image/jpeg';

    try {
      // Pass temperature 1 for "Redo"
      const generatedImageBase64 = await generateDripImage(resultData.original, sourceMime, .2);
      
      setResultData({
        ...resultData,
        result: generatedImageBase64
      });
      setState(AppState.SUCCESS);
    } catch (err: any) {
       if (err.message === "API_KEY_INVALID") {
            setState(AppState.INITIAL); 
            setErrorMsg("API Key invalid or expired. Please select a project again.");
        } else {
            setState(AppState.ERROR);
            setErrorMsg("Redo failed. The universe wasn't ready.");
        }
    }
  };

  const handleReset = () => {
    setResultData(null);
    setState(AppState.IDLE);
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-x-hidden selection:bg-violet-500 selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-900/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[128px]"></div>
      </div>

      <Header />

      <main className="relative pt-24 px-4 pb-12 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        
        {state === AppState.INITIAL && (
          <Hero onStart={handleStart} />
        )}

        {state === AppState.SELECTING_KEY && (
          <div className="animate-pulse text-zinc-400">Waiting for access key selection...</div>
        )}

        {state === AppState.IDLE && (
          <div className="w-full flex flex-col items-center animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Upload Source Material</h2>
            {errorMsg && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl">
                    {errorMsg}
                </div>
            )}
            <UploadZone onFileSelect={handleFileSelect} />
          </div>
        )}

        {state === AppState.PROCESSING && <ProcessingState />}

        {state === AppState.SUCCESS && resultData && (
          <ComparisonView data={resultData} onReset={handleReset} onRedo={handleRedo} />
        )}

        {state === AppState.ERROR && (
          <div className="text-center max-w-md animate-fade-in">
             <div className="text-6xl mb-6">💔</div>
             <h2 className="text-2xl font-bold text-red-500 mb-4">Generation Failed</h2>
             <p className="text-zinc-400 mb-8">{errorMsg || "Something went wrong."}</p>
             <Button onClick={handleReset} variant="secondary">Try Again</Button>
          </div>
        )}

      </main>

      <footer className="w-full text-center py-6 text-zinc-700 text-xs relative z-10">
        &copy; {new Date().getFullYear()} AutoDrip Inc. Stay icy.
      </footer>
    </div>
  );
};

export default App;