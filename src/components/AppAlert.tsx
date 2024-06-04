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
import { useSendyProvider } from '@/Providers/SendyProvider';

export function AppAlert() {
  const { alertMessage, alertTitle, openAlert, setOpenAlert, resetAlert } =
    useSendyProvider();

  return (
    <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {alertTitle && <AlertDialogTitle>{alertTitle}</AlertDialogTitle>}
          {alertMessage && (
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              resetAlert();
            }}
          >
            Ok
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
