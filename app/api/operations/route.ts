import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { pool, query } from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";

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
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

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
      WHERE user_id = $1
      ORDER BY operation_date DESC, created_at DESC
      `,
      [user.id]
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
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const body = await request.json();

    const action = body.action;
    const amount = Number(body.amount);
    const comment = body.comment ?? null;
    const operation_date = body.operation_date ?? formatDateOnly(new Date());

    if (action === "move") {
      const fromCategory =
        typeof body.from_asset_category === "string"
          ? body.from_asset_category.trim()
          : "";
      const toCategory =
        typeof body.to_asset_category === "string"
          ? body.to_asset_category.trim()
          : "";

      if (!amount || Number.isNaN(amount)) {
        return NextResponse.json(
          { error: "Некорректная сумма" },
          { status: 400 }
        );
      }

      if (!fromCategory) {
        return NextResponse.json(
          { error: "Выберите исходную категорию" },
          { status: 400 }
        );
      }

      if (!toCategory) {
        return NextResponse.json(
          { error: "Выберите целевую категорию" },
          { status: 400 }
        );
      }

      if (fromCategory === toCategory) {
        return NextResponse.json(
          { error: "Категории перемещения должны отличаться" },
          { status: 400 }
        );
      }

      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        const balanceResult = await client.query<{ balance: string | number }>(
          `
          SELECT COALESCE(
            SUM(
              CASE
                WHEN type = 'expense' THEN -amount
                ELSE amount
              END
            ),
            0
          ) AS balance
          FROM operations
          WHERE user_id = $1
            AND asset_category = $2
          `,
          [user.id, fromCategory]
        );

        const currentBalance = Number(balanceResult.rows[0]?.balance ?? 0);

        if (currentBalance < amount) {
          await client.query("ROLLBACK");
          return NextResponse.json(
            {
              error:
                "В выбранной исходной категории недостаточно средств для перемещения",
            },
            { status: 400 }
          );
        }

        const transferGroupId = randomUUID();

        await client.query(
          `
          INSERT INTO operations (
            user_id,
            amount,
            comment,
            operation_date,
            asset_category,
            type,
            transfer_group_id
          )
          VALUES
            ($1, $2, $3, $4, $5, 'expense', $6),
            ($1, $2, $3, $4, $7, 'income', $6)
          `,
          [
            user.id,
            amount,
            comment,
            operation_date,
            fromCategory,
            transferGroupId,
            toCategory,
          ]
        );

        await client.query("COMMIT");

        return NextResponse.json({ ok: true }, { status: 201 });
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    }

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
        user_id,
        amount,
        comment,
        operation_date,
        asset_category,
        type
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        amount,
        comment,
        operation_date,
        asset_category,
        created_at,
        type
      `,
      [user.id, amount, comment, operation_date, asset_category, type]
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
