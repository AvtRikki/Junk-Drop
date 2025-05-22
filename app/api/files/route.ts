import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { entities } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const queryUserId = searchParams.get("userId");
        const parentId = searchParams.get("parentId");

        if (!queryUserId || queryUserId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let userFiles;
        if (parentId) {
            userFiles = await db
                .select()
                .from(entities)
                .where(
                    and(
                        eq(entities.userId, userId),
                        eq(entities.parentId, parentId)
                    )
                );
        } else {
            userFiles = await db
                .select()
                .from(entities)
                .where(
                    and(
                        eq(entities.userId, userId),
                        isNull(entities.parentId)
                    )
                );
        }

        return NextResponse.json(userFiles);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
