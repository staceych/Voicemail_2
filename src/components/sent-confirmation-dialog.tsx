'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CheckCircle2, Send } from 'lucide-react';

interface SentConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function SentConfirmationDialog({ open, onOpenChange, onConfirm }: SentConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center text-center">
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <AlertDialogTitle className="font-headline text-2xl">Letter Sent!</AlertDialogTitle>
          <AlertDialogDescription className="max-w-sm">
            Your heartfelt message is on its way. It will be delivered to the recipient tomorrow to add a touch of pleasant anticipation.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onConfirm} className="w-full">
            <Send className="mr-2 h-4 w-4" />
            Compose Another Letter
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
