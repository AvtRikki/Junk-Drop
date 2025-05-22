import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { entities } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ fileId: string }> }
) {
    try {
        // Check authentication
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { fileId } = await props.params;

        if (!fileId) {
            return NextResponse.json(
                { error: "File ID is required" },
                { status: 400 }
            );
        }

        // Get the current file
        const [file] = await db
            .select()
            .from(entities)
            .where(and(eq(entities.id, fileId), eq(entities.userId, userId)));

        if (!file) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }

        // Toggle the isStarred status
        const updatedFiles = await db
            .update(entities)
            .set({ isFavorite: !file.isFavorite })
            .where(and(eq(entities.id, fileId), eq(entities.userId, userId)))
            .returning();

        const updatedFile = updatedFiles[0];

        return NextResponse.json(updatedFile);
    } catch (error: any ) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
