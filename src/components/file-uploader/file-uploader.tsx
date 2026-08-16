"use client";

import * as React from "react";
import { FileText, RefreshCw, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Button } from "@/components/ui/button";
import { AppTooltip } from "@/components/app-tooltip";
import { cn } from "@/lib/utils/cnName";
import { useTranslations } from "next-intl";
import type { Translate } from "@/i18n/types";

type UploadStatus = "idle" | "uploading" | "success" | "error";
type AttachmentUploadState = "idle" | "uploading" | "error";

export const defaultExcelAccept =
  ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
export const defaultExcelExtensions = ["xls", "xlsx"];

/**
 * Imperative API exposed by FileUploader so parent containers can own CTAs.
 * Drawers and dialogs should call these methods from their own Cancel/OK buttons
 * instead of the inline uploader rendering form-level actions itself.
 */
export type FileUploaderHandle = {
  /** Clears selected files, status, and the native input value. */
  reset: () => void;
  /** Runs upload for selected files and returns whether it completed. */
  upload: () => Promise<boolean>;
};

type FileUploaderProps = {
  /** Native file input accept string. Defaults to Excel formats. */
  accept?: string;
  /** File extensions accepted by client-side validation. */
  allowedExtensions?: string[];
  /** Optional wrapper layout class. */
  className?: string;
  /** Allows more than one selected file when true. */
  multiple?: boolean;
  /** Emits the currently selected valid files whenever selection changes. */
  onFilesChange?: (files: File[]) => void;
  /** Emits upload status so parent CTAs can show loading/disabled state. */
  onStatusChange?: (status: UploadStatus) => void;
  /** Upload callback invoked by the imperative upload method. */
  onUpload?: (files: File[]) => Promise<void> | void;
  /** Primary label shown in the picker placeholder. */
  uploadLabel?: string;
};

/**
 * An inline file picker/dropzone with selected-file preview and validation.
 *
 * @component
 * @param {object} props - The props for the file uploader.
 * @param {string} [props.accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"] - Native file input accept string.
 * @param {string[]} [props.allowedExtensions=["xls", "xlsx"]] - File extensions accepted by client-side validation.
 * @param {string} [props.className] - Optional wrapper layout class.
 * @param {boolean} [props.multiple=false] - Allows more than one selected file when true.
 * @param {(files: File[]) => void} [props.onFilesChange] - Emits the currently selected valid files whenever selection changes.
 * @param {(status: "idle" | "uploading" | "success" | "error") => void} [props.onStatusChange] - Emits upload status so parent CTAs can show loading/disabled state.
 * @param {(files: File[]) => Promise<void> | void} [props.onUpload] - Upload callback invoked by the imperative upload method.
 * @param {string} [props.uploadLabel="Choose Excel file"] - Primary label shown in the picker placeholder.
 * @returns {JSX.Element} The rendered file uploader component.
 *
 * @imperativeHandle FileUploaderHandle
 * @method reset - Clears selected files, status, and the native input value.
 * @method upload - Runs upload for selected files and returns whether it completed.
 */
export const FileUploader = React.forwardRef<
  FileUploaderHandle,
  FileUploaderProps
>(function FileUploader(
  {
    accept = defaultExcelAccept,
    allowedExtensions = defaultExcelExtensions,
    className,
    multiple = false,
    onFilesChange,
    onStatusChange,
    onUpload,
    uploadLabel,
  },
  ref
) {
  const t = useTranslations();
  const inputId = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [files, setFiles] = React.useState<File[]>([]);
  const [status, setStatus] = React.useState<UploadStatus>("idle");

  const hasFiles = files.length > 0;
  const showPicker = multiple || !hasFiles;

  const setNextStatus = React.useCallback(
    (nextStatus: UploadStatus) => {
      setStatus(nextStatus);
      onStatusChange?.(nextStatus);
    },
    [onStatusChange]
  );

  const setNextFiles = React.useCallback(
    (nextFiles: File[]) => {
      setFiles(nextFiles);
      onFilesChange?.(nextFiles);
    },
    [onFilesChange]
  );

  const resetUploadState = React.useCallback(() => {
    setNextFiles([]);
    setNextStatus("idle");
    if (inputRef.current) inputRef.current.value = "";
  }, [setNextFiles, setNextStatus]);

  const uploadFiles = React.useCallback(async () => {
    if (files.length === 0 || status === "uploading") return false;

    try {
      setNextStatus("uploading");
      await onUpload?.(files);
      setNextStatus("success");
      toast.success(t("upload.complete"), {
        description:
          files.length === 1
            ? t("upload.uploadedOne", {
                name: files[0]?.name ?? t("upload.fileFallback"),
              })
            : t("upload.uploadedMany", { count: files.length }),
      });
      resetUploadState();
      return true;
    } catch (error) {
      setNextStatus("error");
      toast.error(t("upload.failed"), {
        description:
          error instanceof Error ? error.message : t("upload.checkFile"),
      });
      return false;
    }
  }, [files, onUpload, resetUploadState, setNextStatus, status, t]);

  React.useImperativeHandle(
    ref,
    () => ({ reset: resetUploadState, upload: uploadFiles }),
    [resetUploadState, uploadFiles]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (selectedFiles.length === 0) return;

    const validExtensions = new Set(
      allowedExtensions.map((extension) => extension.toLowerCase())
    );
    const validFiles = selectedFiles.filter((file) =>
      validExtensions.has(getFileExtension(file.name))
    );

    if (validFiles.length !== selectedFiles.length) {
      toast.error(t("upload.onlySupportedFilesAllowed"), {
        description: t("upload.pleaseUploadFile", {
          extensions: formatAllowedExtensions(allowedExtensions),
        }),
      });
    }

    if (validFiles.length === 0) {
      event.target.value = "";
      return;
    }

    setNextFiles(multiple ? [...files, ...validFiles] : validFiles.slice(0, 1));
    setNextStatus("idle");
    event.target.value = "";
  };

  const removeFile = (index: number) => {
    setNextFiles(files.filter((_, currentIndex) => currentIndex !== index));
    setNextStatus("idle");
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  return (
    <div className={cn("grid gap-5", className)}>
      <input
        id={inputId}
        ref={inputRef}
        accept={accept}
        className="sr-only"
        multiple={multiple}
        onChange={handleFileChange}
        type="file"
      />

      {showPicker ? (
        <Button
          className="h-auto min-h-16 w-full justify-start rounded-lg border-dashed bg-background px-4 py-4 text-left hover:bg-muted/40"
          onClick={openFilePicker}
          type="button"
          variant="outline"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Upload className="h-4 w-4" />
          </span>
          <span className="grid min-w-0 gap-1">
            <span className="truncate text-sm font-semibold text-foreground">
              {hasFiles
                ? t("upload.addAnotherFile")
                : (uploadLabel ?? t("upload.chooseExcelFile"))}
            </span>
            <span className="text-xs font-normal text-muted-foreground">
              {t("upload.onlySupportedFiles", {
                extensions: formatAllowedExtensions(allowedExtensions),
              })}
            </span>
          </span>
        </Button>
      ) : null}

      {hasFiles ? (
        <AttachmentGroup className="flex-col gap-2 overflow-visible py-0">
          {files.map((file, index) => (
            <Attachment
              className="w-full"
              key={file.name + "-" + file.lastModified + "-" + index}
              state={getAttachmentState(status)}
            >
              <AttachmentMedia>
                <FileText className="h-5 w-5" />
              </AttachmentMedia>
              <AttachmentContent>
                <AppTooltip content={file.name} variant="default">
                  <AttachmentTitle>{file.name}</AttachmentTitle>
                </AppTooltip>
                <AttachmentDescription>
                  {getFileExtension(file.name).toUpperCase()} -{" "}
                  {getAttachmentDescription(status, file.size, t)}
                </AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                {!multiple ? (
                  <AttachmentAction
                    aria-label={t("common.actions.replaceNamed", {
                      name: file.name,
                    })}
                    onClick={openFilePicker}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    {t("common.actions.replace")}
                  </AttachmentAction>
                ) : null}
                <AttachmentAction
                  aria-label={t("common.actions.removeNamed", {
                    name: file.name,
                  })}
                  onClick={() => removeFile(index)}
                  size="icon-sm"
                  type="button"
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </AttachmentAction>
              </AttachmentActions>
            </Attachment>
          ))}
        </AttachmentGroup>
      ) : null}

      <UploadStatusMessage status={status} t={t} />
    </div>
  );
});

function UploadStatusMessage({
  status,
  t,
}: {
  status: UploadStatus;
  t: Translate;
}) {
  if (status === "idle") return null;

  const message = {
    uploading: t("upload.uploadingSelected"),
    success: t("upload.completeSentence"),
    error: t("upload.failedRetry"),
  }[status];

  return (
    <div
      className={cn(
        "rounded-lg border px-4 py-3 text-sm font-medium",
        status === "uploading" && "border-primary/20 bg-primary/5 text-primary",
        status === "success" &&
          "border-status-active/20 bg-status-active/10 text-status-active",
        status === "error" &&
          "border-destructive/20 bg-destructive/10 text-destructive"
      )}
    >
      {message}
    </div>
  );
}

function formatFileSize(size: number) {
  if (size < 1024) return size + " B";
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
  return (size / 1024 / 1024).toFixed(1) + " MB";
}

function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function getAttachmentState(status: UploadStatus): AttachmentUploadState {
  if (status === "uploading") return "uploading";
  if (status === "error") return "error";
  return "idle";
}

function getAttachmentDescription(
  status: UploadStatus,
  size: number,
  t: Translate
) {
  if (status === "uploading") return t("upload.uploading");
  if (status === "error") return t("upload.failedRetry");
  return formatFileSize(size);
}

function formatAllowedExtensions(extensions: string[]) {
  return extensions.map((extension) => "." + extension).join(" and ");
}
