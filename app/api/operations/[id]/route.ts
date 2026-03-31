import { NextResponse } from "next/server";
import { query } from "@/lib/db";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const amount =
      body.amount !== undefined ? Number(body.amount) : undefined;
    const comment = body.comment !== undefined ? body.comment : undefined;
    const asset_category =
      body.asset_category !== undefined ? body.asset_category : undefined;

    if (amount !== undefined && (Number.isNaN(amount) || amount <= 0)) {
      return NextResponse.json(
        { error: "Некорректная сумма" },
        { status: 400 }
      );
    }

    const result = await query(
      `
      UPDATE operations
      SET
        amount = COALESCE($1, amount),
        comment = COALESCE($2, comment),
        asset_category = COALESCE($3, asset_category)
      WHERE id = $4
      RETURNING
        id,
        amount,
        comment,
        operation_date,
        asset_category,
        created_at,
        type
      `,
      [amount, comment, asset_category, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Операция не найдена" },
        { status: 404 }
      );
    }

    const row = result.rows[0];

    return NextResponse.json({
      id: String(row.id),
      amount: Number(row.amount),
      comment: row.comment,
      operation_date:
        row.operation_date instanceof Date
          ? row.operation_date.toISOString().slice(0, 10)
          : String(row.operation_date),
      asset_category: row.asset_category,
      created_at:
        row.created_at instanceof Date
          ? row.created_at.toISOString()
          : String(row.created_at),
      type: row.type,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Не удалось обновить операцию",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const { id } = await context.params;

    const result = await query(
      `
      DELETE FROM operations
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Операция не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Не удалось удалить операцию",
      },
      { status: 500 }
    );
  }
}