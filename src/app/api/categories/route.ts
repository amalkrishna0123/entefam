import { NextResponse } from 'next/server';

export async function GET() {
  const categories = ['Food', 'Transport', 'Rent', 'Utilities', 'Entertainment', 'Health', 'Other'];
  return NextResponse.json(categories);
}
