import { NextResponse } from "next/server";
import { query } from "@/lib/db";

function formatDateOnly(value: unknown) {
  if (!value) return "";

  if (value instanceof Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return String(value);
}

export async function GET() {
  try {
    const result = await query(
      `
      SELECT
        id,
        amount,
        comment,
        operation_date,
        asset_category,
        created_at,
        type
      FROM operations
      ORDER BY operation_date DESC, created_at DESC
      `
    );

    const operations = result.rows.map((row) => ({
      id: String(row.id),
      amount: Number(row.amount),
      comment: row.comment,
      operation_date: formatDateOnly(row.operation_date),
      asset_category: row.asset_category || "Прочее",
      created_at:
        row.created_at instanceof Date
          ? row.created_at.toISOString()
          : String(row.created_at),
      type: row.type,
    }));

    return NextResponse.json(operations);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Не удалось загрузить операции",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const amount = Number(body.amount);
    const comment = body.comment ?? null;
    const operation_date = body.operation_date ?? formatDateOnly(new Date());
    const asset_category =
      typeof body.asset_category === "string" && body.asset_category.trim()
        ? body.asset_category.trim()
        : "Прочее";
    const type = body.type;

    if (!amount || Number.isNaN(amount)) {
      return NextResponse.json(
        { error: "Некорректная сумма" },
        { status: 400 }
      );
    }

    if (!type || !["income", "expense", "adjustment"].includes(type)) {
      return NextResponse.json(
        { error: "Некорректный тип операции" },
        { status: 400 }
      );
    }

    const result = await query(
      `
      INSERT INTO operations (
        amount,
        comment,
        operation_date,
        asset_category,
        type
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        amount,
        comment,
        operation_date,
        asset_category,
        created_at,
        type
      `,
      [amount, comment, operation_date, asset_category, type]
    );

    const row = result.rows[0];

    const operation = {
      id: String(row.id),
      amount: Number(row.amount),
      comment: row.comment,
      operation_date: formatDateOnly(row.operation_date),
      asset_category: row.asset_category || "Прочее",
      created_at:
        row.created_at instanceof Date
          ? row.created_at.toISOString()
          : String(row.created_at),
      type: row.type,
    };

    return NextResponse.json(operation, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Не удалось создать операцию",
      },
      { status: 500 }
    );
  }
}