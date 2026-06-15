"use server";

import { db } from "@/lib/db";

interface OrderItemInput {
  productId: string;
  quantity: number;
  price: number;
}

interface CreateOrderInput {
  email: string;
  name: string;
  items: OrderItemInput[];
  total: number;
  userId?: string | null;
}

export async function createOrder(input: CreateOrderInput) {
  try {
    const { email, name, items, total, userId } = input;

    if (!email || !name || items.length === 0) {
      return { success: false, error: "Datos de contacto o productos inválidos." };
    }

    // 1. Verify stock for all requested products before executing transaction
    for (const item of items) {
      const availableKeysCount = await db.key.count({
        where: {
          productId: item.productId,
          isSold: false,
        },
      });

      if (availableKeysCount < item.quantity) {
        const product = await db.product.findUnique({
          where: { id: item.productId },
          select: { title: true },
        });
        return {
          success: false,
          error: `Lo sentimos, no hay stock suficiente para: ${product?.title || "Juego"}. Stock actual: ${availableKeysCount}`,
        };
      }
    }

    // 2. Perform Transaction: Create Order, Items, and claim Keys
    const order = await db.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          customerEmail: email,
          customerName: name,
          total: total,
          status: "COMPLETED",
          userId: userId || null,
        },
      });

      let totalPointsEarned = 0;

      // Get global pointsPerDollar from config
      const config = await tx.siteConfig.findUnique({ where: { id: 'default' } });
      const pointsPerDollar = config?.pointsPerDollar || 10;

      // Create each order item and reserve keys
      for (const item of items) {
        // Fetch keys that are not sold
        const keysToReserve = await tx.key.findMany({
          where: {
            productId: item.productId,
            isSold: false,
          },
          take: item.quantity,
        });

        const itemPoints = Math.floor(item.price * pointsPerDollar) * item.quantity;
        totalPointsEarned += itemPoints;

        // Create the OrderItem
        const orderItem = await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            price: item.price,
            quantity: item.quantity,
          },
        });

        // Update the reserved keys to mark them as sold and link to the order item
        for (const key of keysToReserve) {
          await tx.key.update({
            where: { id: key.id },
            data: {
              isSold: true,
              orderItemId: orderItem.id,
            },
          });
        }
      }

      // Award points to user if logged in
      if (userId && totalPointsEarned > 0) {
        await tx.user.update({
          where: { id: userId },
          data: { points: { increment: totalPointsEarned } },
        });
        await tx.pointTransaction.create({
          data: {
            userId,
            orderId: newOrder.id,
            amount: totalPointsEarned,
            type: 'earned',
            note: `Points earned from order`,
          },
        });
      }

      return newOrder;
    });

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Error creating order:", error);
    return { success: false, error: error.message || "Ocurrió un error inesperado al procesar tu orden." };
  }
}

interface CreateProductInput {
  title: string;
  slug?: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  bannerImage?: string | null;
  platform: string;
  region: string;
  type: string;
  genre: string;
  isFeatured: boolean;
  isHot: boolean;
  isRecent: boolean;
  isPopular: boolean;
  keysText?: string;
}

export async function createProduct(input: CreateProductInput) {
  try {
    const { 
      title, 
      slug, 
      description, 
      price, 
      originalPrice, 
      image, 
      bannerImage, 
      platform, 
      region, 
      type, 
      genre, 
      isFeatured, 
      isHot,
      isRecent,
      isPopular,
      keysText 
    } = input;

    if (!title || !description || price <= 0 || !image || !platform || !region) {
      return { success: false, error: "Campos obligatorios incompletos o inválidos." };
    }

    const calculatedSlug = slug?.trim() || title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Check slug uniqueness
    const existing = await db.product.findUnique({
      where: { slug: calculatedSlug }
    });

    if (existing) {
      return { success: false, error: "Ya existe un producto con ese slug o título similar." };
    }

    // Parse keys
    const keysToInsert = keysText
      ? keysText.split('\n')
          .map(k => k.trim())
          .filter(k => k.length > 0)
      : [];

    await db.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          title,
          slug: calculatedSlug,
          description,
          price: Number(price),
          originalPrice: originalPrice ? Number(originalPrice) : null,
          image,
          bannerImage: bannerImage || null,
          platform,
          region,
          type,
          genre,
          isFeatured,
          isHot,
          isRecent,
          isPopular,
        }
      });

      if (keysToInsert.length > 0) {
        for (const code of keysToInsert) {
          await tx.key.create({
            data: {
              code,
              productId: product.id
            }
          });
        }
      }
    });

    return { success: true, slug: calculatedSlug };
  } catch (error: any) {
    console.error("Error creating product:", error);
    return { success: false, error: error.message || "Error al crear el producto." };
  }
}

export async function addKeysToProduct(productId: string, keysText: string) {
  try {
    if (!productId || !keysText.trim()) {
      return { success: false, error: "Por favor selecciona un producto e introduce códigos de clave válidos." };
    }

    const keyCodes = keysText
      .split('\n')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    if (keyCodes.length === 0) {
      return { success: false, error: "No se encontraron claves válidas." };
    }

    for (const code of keyCodes) {
      await db.key.create({
        data: {
          code,
          productId
        }
      });
    }

    return { success: true, count: keyCodes.length };
  } catch (error: any) {
    console.error("Error adding keys:", error);
    return { success: false, error: error.message || "Error al agregar las claves." };
  }
}

export async function updateProduct(id: string, data: {
  title: string;
  slug?: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  bannerImage?: string | null;
  platform: string;
  region: string;
  type: string;
  genre: string;
  isFeatured: boolean;
  isHot: boolean;
  isRecent: boolean;
  isPopular: boolean;
}) {
  try {
    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "Producto no encontrado." };

    const slugToUse = data.slug?.trim() || data.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const slugConflict = await db.product.findUnique({ where: { slug: slugToUse } });
    if (slugConflict && slugConflict.id !== id) {
      return { success: false, error: "Ya existe otro producto con ese slug." };
    }

    await db.product.update({
      where: { id },
      data: {
        title: data.title,
        slug: slugToUse,
        description: data.description,
        price: data.price,
        originalPrice: data.originalPrice ?? null,
        image: data.image,
        bannerImage: data.bannerImage ?? null,
        platform: data.platform,
        region: data.region,
        type: data.type,
        genre: data.genre,
        isFeatured: data.isFeatured,
        isHot: data.isHot,
        isRecent: data.isRecent,
        isPopular: data.isPopular,
      },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al actualizar producto." };
  }
}

export async function deleteProduct(id: string) {
  try {
    await db.product.delete({ where: { id } });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al eliminar producto." };
  }
}

export async function toggleProductField(id: string, field: 'isRecent' | 'isPopular' | 'isFeatured' | 'isHot' | 'isBestSeller' | 'isOnSale') {
  try {
    const product = await db.product.findUnique({ where: { id } });
    if (!product) return { success: false, error: "Producto no encontrado." };

    const newValue = !product[field];
    await db.product.update({ where: { id }, data: { [field]: newValue } });
    return { success: true, value: newValue };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al actualizar." };
  }
}

export async function deleteKey(id: string) {
  try {
    await db.key.delete({ where: { id } });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al eliminar clave." };
  }
}

export async function getAllOrders() {
  try {
    const orders = await db.order.findMany({
      include: {
        items: {
          include: {
            product: { select: { title: true, slug: true } },
            keys: { select: { code: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return { success: true, orders: orders.map(o => ({
      ...o,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
      items: o.items.map(item => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
    })) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCustomers() {
  try {
    const orders = await db.order.findMany({
      select: {
        customerEmail: true,
        customerName: true,
        total: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const customerMap = new Map<string, { name: string; email: string; totalSpent: number; orderCount: number; lastOrder: string }>();
    for (const o of orders) {
      const existing = customerMap.get(o.customerEmail);
      if (existing) {
        existing.totalSpent += o.total;
        existing.orderCount += 1;
        if (o.createdAt > new Date(existing.lastOrder)) {
          existing.lastOrder = o.createdAt.toISOString();
        }
      } else {
        customerMap.set(o.customerEmail, {
          name: o.customerName,
          email: o.customerEmail,
          totalSpent: o.total,
          orderCount: 1,
          lastOrder: o.createdAt.toISOString(),
        });
      }
    }

    return { success: true, customers: Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllKeys() {
  try {
    const keys = await db.key.findMany({
      include: {
        product: { select: { title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return { success: true, keys: keys.map(k => ({
      ...k,
      createdAt: k.createdAt.toISOString(),
      updatedAt: k.updatedAt.toISOString(),
    })) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ─── ADMIN AUTH ─────────────────────────────────────────────

export async function adminLogin(username: string, password: string) {
  try {
    const admin = await db.admin.findUnique({ where: { username } });
    if (!admin) return { success: false, error: 'Credenciales inválidas.' };

    const { hashPassword, verifyPassword } = await import('@/lib/auth');
    if (!verifyPassword(password, admin.passwordHash, admin.salt)) {
      return { success: false, error: 'Credenciales inválidas.' };
    }

    const { generateToken } = await import('@/lib/auth');
    const token = generateToken();

    await db.session.create({
      data: { token, userId: admin.id, userType: 'admin' },
    });

    return { success: true, token };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al iniciar sesión.' };
  }
}

export async function adminVerify(token: string) {
  try {
    const session = await db.session.findUnique({ where: { token } });
    if (!session || session.userType !== 'admin') {
      return { success: false };
    }

    const admin = await db.admin.findUnique({
      where: { id: session.userId },
      select: { id: true, username: true },
    });

    if (!admin) return { success: false };

    return { success: true, admin };
  } catch {
    return { success: false };
  }
}

export async function adminLogout(token: string) {
  try {
    await db.session.deleteMany({ where: { token } });
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function adminRegister(username: string, password: string) {
  try {
    const existing = await db.admin.findUnique({ where: { username } });
    if (existing) return { success: false, error: 'El administrador ya existe.' };

    const { hashPassword } = await import('@/lib/auth');
    const { hash, salt } = hashPassword(password);

    await db.admin.create({
      data: { username, passwordHash: hash, salt },
    });

    return { success: true, message: `Admin "${username}" creado.` };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al crear admin.' };
  }
}

export async function getPlatforms() {
  try {
    const platforms = await db.platform.findMany({ orderBy: { name: 'asc' } });
    return { success: true, platforms };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createPlatform(data: { name: string; icon: string; color: string; bgColor: string }) {
  try {
    const existing = await db.platform.findUnique({ where: { name: data.name } });
    if (existing) return { success: false, error: 'La plataforma ya existe.' };
    const platform = await db.platform.create({ data });
    return { success: true, platform };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePlatform(id: string, data: { name?: string; icon?: string; color?: string; bgColor?: string }) {
  try {
    const platform = await db.platform.update({ where: { id }, data });
    return { success: true, platform };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePlatform(id: string) {
  try {
    await db.platform.delete({ where: { id } });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getBadges() {
  try {
    const badges = await db.badge.findMany({ orderBy: { name: 'asc' } });
    return { success: true, badges };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createBadge(data: { name: string; icon: string; color: string; bgColor: string; borderColor: string }) {
  try {
    const existing = await db.badge.findUnique({ where: { name: data.name } });
    if (existing) return { success: false, error: 'El badge ya existe.' };
    const badge = await db.badge.create({ data });
    return { success: true, badge };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateBadge(id: string, data: { name?: string; icon?: string; color?: string; bgColor?: string; borderColor?: string }) {
  try {
    const badge = await db.badge.update({ where: { id }, data });
    return { success: true, badge };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteBadge(id: string) {
  try {
    await db.badge.delete({ where: { id } });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addBadgeToProduct(productId: string, badgeId: string) {
  try {
    await db.product.update({
      where: { id: productId },
      data: { badges: { connect: { id: badgeId } } },
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function removeBadgeFromProduct(productId: string, badgeId: string) {
  try {
    await db.product.update({
      where: { id: productId },
      data: { badges: { disconnect: { id: badgeId } } },
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserPoints(userId: string) {
  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false, error: 'Usuario no encontrado.' };
    const txns = await db.pointTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return { success: true, points: user.points, transactions: txns };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function earnPoints(userId: string, orderId: string, points: number, note?: string) {
  try {
    await db.$transaction([
      db.user.update({ where: { id: userId }, data: { points: { increment: points } } }),
      db.pointTransaction.create({
        data: { userId, orderId, amount: points, type: 'earned', note: note || `Points earned from order` },
      }),
    ]);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function redeemPoints(userId: string, couponCode: string) {
  try {
    const coupon = await db.coupon.findUnique({ where: { code: couponCode } });
    if (!coupon) return { success: false, error: 'Cupón no válido.' };
    if (coupon.isRedeemed) return { success: false, error: 'Este cupón ya fue canjeado.' };
    if (coupon.userId && coupon.userId !== userId) return { success: false, error: 'Este cupón no te pertenece.' };
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return { success: false, error: 'Este cupón ha expirado.' };

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false, error: 'Usuario no encontrado.' };
    if (user.points < coupon.minPoints) return { success: false, error: `Necesitas al menos ${coupon.minPoints} puntos para canjear.` };

    await db.$transaction([
      db.user.update({ where: { id: userId }, data: { points: { decrement: coupon.minPoints } } }),
      db.coupon.update({ where: { id: coupon.id }, data: { isRedeemed: true, userId } }),
      db.pointTransaction.create({
        data: { userId, amount: -coupon.minPoints, type: 'redeemed', note: `Redeemed for coupon ${couponCode}` },
      }),
    ]);
    return { success: true, coupon };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createCoupon(data: { code: string; discountType: string; discountValue: number; minPoints: number; expiresAt?: string }) {
  try {
    const existing = await db.coupon.findUnique({ where: { code: data.code } });
    if (existing) return { success: false, error: 'El código ya existe.' };
    const coupon = await db.coupon.create({
      data: {
        code: data.code,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minPoints: data.minPoints,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });
    return { success: true, coupon };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCoupons() {
  try {
    const coupons = await db.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    return { success: true, coupons };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCoupon(id: string) {
  try {
    await db.coupon.delete({ where: { id } });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
