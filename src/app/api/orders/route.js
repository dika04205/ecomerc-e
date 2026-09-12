import { NextResponse } from 'next/server';
import { getOrders, getOrdersByUserId, createOrder } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const orders = user.role === 'admin' ? getOrders() : getOrdersByUserId(user.id);
    return NextResponse.json({ orders });
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

    const { items, shipping, total } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const order = {
      id: `ord_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      items,
      shipping,
      subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      total,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    createOrder(order);
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
