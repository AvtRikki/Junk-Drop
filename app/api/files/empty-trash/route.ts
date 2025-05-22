import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { entities } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import ImageKit from "imagekit";
import {FileObject} from "imagekit/dist/libs/interfaces/FileDetails";

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

export async function DELETE() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const trashedFiles = await db
            .select()
            .from(entities)
            .where(and(eq(entities.userId, userId), eq(entities.isDeleted, true)));

        if (trashedFiles.length === 0) {
            return NextResponse.json(
                { message: "No files in trash" },
                { status: 200 }
            );
        }

        const deletePromises = trashedFiles
            .filter((file) => !file.isFolder) // Skip folders
            .map(async (file) => {
                try {
                    let imagekitFileId = null;

                    if (file.fileUrl) {
                        const urlWithoutQuery = file.fileUrl.split("?")[0];
                        imagekitFileId = urlWithoutQuery.split("/").pop();
                    }

                    if (!imagekitFileId && file.path) {
                        imagekitFileId = file.path.split("/").pop();
                    }

                    if (imagekitFileId) {
                        try {
                            const searchResults = await imagekit.listFiles({
                                name: imagekitFileId,
                                limit: 1,
                            });

                            if (searchResults && searchResults.length > 0) {
                                await imagekit.deleteFile((searchResults[0] as FileObject).fileId);
                            } else {
                                await imagekit.deleteFile(imagekitFileId);
                            }
                        } catch (searchError) {
                            console.error(
                                `Error searching for file in ImageKit:`,
                                searchError
                            );
                            await imagekit.deleteFile(imagekitFileId);
                        }
                    }
                } catch (error) {
                    console.error(`Error deleting file ${file.id} from ImageKit:`, error);
                }
            });

        await Promise.allSettled(deletePromises);

        const deletedFiles = await db
            .delete(entities)
            .where(and(eq(entities.userId, userId), eq(entities.isDeleted, true)))
            .returning();

        return NextResponse.json({
            success: true,
            message: `Successfully deleted ${deletedFiles.length} files from trash`,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
