import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiCall } from "@/helper/apiCall";
import { getData } from "@/lib/utils";
import { ok } from "assert";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface IAddExtensionsDialog {
  openDialog: boolean;
  setOpenDialog: (value: boolean) => void;
  onSuccess: () => void;
}

const randomIconAssets = [
  "/assets/logo-style-spy.svg",
  "/assets/logo-devlens.svg",
  "/assets/logo-speed-boost.svg",
  "/assets/logo-json-wizard.svg",
  "/assets/logo-tab-master-pro.svg",
  "/assets/logo-viewport-buddy.svg",
  "/assets/logo-markup-notes.svg",
  "/assets/logo-grid-guides.svg",
  "/assets/logo-palette-picker.svg",
  "/assets/logo-link-checker.svg",
  "/assets/logo-dom-snapshot.svg",
  "/assets/logo-console-plus.svg",
];

export default function AddExtensionsDialog({
  openDialog,
  setOpenDialog,
  onSuccess,
}: IAddExtensionsDialog) {
  const [iconId, setIconId] = useState<number | null>(null);
  const inTitleRef = useRef<HTMLInputElement>(null);
  const inDescriptionRef = useRef<HTMLTextAreaElement>(null);

  const randomizeIconId = () => {
    const id = Math.floor(Math.random() * randomIconAssets.length);
    setIconId(id);
  };

  const AddExtension = async () => {
    const name = inTitleRef.current?.value;
    const description = inDescriptionRef.current?.value;
    const logo = randomIconAssets[iconId ?? 0];

    if (!name || !description) return toast.warn("Input cannot be empty");

    try {
      const res = await apiCall.post("/browser_extensions", {
        name,
        description,
        logo,
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Add New Extension Success!");
        setOpenDialog(false);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.log(error);
      toast.error("There is something error");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (openDialog) {
      randomizeIconId();
    }
  }, [openDialog]);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="bg-white dark:bg-gray-600">
        <DialogHeader>
          <DialogTitle>Add New Extension</DialogTitle>
          <DialogDescription>
            Add your new extension and apply to your browser perfectly!
          </DialogDescription>
        </DialogHeader>
        {/* Dialog Form */}
        <form className="flex flex-col md:flex-row items-center gap-x-5">
          <div>
            <Image
              src={randomIconAssets[iconId ?? 0]}
              width={100}
              height={100}
              alt="default-icon"
            ></Image>
          </div>
          <div className="w-full">
            <div className="mt-2">
              <label>Extension Name</label>
              <Input
                className="mt-2"
                placeholder="Extension Name"
                ref={inTitleRef}
              ></Input>
            </div>
            <div className="mt-2">
              <label>Description</label>
              <Textarea
                className="mt-2"
                placeholder="Functionality Description"
                ref={inDescriptionRef}
              ></Textarea>
            </div>
          </div>
        </form>
        <DialogFooter className="flex  gap-x-2 ">
          <DialogClose asChild onClick={() => setOpenDialog(false)}>
            <Button variant={"destructive"}>Cancel</Button>
          </DialogClose>
          <Button onClick={AddExtension}>Add Data</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
