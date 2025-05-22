"use client";

import { Star, Trash, X, ArrowUpFromLine, Download } from "lucide-react";
import { Button } from "@heroui/button";
import type { File as FileType } from "@/lib/db/schema";

interface FileActionsProps {
    file: FileType;
    onStarAction: (id: string) => void;
    onTrashAction: (id: string) => void;
    onDeleteAction: (file: FileType) => void;
    onDownloadAction: (file: FileType) => void;
}

export default function FileActions({
                                        file,
                                        onStarAction,
                                        onTrashAction,
                                        onDeleteAction,
                                        onDownloadAction,
                                    }: FileActionsProps) {
    return (
        <div className="flex flex-wrap gap-2 justify-end">
            {!file.isDeleted && !file.isFolder && (
                <Button
                    variant="flat"
                    size="sm"
                    onPress={() => onDownloadAction(file)}
                    className="min-w-0 px-2"
                    startContent={<Download className="h-4 w-4" />}
                >
                    <span className="hidden sm:inline">Download</span>
                </Button>
            )}

            {!file.isDeleted && (
                <Button
                    variant="flat"
                    size="sm"
                    onPress={() => onStarAction(file.id)}
                    className="min-w-0 px-2"
                    startContent={
                        <Star
                            className={`h-4 w-4 ${
                                file.isFavorite
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-400"
                            }`}
                        />
                    }
                >
          <span className="hidden sm:inline">
            {file.isFavorite ? "Unstar" : "Star"}
          </span>
                </Button>
            )}

            <Button
                variant="flat"
                size="sm"
                onPress={() => onTrashAction(file.id)}
                className="min-w-0 px-2"
                color={file.isDeleted ? "success" : "default"}
                startContent={
                    file.isDeleted ? (
                        <ArrowUpFromLine className="h-4 w-4" />
                    ) : (
                        <Trash className="h-4 w-4" />
                    )
                }
            >
        <span className="hidden sm:inline">
          {file.isDeleted ? "Restore" : "Delete"}
        </span>
            </Button>
            {file.isDeleted && (
                <Button
                    variant="flat"
                    size="sm"
                    color="danger"
                    onPress={() => onDeleteAction(file)}
                    className="min-w-0 px-2"
                    startContent={<X className="h-4 w-4" />}
                >
                    <span className="hidden sm:inline">Remove</span>
                </Button>
            )}
        </div>
    );
}
