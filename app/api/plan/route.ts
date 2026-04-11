import { NextResponse } from "next/server";
import { query } from "@/lib/db";

const DEFAULT_USER_ID = 1;

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

function mapRow(row: any) {
  return {
    monthlyContribution: String(row.monthly_contribution ?? "50000"),
    inflation: String(row.inflation ?? "9"),
    contributionGrowth: String(row.contribution_growth ?? "10"),
    years: String(row.years ?? "10"),

    stocksBondsShare: String(row.stocks_bonds_share ?? "50"),
    stocksBondsReturn: String(row.stocks_bonds_return ?? "14"),

    rubCashShare: String(row.rub_cash_share ?? "20"),
    rubCashReturn: String(row.rub_cash_return ?? "8"),

    metalsShare: String(row.metals_share ?? "10"),
    metalsReturn: String(row.metals_return ?? "5"),

    realEstateShare: String(row.real_estate_share ?? "10"),
    realEstateReturn: String(row.real_estate_return ?? "10"),

    currencyShare: String(row.currency_share ?? "5"),
    currencyReturn: String(row.currency_return ?? "2"),

    bondsShare: String(row.bonds_share ?? "0"),
    bondsReturn: String(row.bonds_return ?? "11"),

    depositsShare: String(row.deposits_share ?? "0"),
    depositsReturn: String(row.deposits_return ?? "12"),

    cryptoShare: String(row.crypto_share ?? "0"),
    cryptoReturn: String(row.crypto_return ?? "0"),

    otherShare: String(row.other_share ?? "0"),
    otherReturn: String(row.other_return ?? "0"),

    planStartDate: formatDateOnly(row.plan_start_date),
  };
}

export async function GET() {
  try {
    const result = await query(
      `
      SELECT
        monthly_contribution,
        inflation,
        contribution_growth,
        years,
        stocks_bonds_share,
        stocks_bonds_return,
        rub_cash_share,
        rub_cash_return,
        metals_share,
        metals_return,
        real_estate_share,
        real_estate_return,
        currency_share,
        currency_return,
        bonds_share,
        bonds_return,
        deposits_share,
        deposits_return,
        crypto_share,
        crypto_return,
        other_share,
        other_return,
        plan_start_date
      FROM plan_settings
      WHERE user_id = $1
      LIMIT 1
      `,
      [DEFAULT_USER_ID]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(null);
    }

    return NextResponse.json(mapRow(result.rows[0]));
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Не удалось загрузить стратегию",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await query(
      `
      INSERT INTO plan_settings (
        user_id,
        monthly_contribution,
        inflation,
        contribution_growth,
        years,
        stocks_bonds_share,
        stocks_bonds_return,
        rub_cash_share,
        rub_cash_return,
        metals_share,
        metals_return,
        real_estate_share,
        real_estate_return,
        currency_share,
        currency_return,
        bonds_share,
        bonds_return,
        deposits_share,
        deposits_return,
        crypto_share,
        crypto_return,
        other_share,
        other_return,
        plan_start_date,
        updated_at
      )
      VALUES (
        $1,$2,$3,$4,$5,
        $6,$7,$8,$9,$10,$11,
        $12,$13,$14,$15,$16,$17,
        $18,$19,$20,$21,$22,$23,$24,NOW()
      )
      ON CONFLICT (user_id)
      DO UPDATE SET
        monthly_contribution = EXCLUDED.monthly_contribution,
        inflation = EXCLUDED.inflation,
        contribution_growth = EXCLUDED.contribution_growth,
        years = EXCLUDED.years,
        stocks_bonds_share = EXCLUDED.stocks_bonds_share,
        stocks_bonds_return = EXCLUDED.stocks_bonds_return,
        rub_cash_share = EXCLUDED.rub_cash_share,
        rub_cash_return = EXCLUDED.rub_cash_return,
        metals_share = EXCLUDED.metals_share,
        metals_return = EXCLUDED.metals_return,
        real_estate_share = EXCLUDED.real_estate_share,
        real_estate_return = EXCLUDED.real_estate_return,
        currency_share = EXCLUDED.currency_share,
        currency_return = EXCLUDED.currency_return,
        bonds_share = EXCLUDED.bonds_share,
        bonds_return = EXCLUDED.bonds_return,
        deposits_share = EXCLUDED.deposits_share,
        deposits_return = EXCLUDED.deposits_return,
        crypto_share = EXCLUDED.crypto_share,
        crypto_return = EXCLUDED.crypto_return,
        other_share = EXCLUDED.other_share,
        other_return = EXCLUDED.other_return,
        plan_start_date = EXCLUDED.plan_start_date,
        updated_at = NOW()
      RETURNING
        monthly_contribution,
        inflation,
        contribution_growth,
        years,
        stocks_bonds_share,
        stocks_bonds_return,
        rub_cash_share,
        rub_cash_return,
        metals_share,
        metals_return,
        real_estate_share,
        real_estate_return,
        currency_share,
        currency_return,
        bonds_share,
        bonds_return,
        deposits_share,
        deposits_return,
        crypto_share,
        crypto_return,
        other_share,
        other_return,
        plan_start_date
      `,
      [
        DEFAULT_USER_ID,
        Number(body.monthlyContribution ?? 0),
        Number(body.inflation ?? 0),
        Number(body.contributionGrowth ?? 0),
        Number(body.years ?? 0),
        Number(body.stocksBondsShare ?? 0),
        Number(body.stocksBondsReturn ?? 0),
        Number(body.rubCashShare ?? 0),
        Number(body.rubCashReturn ?? 0),
        Number(body.metalsShare ?? 0),
        Number(body.metalsReturn ?? 0),
        Number(body.realEstateShare ?? 0),
        Number(body.realEstateReturn ?? 0),
        Number(body.currencyShare ?? 0),
        Number(body.currencyReturn ?? 0),
        Number(body.bondsShare ?? 0),
        Number(body.bondsReturn ?? 0),
        Number(body.depositsShare ?? 0),
        Number(body.depositsReturn ?? 0),
        Number(body.cryptoShare ?? 0),
        Number(body.cryptoReturn ?? 0),
        Number(body.otherShare ?? 0),
        Number(body.otherReturn ?? 0),
        body.planStartDate || null,
      ]
    );

    return NextResponse.json(mapRow(result.rows[0]));
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Не удалось сохранить стратегию",
      },
      { status: 500 }
    );
  }
}