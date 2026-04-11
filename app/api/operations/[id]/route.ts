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
    const comment = body.comment;
    const operation_date = body.operation_date;
    const asset_category = body.asset_category;
    const type = body.type;

    const currentResult = await query(
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
      WHERE id = $1
      LIMIT 1
      `,
      [id]
    );

    if (currentResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Операция не найдена" },
        { status: 404 }
      );
    }

    const current = currentResult.rows[0];

    const nextAmount =
      amount !== undefined && !Number.isNaN(amount)
        ? amount
        : Number(current.amount);

    const nextComment =
      comment !== undefined ? comment : current.comment;

    const nextOperationDate =
      operation_date !== undefined
        ? operation_date
        : current.operation_date instanceof Date
        ? current.operation_date.toISOString().slice(0, 10)
        : String(current.operation_date);

    const nextAssetCategory =
      asset_category !== undefined
        ? asset_category
        : current.asset_category;

    const nextType = type !== undefined ? type : current.type;

    if (!nextAmount || Number.isNaN(nextAmount)) {
      return NextResponse.json(
        { error: "Некорректная сумма" },
        { status: 400 }
      );
    }

    if (!["income", "expense", "adjustment"].includes(nextType)) {
      return NextResponse.json(
        { error: "Некорректный тип операции" },
        { status: 400 }
      );
    }

    const result = await query(
      `
      UPDATE operations
      SET
        amount = $2,
        comment = $3,
        operation_date = $4,
        asset_category = $5,
        type = $6
      WHERE id = $1
      RETURNING
        id,
        amount,
        comment,
        operation_date,
        asset_category,
        created_at,
        type
      `,
      [id, nextAmount, nextComment, nextOperationDate, nextAssetCategory, nextType]
    );

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