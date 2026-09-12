import { NextResponse } from 'next/server';
import { getWishlistByUserId, addToWishlist, removeFromWishlist } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const wishlist = getWishlistByUserId(user.id);
    return NextResponse.json({ wishlist });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { productId } = await request.json();
    const wishlist = addToWishlist(user.id, productId);
    return NextResponse.json({ wishlist });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { productId } = await request.json();
    const wishlist = removeFromWishlist(user.id, productId);
    return NextResponse.json({ wishlist });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
