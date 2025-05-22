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

        const [file] = await db
            .select()
            .from(entities)
            .where(and(eq(entities.id, fileId), eq(entities.userId, userId)));

        if (!file) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }

        const [updatedFile] = await db
            .update(entities)
            .set({ isDeleted: !file.isDeleted })
            .where(and(eq(entities.id, fileId), eq(entities.userId, userId)))
            .returning();

        const action = updatedFile.isDeleted ? "moved to trash" : "restored";
        return NextResponse.json({
            ...updatedFile,
            message: `File ${action} successfully`,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
