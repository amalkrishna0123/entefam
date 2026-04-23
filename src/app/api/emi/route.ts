import { NextResponse } from 'next/server';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET() {
  try {
    // Note: Due Date is a primitive number here so let's just fetch all and let client sort if needed
    const q = query(collection(db, 'emis'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const emis = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(emis);
  } catch (error) {
    console.error('Error fetching emis:', error);
    return NextResponse.json({ error: 'Failed to fetch emis' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const docRef = await addDoc(collection(db, 'emis'), {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json({ id: docRef.id, ...body });
  } catch (error) {
    console.error('Error adding emi:', error);
    return NextResponse.json({ error: 'Failed to add emi' }, { status: 500 });
  }
}
