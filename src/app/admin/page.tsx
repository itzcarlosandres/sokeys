import React from 'react';
import { db } from '@/lib/db';
import AdminPanel from '@/components/AdminPanel';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const totalProducts = await db.product.count();
  const activeKeys = await db.key.count({ where: { isSold: false } });
  const soldKeys = await db.key.count({ where: { isSold: true } });

  const orders = await db.order.findMany({ select: { total: true } });
  const salesCount = orders.length;
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

  const products = await db.product.findMany({
    include: {
      keys: { where: { isSold: false } },
      _count: { select: { keys: true, orderItems: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const recentOrders = await db.order.findMany({
    include: {
      items: {
        include: {
          product: { select: { title: true, slug: true, image: true } },
          keys: { select: { code: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const customerAgg = await db.order.groupBy({
    by: ['customerEmail'],
    _count: { id: true },
    _sum: { total: true },
    _max: { createdAt: true },
    orderBy: { _sum: { total: 'desc' } },
  });

  const customers = customerAgg.map(c => ({
    email: c.customerEmail,
    orderCount: c._count.id,
    totalSpent: c._sum.total ?? 0,
    lastOrder: c._max.createdAt?.toISOString() ?? '',
  }));

  const allKeys = await db.key.findMany({
    include: { product: { select: { title: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  const topProductsAgg = await db.orderItem.groupBy({
    by: ['productId'],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 10,
  });

  const topProducts = await Promise.all(
    topProductsAgg.map(async (tp) => {
      const p = await db.product.findUnique({ where: { id: tp.productId }, select: { title: true, slug: true, image: true } });
      const revenueAgg = await db.orderItem.aggregate({ where: { productId: tp.productId }, _sum: { price: true } });
      return { productId: tp.productId, quantity: tp._sum.quantity ?? 0, revenue: revenueAgg._sum.price ?? 0, product: p };
    })
  );

  return (
    <AdminPanel
      products={products.map(p => ({
        id: p.id, title: p.title, slug: p.slug, price: p.price, platform: p.platform,
        region: p.region, image: p.image, bannerImage: p.bannerImage, originalPrice: p.originalPrice,
        genre: p.genre, type: p.type, isFeatured: p.isFeatured, isHot: p.isHot, isRecent: p.isRecent, isPopular: p.isPopular, isBestSeller: p.isBestSeller, isOnSale: p.isOnSale, description: p.description,
        _count: { keys: p._count.keys, orderItems: p._count.orderItems }, keys: p.keys,
      }))}
      stats={{ totalProducts, activeKeys, salesCount, totalRevenue, soldKeys }}
      orders={recentOrders.map(o => ({ ...o, createdAt: o.createdAt.toISOString(), updatedAt: o.updatedAt.toISOString(), items: o.items.map(item => ({ ...item, createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString() })) }))}
      customers={customers}
      allKeys={allKeys.map(k => ({ ...k, createdAt: k.createdAt.toISOString(), updatedAt: k.updatedAt.toISOString() }))}
      topProducts={topProducts}
    />
  );
}
