import { NextResponse } from 'next/server';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET() {
  try {
    const q = query(collection(db, 'healthRecords'), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    const healthRecords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(healthRecords);
  } catch (error) {
    console.error('Error fetching health records:', error);
    return NextResponse.json({ error: 'Failed to fetch health records' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const docRef = await addDoc(collection(db, 'healthRecords'), {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json({ id: docRef.id, ...body });
  } catch (error) {
    console.error('Error adding health record:', error);
    return NextResponse.json({ error: 'Failed to add health record' }, { status: 500 });
  }
}
