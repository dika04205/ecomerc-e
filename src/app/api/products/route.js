import { NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const category = searchParams.get('category') || '';
    const minPrice = parseFloat(searchParams.get('minPrice')) || 0;
    const maxPrice = parseFloat(searchParams.get('maxPrice')) || Infinity;
    const sort = searchParams.get('sort') || 'featured';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const featured = searchParams.get('featured');

    let products = getProducts();

    // Filter
    if (search) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search) ||
        p.tags?.some(t => t.toLowerCase().includes(search))
      );
    }

    if (category) {
      products = products.filter(p => p.category === category);
    }

    if (featured === 'true') {
      products = products.filter(p => p.featured);
    }

    products = products.filter(p => p.price >= minPrice && p.price <= maxPrice);

    // Sort
    switch (sort) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        products.reverse();
        break;
      default:
        products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    const total = products.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginated = products.slice(start, start + limit);

    return NextResponse.json({
      products: paginated,
      total,
      page,
      totalPages
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const product = {
      id: `prod_${Date.now()}`,
      ...body,
      rating: body.rating || 0,
      reviewCount: 0,
      createdAt: new Date().toISOString()
    };

    createProduct(product);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
