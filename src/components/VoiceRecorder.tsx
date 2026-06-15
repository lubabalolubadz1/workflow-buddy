import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
}

// Minimal types for the Web Speech API (not in lib.dom for all TS configs)
type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
};

export function VoiceRecorder({ onTranscript }: VoiceRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(true);
  const [interim, setInterim] = useState("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }
    const rec: SpeechRecognitionLike = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (event: any) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
      }
      if (finalText) {
        onTranscript(finalText);
        setInterim("");
      } else {
        setInterim(interimText);
      }
    };

    rec.onerror = (e: any) => {
      toast.error(`Mic error: ${e.error ?? "unknown"}`);
      setRecording(false);
    };

    rec.onend = () => {
      setRecording(false);
      setInterim("");
    };

    recognitionRef.current = rec;
    return () => {
      try {
        rec.stop();
      } catch {
        /* noop */
      }
    };
  }, [onTranscript]);

  const toggle = () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    if (recording) {
      rec.stop();
    } else {
      try {
        rec.start();
        setRecording(true);
      } catch (err) {
        toast.error("Could not start microphone");
      }
    }
  };

  if (!supported) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-dashed border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        <MicOff className="h-3.5 w-3.5" />
        Voice recording isn't supported in this browser. Try Chrome or Edge.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant={recording ? "destructive" : "outline"}
        size="sm"
        onClick={toggle}
        className="w-fit"
      >
        {recording ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Stop recording
          </>
        ) : (
          <>
            <Mic className="mr-2 h-4 w-4" />
            Record voice
          </>
        )}
      </Button>
      {recording && (
        <p className="text-xs text-muted-foreground">
          Listening… speech is transcribed into the notes below.
          {interim && <span className="ml-1 italic">"{interim}"</span>}
        </p>
      )}
    </div>
  );
}
