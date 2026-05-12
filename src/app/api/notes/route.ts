import { NextResponse } from 'next/server';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET() {
  try {
    const q = query(collection(db, 'notes'), orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);
    const notes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const docRef = await addDoc(collection(db, 'notes'), {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json({ id: docRef.id, ...body });
  } catch (error) {
    console.error('Error adding note:', error);
    return NextResponse.json({ error: 'Failed to add note' }, { status: 500 });
  }
}
