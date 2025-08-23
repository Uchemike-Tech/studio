
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Document } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, XCircle, Sparkles } from 'lucide-react';

const statusIcons = {
  Verified: <CheckCircle className="h-4 w-4 text-green-600" />,
  Pending: <Clock className="h-4 w-4 text-yellow-600" />,
  Rejected: <XCircle className="h-4 w-4 text-red-600" />,
};

const statusColors: { [key in Document['status']]: string } = {
  Verified:
    'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
  Pending:
    'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800',
  Rejected:
    'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800',
};

interface ViewDocumentDialogProps {
  document: Document | null;
  onOpenChange: (open: boolean) => void;
}

export function ViewDocumentDialog({
  document,
  onOpenChange,
}: ViewDocumentDialogProps) {
  if (!document) return null;

  const isOpen = !!document;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{document.name}</DialogTitle>
          <DialogDescription>
            Details for your submitted document.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground">Status</span>
            <Badge
              variant="outline"
              className={cn('gap-2 text-sm', statusColors[document.status])}
            >
              {statusIcons[document.status]}
              {document.status}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground">Submitted</span>
            <span>{new Date(document.submittedAt).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground">Updated</span>
            <span>{new Date(document.updatedAt).toLocaleString()}</span>
          </div>
          {document.analysis && (
            <div className="space-y-2 rounded-lg border bg-secondary/50 p-4">
                <h4 className="flex items-center font-semibold"><Sparkles className="mr-2 h-4 w-4 text-accent" />AI Analysis</h4>
                <p className="text-sm">
                    <strong>Suggested Status: </strong>{document.analysis.suggestedStatus}
                </p>
                <p className="text-sm text-muted-foreground">
                    {document.analysis.summary}
                </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
