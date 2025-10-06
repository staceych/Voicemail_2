'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob | null) => void;
}

const MAX_RECORDING_TIME_MS = 5 * 60 * 1000; // 5 minutes

export default function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const [permission, setPermission] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<'inactive' | 'recording' | 'recorded'>('inactive');
  const [audioURL, setAudioURL] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    getMicrophonePermission();
  }, []);
  
  useEffect(() => {
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, []);

  const getMicrophonePermission = async () => {
    if ('MediaRecorder' in window) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setPermission(true);
        mediaRecorder.current = new MediaRecorder(stream);
        setupMediaRecorder();
      } catch (err) {
        if (err instanceof Error) {
          toast({
            title: 'Microphone Access Denied',
            description: 'Please allow microphone access in your browser settings to record audio.',
            variant: 'destructive',
          });
        }
        setPermission(false);
      }
    } else {
      toast({
        title: 'Unsupported Browser',
        description: 'Audio recording is not supported in your browser.',
        variant: 'destructive',
      });
    }
  };

  const setupMediaRecorder = () => {
    if (!mediaRecorder.current) return;
    mediaRecorder.current.onstart = () => {
      audioChunks.current = [];
      setElapsedTime(0);
      timerInterval.current = setInterval(() => {
        setElapsedTime((prev) => {
          const newTime = prev + 100;
          if (newTime >= MAX_RECORDING_TIME_MS) {
            stopRecording();
          }
          return newTime;
        });
      }, 100);
    };

    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === 'undefined' || event.data.size === 0) return;
      audioChunks.current.push(event.data);
    };

    mediaRecorder.current.onstop = () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
      onRecordingComplete(audioBlob);
    };
  };

  const startRecording = () => {
    if (!permission || !mediaRecorder.current) {
      getMicrophonePermission();
      return;
    }
    setRecordingStatus('recording');
    mediaRecorder.current.start();
  };

  const stopRecording = () => {
    if (!mediaRecorder.current || mediaRecorder.current.state !== 'recording') return;
    setRecordingStatus('recorded');
    mediaRecorder.current.stop();
  };
  
  const resetRecording = () => {
    setRecordingStatus('inactive');
    setAudioURL('');
    setElapsedTime(0);
    audioChunks.current = [];
    onRecordingComplete(null);
  };

  const formatTime = (time: number) => {
    const totalSeconds = Math.floor(time / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!permission) {
    return (
      <div className="flex flex-col items-center justify-center p-4 rounded-lg border border-dashed text-center bg-muted/50">
        <AlertTriangle className="w-8 h-8 text-destructive mb-2" />
        <p className="text-sm font-medium">Microphone access is required.</p>
        <p className="text-xs text-muted-foreground mb-3">Please grant permission to continue.</p>
        <Button onClick={getMicrophonePermission} size="sm">Allow Microphone</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {recordingStatus === 'inactive' && (
          <Button onClick={startRecording} className="w-full sm:w-auto" size="lg">
            <Mic className="mr-2 h-5 w-5" /> Start Recording
          </Button>
        )}
        {recordingStatus === 'recording' && (
          <Button onClick={stopRecording} variant="destructive" className="w-full sm:w-auto" size="lg">
            <Square className="mr-2 h-5 w-5" /> Stop Recording
          </Button>
        )}
        {recordingStatus === 'recorded' && (
          <>
            <audio src={audioURL} controls className="w-full rounded-md" />
            <Button onClick={resetRecording} variant="ghost" size="icon" aria-label="Delete recording">
              <Trash2 className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>
      {(recordingStatus === 'recording' || recordingStatus === 'recorded') && (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>{formatTime(elapsedTime)}</span>
                <span>{formatTime(MAX_RECORDING_TIME_MS)}</span>
            </div>
            <Progress value={(elapsedTime / MAX_RECORDING_TIME_MS) * 100} className="h-2" />
        </div>
      )}
    </div>
  );
}
