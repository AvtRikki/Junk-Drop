import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { entities } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, userId: bodyUserId, parentId = null } = body;
        if (bodyUserId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!name || typeof name !== "string" || name.trim() === "") {
            return NextResponse.json(
                { error: "Folder name is required" },
                { status: 400 }
            );
        }

        if (parentId) {
            const [parentFolder] = await db.select().from(entities).where(and(
                eq(entities.id, parentId),
                eq(entities.userId, userId),
                eq(entities.isFolder, true)
            ));

            if (!parentFolder) {
                return NextResponse.json({ error: "Parent folder not found" }, { status: 404 });
            }
        }

        const folderData = {
            id: uuidv4(),
            name: name.trim(),
            path: `/folders/${userId}/${uuidv4()}`,
            size: 0,
            type: "folder",
            fileUrl: "",
            thumbnailUrl: null,
            userId,
            parentId,
            isFolder: true,
            isStarred: false,
            isTrash: false,
        };

        const [newFolder] = await db.insert(entities).values(folderData).returning();

        return NextResponse.json({
            success: true,
            message: "Folder created successfully",
            folder: newFolder,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
