import { NextResponse, NextRequest } from 'next/server';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const docRef = doc(db, 'health', id);
    await updateDoc(docRef, {
      ...body,
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json({ id, ...body });
  } catch (error) {
    console.error('Error updating health record:', error);
    return NextResponse.json({ error: 'Failed to update health record' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const docRef = doc(db, 'health', id);
    await deleteDoc(docRef);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting health record:', error);
    return NextResponse.json({ error: 'Failed to delete health record' }, { status: 500 });
  }
}
