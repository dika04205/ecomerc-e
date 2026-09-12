import { NextResponse } from 'next/server';
import { getReviewsByProductId, createReview } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const reviews = getReviewsByProductId(id);
    return NextResponse.json({ reviews });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Must be logged in to review' }, { status: 401 });
    }

    const { id } = await params;
    const { rating, comment } = await request.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 });
    }

    const review = {
      id: `rev_${Date.now()}`,
      productId: id,
      userId: user.id,
      userName: user.name,
      rating,
      comment: comment || '',
      createdAt: new Date().toISOString()
    };

    createReview(review);
    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
