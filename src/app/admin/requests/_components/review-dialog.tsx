
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Sparkles, Loader2, Eye } from 'lucide-react';
import type { PendingDocument } from '../page';
import { useToast } from '@/hooks/use-toast';

interface ReviewDocumentDialogProps {
  document: PendingDocument | null;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate: (document: PendingDocument, status: 'Approved' | 'Rejected') => Promise<void>;
}

export function ReviewDocumentDialog({
  document,
  onOpenChange,
  onStatusUpdate,
}: ReviewDocumentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  if (!document) return null;

  const isOpen = !!document;

  const handleAction = async (status: 'Approved' | 'Rejected') => {
    setIsSubmitting(true);
    await onStatusUpdate(document, status);
    setIsSubmitting(false);
  };

  const handleViewDocument = () => {
    if (document.fileUrl) {
      window.open(document.fileUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast({
        title: 'File Not Available',
        description: 'The URL for this document could not be found.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review Document</DialogTitle>
          <DialogDescription>
            Verify the document submitted by <strong>{document.studentName}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div>
                <p className="font-medium text-sm">Document Name</p>
                <p className="text-muted-foreground">{document.name}</p>
            </div>
            <div>
                <p className="font-medium text-sm">Submitted At</p>
                <p className="text-muted-foreground">{new Date(document.submittedAt).toLocaleString()}</p>
            </div>
             <Button variant="outline" className="w-full" onClick={handleViewDocument} disabled={!document.fileUrl}>
                <Eye className="mr-2" /> View Submitted File
            </Button>
            {document.analysis && (
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertTitle>AI Analysis Result</AlertTitle>
              <AlertDescription>
                <p className="font-semibold">
                  Suggested Status: {document.analysis.suggestedStatus}
                </p>
                <p>{document.analysis.summary}</p>
              </AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              variant="destructive"
              onClick={() => handleAction('Rejected')}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <XCircle className="mr-2" /> Reject
                </>
              )}
            </Button>
            <Button
              variant="default"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => handleAction('Approved')}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <CheckCircle className="mr-2" /> Approve
                </>
              )}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
