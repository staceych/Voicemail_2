'use client';

import { useState, useMemo, ChangeEvent } from 'react';
import { Loader2, MailCheck, Paperclip, Wand2 } from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { transcribeVoiceMessage } from '@/ai/flows/transcribe-voice-message';
import AudioRecorder from '@/components/audio-recorder';
import PhotoUploader from '@/components/photo-uploader';
import BackgroundSelector from '@/components/background-selector';
import SentConfirmationDialog from '@/components/sent-confirmation-dialog';

export default function Home() {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [selectedBackground, setSelectedBackground] = useState<ImagePlaceholder | null>(null);
  const [wantTranscript, setWantTranscript] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const { toast } = useToast();

  const handleAudioRecordingComplete = (blob: Blob) => {
    setAudioBlob(blob);
    setTranscript('');
  };

  const handlePhotosChange = (files: File[]) => {
    setPhotos(files);
  };

  const handleGenerateTranscript = async () => {
    if (!audioBlob) {
      toast({
        title: 'No Audio Recorded',
        description: 'Please record a voice message first.',
        variant: 'destructive',
      });
      return;
    }

    setIsTranscribing(true);
    setTranscript('Generating transcript...');
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        const result = await transcribeVoiceMessage({ audioDataUri: base64Audio });
        setTranscript(result.transcript);
      };
    } catch (error) {
      console.error('Transcription failed:', error);
      setTranscript('Could not generate transcript. Please try again.');
      toast({
        title: 'Transcription Failed',
        description: 'An error occurred while generating the transcript.',
        variant: 'destructive',
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleSendLetter = async () => {
    if (!audioBlob) {
      toast({
        title: 'Cannot Send Letter',
        description: 'A voice message is required to send a letter.',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSending(false);
    setIsSent(true);
  };
  
  const resetLetter = () => {
    setAudioBlob(null);
    setPhotos([]);
    setWantTranscript(false);
    setTranscript('');
    setIsSent(false);
  };

  const cardStyle = useMemo(() => ({
    backgroundImage: selectedBackground ? `url(${selectedBackground.imageUrl})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }), [selectedBackground]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-2xl mx-auto flex flex-col gap-8">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary">VoiceMail</h1>
          <p className="mt-2 text-lg text-muted-foreground">Craft a heartfelt message for someone special.</p>
        </div>

        <Card
          className="w-full transition-all duration-500"
          style={cardStyle}
        >
          <div className="rounded-lg p-6 text-card-foreground">
            <CardHeader>
              <CardTitle className="font-headline">Your Voice Letter</CardTitle>
              <CardDescription className="text-muted-foreground/90">Record a message of up to 5 minutes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <AudioRecorder onRecordingComplete={handleAudioRecordingComplete} />

              <div>
                <Label className="flex items-center gap-2 mb-2"><Paperclip className="w-4 h-4" />Attach Photos (up to 3)</Label>
                <PhotoUploader onPhotosChange={handlePhotosChange} />
              </div>

              {audioBlob && (
                <div className="space-y-4 rounded-lg border bg-background/80 backdrop-blur-sm p-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="transcript-switch" className="flex items-center gap-2">
                      <Wand2 className="w-4 h-4" />
                      Generate Text Transcript
                    </Label>
                    <Switch
                      id="transcript-switch"
                      checked={wantTranscript}
                      onCheckedChange={setWantTranscript}
                    />
                  </div>
                  {wantTranscript && (
                    <div className="space-y-2">
                      <Button
                        onClick={handleGenerateTranscript}
                        disabled={isTranscribing}
                        variant="secondary"
                        size="sm"
                      >
                        {isTranscribing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {transcript ? 'Regenerate' : 'Generate'} Transcript
                      </Button>
                      {(transcript || isTranscribing) && (
                        <Textarea
                          value={transcript}
                          readOnly
                          placeholder="Your transcript will appear here..."
                          className="h-32 bg-background/50"
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                size="lg"
                className="w-full"
                onClick={handleSendLetter}
                disabled={!audioBlob || isSending}
              >
                {isSending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MailCheck className="mr-2 h-4 w-4" />
                )}
                {isSending ? 'Sending...' : 'Send Your Letter'}
              </Button>
            </CardFooter>
          </div>
        </Card>

        {/* <BackgroundSelector
          selected={selectedBackground}
          onSelect={setSelectedBackground}
        /> */}
      </main>

      <SentConfirmationDialog
        open={isSent}
        onOpenChange={setIsSent}
        onConfirm={resetLetter}
      />
    </div>
  );
}
