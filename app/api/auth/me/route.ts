import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";

export async function GET() {
  try {
    const user = await getCurrentUser();

    return NextResponse.json({
      ok: true,
      user,
    });
  } catch (error) {
    console.error("Auth me error:", error);

    return NextResponse.json(
      { ok: false, error: "Не удалось получить пользователя." },
      { status: 500 }
    );
  }
}
