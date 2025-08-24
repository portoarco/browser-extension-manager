import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface IAlertConfirmation {
  open: boolean;
  setOpen: (value: boolean) => void;
  onConfirm: () => void;
}

export default function AlertConfirmation({
  open,
  setOpen,
  onConfirm,
}: IAlertConfirmation) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="bg-white dark:bg-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure delete this extension?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This extension will be removed from
            your extension list
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => setOpen(false)}
            className="bg-white hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 cursor-pointer"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
