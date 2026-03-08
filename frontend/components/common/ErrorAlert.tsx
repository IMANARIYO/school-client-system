import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <Alert className="bg-red-900/20 border-red-500/50 text-red-400">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-red-400 hover:text-red-300 hover:bg-red-900/20 -mr-2"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
