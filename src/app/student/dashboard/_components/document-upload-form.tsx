
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { analyzeClearanceDocuments } from '@/ai/flows/analyze-clearance-documents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles } from 'lucide-react';
import type { Document } from '@/lib/types';

const formSchema = z.object({
  documentFile: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, 'Document is required.')
    .refine((files) => files?.[0]?.size <= 5000000, 'Max file size is 5MB.')
    .refine(
      (files) =>
        ['application/pdf', 'image/jpeg', 'image/png'].includes(
          files?.[0]?.type
        ),
      'Only .pdf, .jpg, and .png files are accepted.'
    ),
  documentDescription: z
    .string()
    .min(10, 'Description must be at least 10 characters.'),
});

type FormValues = z.infer<typeof formSchema>;

interface DocumentUploadFormProps {
  studentId: string;
  onDocumentUpload: (document: Document) => void;
}

const fileToDataUri = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export function DocumentUploadForm({
  studentId,
  onDocumentUpload,
}: DocumentUploadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    suggestedClearanceStatus: string;
    analysisSummary: string;
  } | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { documentDescription: '' },
  });
  const fileRef = form.register('documentFile');

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setAnalysisResult(null);

    const file: File = data.documentFile[0];
    const docId = `doc_${Date.now()}`;

    try {
      // 1. Upload file to Firebase Storage
      const storageRef = ref(storage, `documents/${studentId}/${docId}-${file.name}`);
      toast({ title: 'Uploading File...', description: 'Please wait.' });
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      // 2. Get data URI for AI analysis
      const documentDataUri = await fileToDataUri(file);

      // 3. Run AI Analysis
      toast({
        title: 'Analyzing Document...',
        description: 'Please wait while the AI analyzes your document.',
      });
      const result = await analyzeClearanceDocuments({
        documentDataUri,
        documentDescription: data.documentDescription,
        studentId,
      });
      setAnalysisResult(result);

      // 4. Create document object and trigger parent callback
      const newDocument: Document = {
        id: docId,
        name: file.name,
        status: 'Pending', // All new documents are pending admin approval
        submittedAt: new Date(),
        updatedAt: new Date(),
        fileUrl: downloadUrl, // Store the public URL from Firebase Storage
        analysis: {
          summary: result.analysisSummary,
          suggestedStatus: result.suggestedClearanceStatus,
        },
      };

      onDocumentUpload(newDocument);

      toast({
        title: 'Analysis Complete!',
        description: 'Your document has been submitted for review.',
        variant: 'default',
        className: 'bg-accent text-accent-foreground border-accent',
      });
      form.reset();
      const fileInput = document.getElementById(
        'documentFile'
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error('Upload or analysis failed:', error);
      toast({
        title: 'Error',
        description: 'Could not upload or analyze the document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="documentFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document File (PDF, JPG, PNG)</FormLabel>
                <FormControl>
                  <Input
                    id="documentFile"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    {...fileRef}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="documentDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., School fees receipt for the 2023/2024 academic session."
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Upload and Analyze'
            )}
          </Button>
        </form>
      </Form>

      {analysisResult && (
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertTitle>AI Analysis Result</AlertTitle>
          <AlertDescription>
            <p className="font-semibold">
              Suggested Status: {analysisResult.suggestedClearanceStatus}
            </p>
            <p>{analysisResult.analysisSummary}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Note: This is an AI suggestion. An admin will perform the final
              review. Your document has been submitted with a 'Pending' status.
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
