"use client";

import { useRef, useState, type ReactNode } from "react";
import { CheckCircle2, Loader2, Upload, X } from "lucide-react";

import {
  defaultExcelAccept,
  defaultExcelExtensions,
  FileUploader,
  type FileUploaderHandle,
} from "@/components/file-uploader/file-uploader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

type FileUploadDialogProps = {
  /** Dialog title shown in the header. */
  title: string;
  /** Optional custom trigger. When omitted, a default Upload button is rendered. */
  children?: ReactNode;
  /** Default trigger label. */
  triggerLabel?: string;
  /** Default trigger icon. */
  triggerIcon?: ReactNode;
  /** Optional trigger layout class. */
  triggerClassName?: string;
  /** Placeholder label passed to the inline FileUploader. */
  uploadLabel?: string;
  /** Primary footer action label. */
  confirmLabel?: string;
  /** Secondary footer action label. */
  cancelLabel?: string;
  /** Native file input accept string. Defaults to Excel formats. */
  accept?: string;
  /** File extensions accepted by client-side validation. */
  allowedExtensions?: string[];
  /** Allows selecting more than one file. */
  multiple?: boolean;
  /** Controlled dialog open state. */
  open?: boolean;
  /** Controlled open-state callback. */
  onOpenChange?: (open: boolean) => void;
  /** Upload callback passed through to FileUploader. */
  onUpload?: (files: File[]) => Promise<void> | void;
};

/**
 * A modal upload flow built from FileUploader plus dialog-level CTAs.
 *
 * @component
 * @param {object} props - The props for the file upload dialog.
 * @param {string} props.title - Dialog title shown in the header.
 * @param {ReactNode} [props.children] - Optional custom trigger. When omitted, a default Upload button is rendered.
 * @param {string} [props.triggerLabel="Upload"] - Default trigger label.
 * @param {ReactNode} [props.triggerIcon] - Default trigger icon.
 * @param {string} [props.triggerClassName] - Optional trigger layout class.
 * @param {string} [props.uploadLabel="Choose Excel file"] - Placeholder label passed to the inline FileUploader.
 * @param {string} [props.confirmLabel="OK"] - Primary footer action label.
 * @param {string} [props.cancelLabel="Cancel"] - Secondary footer action label.
 * @param {string} [props.accept] - Native file input accept string. Defaults to Excel formats.
 * @param {string[]} [props.allowedExtensions] - File extensions accepted by client-side validation.
 * @param {boolean} [props.multiple=false] - Allows selecting more than one file.
 * @param {boolean} [props.open] - Controlled dialog open state.
 * @param {(open: boolean) => void} [props.onOpenChange] - Controlled open-state callback.
 * @param {(files: File[]) => Promise<void> | void} [props.onUpload] - Upload callback passed through to FileUploader.
 * @returns {JSX.Element} The rendered file upload dialog component.
 */
export function FileUploadDialog({
  accept = defaultExcelAccept,
  allowedExtensions = defaultExcelExtensions,
  cancelLabel,
  children,
  confirmLabel,
  multiple = false,
  open: openProp,
  onOpenChange,
  onUpload,
  title,
  triggerIcon,
  triggerLabel,
  triggerClassName,
  uploadLabel,
}: FileUploadDialogProps) {
  const t = useTranslations();
  const resolvedCancelLabel = cancelLabel ?? t("common.actions.cancel");
  const resolvedConfirmLabel = confirmLabel ?? t("common.actions.ok");
  const resolvedTriggerLabel = triggerLabel ?? t("common.actions.upload");
  const resolvedUploadLabel = uploadLabel ?? t("upload.chooseExcelFile");
  const [internalOpen, setInternalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const uploaderRef = useRef<FileUploaderHandle>(null);
  const open = openProp ?? internalOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (openProp === undefined) setInternalOpen(nextOpen);
    if (!nextOpen) {
      setSelectedFiles([]);
      setIsUploading(false);
      uploaderRef.current?.reset();
    }
    onOpenChange?.(nextOpen);
  };

  const handleUpload = async () => {
    const uploaded = await uploaderRef.current?.upload();
    if (uploaded) handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children || openProp === undefined ? (
        <DialogTrigger asChild>{children ?? renderTrigger()}</DialogTrigger>
      ) : null}
      <DialogContent
        className="w-125 gap-0 overflow-hidden p-0 sm:max-w-125"
        showCloseButton={false}
      >
        <DialogHeader className="flex-row items-center justify-between gap-4 border-b px-6 py-4">
          <DialogTitle className="text-lg font-semibold leading-7">
            {title}
          </DialogTitle>
          <DialogClose asChild>
            <Button
              aria-label={t("common.actions.closeUploadDialog")}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <FileUploader
          ref={uploaderRef}
          accept={accept}
          allowedExtensions={allowedExtensions}
          className="px-6 py-6"
          multiple={multiple}
          onFilesChange={setSelectedFiles}
          onStatusChange={(status) => setIsUploading(status === "uploading")}
          onUpload={onUpload}
          uploadLabel={resolvedUploadLabel}
        />
        <div className="flex justify-end gap-2 border-t px-6 py-4">
          <DialogClose asChild>
            <Button disabled={isUploading} type="button" variant="outline">
              {resolvedCancelLabel}
            </Button>
          </DialogClose>
          <Button
            disabled={selectedFiles.length === 0 || isUploading}
            onClick={handleUpload}
            type="button"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            {isUploading ? t("upload.uploading") : resolvedConfirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  function renderTrigger() {
    return (
      <Button className={triggerClassName} type="button" variant="outline">
        {triggerIcon ?? <Upload className="h-4 w-4" />}
        {resolvedTriggerLabel}
      </Button>
    );
  }
}
