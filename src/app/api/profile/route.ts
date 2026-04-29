import { NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary will automatically use the CLOUDINARY_URL environment variable if set

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return NextResponse.json(userSnap.data());
    } else {
      return NextResponse.json({ avatarUrl: null });
    }
  } catch (error) {
    console.error('Fetch profile error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(`family-os/avatars/${userId}`);

    // Update Firestore
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      avatarUrl: deleteField(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete avatar error:', error);
    return NextResponse.json({ error: 'Failed to delete avatar' }, { status: 500 });
  }
}
