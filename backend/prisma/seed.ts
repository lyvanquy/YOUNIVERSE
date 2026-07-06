import bcrypt from "bcrypt";
import {
  CouponType,
  PrismaClient,
  ProductLine,
  ProductStatus,
  UserRole,
  UserStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

const categories = [
  {
    name: "Charms",
    slug: "charms",
  },
  {
    name: "Personalized Accessories",
    slug: "personalized-accessories",
  },
] as const;

const products = [
  {
    name: "Charm Astra",
    slug: "charm-astra",
    productLine: ProductLine.ASTRA,
    badge: "Unique",
    shortDescription:
      "A bold statement of identity, customized with your name, celestial symbols, and your unique elemental energy.",
    description:
      "A personalized visual signature or initial charm set in a unique cosmic crystal lattice, carrying the confident, distinct energy of your celestial sign.",
    price: 129000,
    status: ProductStatus.ACTIVE,
    stock: 50,
    lowStockThreshold: 5,
    imageUrl: "/images/product-astra.jpg",
  },
  {
    name: "Charm Sirius",
    slug: "charm-sirius",
    productLine: ProductLine.SIRIUS,
    badge: "Passion",
    shortDescription:
      "Encapsulate the little things you love, from simple everyday passions and sweet pets to your daily rituals.",
    description:
      "A lucky charm representing the tiny joys of daily routine, loyal companions, or beloved habits that ignite vibrant emotions and bright passion.",
    price: 119000,
    status: ProductStatus.ACTIVE,
    stock: 50,
    lowStockThreshold: 5,
    imageUrl: "/images/product-sirius.jpg",
  },
  {
    name: "Charm Polaris",
    slug: "charm-polaris",
    productLine: ProductLine.POLARIS,
    badge: "Inspiring",
    shortDescription: "Inspiring quotes that serve as a guiding compass for your soul.",
    description:
      "An engraving of inspiring mantras, acting as a guiding compass for your soul to support your identity across the infinite cosmos.",
    price: 139000,
    status: ProductStatus.ACTIVE,
    stock: 50,
    lowStockThreshold: 5,
    imageUrl: "/images/product-polaris.jpg",
  },
] as const;

const coupons = [
  {
    code: "WELCOME10",
    name: "Welcome 10%",
    type: CouponType.PERCENTAGE,
    value: 10,
    minOrderAmount: 100000,
    maxDiscountAmount: 50000,
    usageLimit: 100,
    usagePerUser: 1,
    isActive: true,
  },
  {
    code: "YOU30K",
    name: "Giảm 30K",
    type: CouponType.FIXED_AMOUNT,
    value: 30000,
    minOrderAmount: 200000,
    maxDiscountAmount: null,
    usageLimit: 100,
    usagePerUser: 2,
    isActive: true,
  },
] as const;

const seedAdmin = async () => {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email && !password) {
    console.info("[seed] Admin credentials not provided; skipping admin creation.");
    return;
  }

  if (!email || !password || password.length < 8) {
    throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD (minimum 8 characters) are both required");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  await prisma.user.upsert({
    where: {
      email,
    },
    create: {
      fullName: "YOUniverse Admin",
      email,
      passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    },
    update: {
      fullName: "YOUniverse Admin",
      passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });
};

const seedCategories = async () => {
  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      create: category,
      update: {
        name: category.name,
        isActive: true,
      },
    });
  }
};

const seedProducts = async () => {
  const charmsCategory = await prisma.category.findUniqueOrThrow({
    where: {
      slug: "charms",
    },
  });

  for (const product of products) {
    const savedProduct = await prisma.product.upsert({
      where: {
        slug: product.slug,
      },
      create: {
        categoryId: charmsCategory.id,
        name: product.name,
        slug: product.slug,
        productLine: product.productLine,
        badge: product.badge,
        shortDescription: product.shortDescription,
        description: product.description,
        price: product.price,
        status: product.status,
        isFeatured: true,
        allowCustomize: true,
      },
      update: {
        categoryId: charmsCategory.id,
        name: product.name,
        productLine: product.productLine,
        badge: product.badge,
        shortDescription: product.shortDescription,
        description: product.description,
        price: product.price,
        status: product.status,
        isFeatured: true,
        allowCustomize: true,
      },
    });

    await prisma.inventory.upsert({
      where: {
        productId: savedProduct.id,
      },
      create: {
        productId: savedProduct.id,
        quantity: product.stock,
        lowStockThreshold: product.lowStockThreshold,
      },
      update: {
        lowStockThreshold: product.lowStockThreshold,
      },
    });

    const primaryImage = await prisma.productImage.findFirst({
      where: {
        productId: savedProduct.id,
        isPrimary: true,
      },
    });

    if (primaryImage) {
      await prisma.productImage.update({
        where: {
          id: primaryImage.id,
        },
        data: {
          url: product.imageUrl,
          alt: product.name,
          sortOrder: 0,
          isPrimary: true,
        },
      });
    } else {
      await prisma.productImage.create({
        data: {
          productId: savedProduct.id,
          url: product.imageUrl,
          alt: product.name,
          sortOrder: 0,
          isPrimary: true,
        },
      });
    }
  }
};

const seedCoupons = async () => {
  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: {
        code: coupon.code,
      },
      create: coupon,
      update: {
        name: coupon.name,
        type: coupon.type,
        value: coupon.value,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscountAmount: coupon.maxDiscountAmount,
        usageLimit: coupon.usageLimit,
        usagePerUser: coupon.usagePerUser,
        isActive: coupon.isActive,
      },
    });
  }
};

const allVariants = [
  // ── Charm Astra (3 hệ) ──
  {
    productSlug: "charm-astra",
    sku: "ASTRA-SUN",
    name: "Hệ Mặt Trời (The Sun)",
    stock: 30,
    imageUrl: "/images/astra-mat-troi.jpg",
    imageAlt: "Charm Astra Hệ Mặt Trời",
    description: "Năng lượng rực rỡ, tỏa sáng như mặt trời — biểu tượng của sức mạnh và niềm tin.",
    group: null,
    groupEmoji: null,
    sortOrder: 0,
  },
  {
    productSlug: "charm-astra",
    sku: "ASTRA-MOON",
    name: "Hệ Mặt Trăng (The Moon)",
    stock: 30,
    imageUrl: "/images/astra-mat-trang.jpg",
    imageAlt: "Charm Astra Hệ Mặt Trăng",
    description: "Dịu dàng mà sâu lắng, ánh trăng dẫn lối qua những đêm tĩnh lặng nhất.",
    group: null,
    groupEmoji: null,
    sortOrder: 1,
  },
  {
    productSlug: "charm-astra",
    sku: "ASTRA-STAR",
    name: "Hệ Tinh Tú (The Star)",
    stock: 30,
    imageUrl: "/images/astra-tinh-tu.jpg",
    imageAlt: "Charm Astra Hệ Tinh Tú",
    description: "Vô vàn ngôi sao, mỗi ánh sáng là một giấc mơ đang chờ bạn chạm tới.",
    group: null,
    groupEmoji: null,
    sortOrder: 2,
  },
  // ── Charm Sirius — Nhóm Pet ──
  {
    productSlug: "charm-sirius",
    sku: "SIRIUS-DOG",
    name: "Chó",
    stock: 30,
    imageUrl: "/images/sirius-cho.jpg",
    imageAlt: "Charm Sirius Chó",
    description: null,
    group: "Những người bạn 4 chân",
    groupEmoji: "🐾",
    sortOrder: 0,
  },
  {
    productSlug: "charm-sirius",
    sku: "SIRIUS-CAT",
    name: "Mèo",
    stock: 30,
    imageUrl: "/images/sirius-meo.jpg",
    imageAlt: "Charm Sirius Mèo",
    description: null,
    group: "Những người bạn 4 chân",
    groupEmoji: "🐾",
    sortOrder: 1,
  },
  {
    productSlug: "charm-sirius",
    sku: "SIRIUS-HAMSTER",
    name: "Hamster",
    stock: 30,
    imageUrl: "/images/sirius-hamster.jpg",
    imageAlt: "Charm Sirius Hamster",
    description: null,
    group: "Những người bạn 4 chân",
    groupEmoji: "🐾",
    sortOrder: 2,
  },
  // ── Charm Sirius — Nhóm Drink ──
  {
    productSlug: "charm-sirius",
    sku: "SIRIUS-BOBA",
    name: "Trà Sữa",
    stock: 30,
    imageUrl: "/images/sirius-tra-sua.jpg",
    imageAlt: "Charm Sirius Trà Sữa",
    description: null,
    group: "Năng lượng ngọt ngào",
    groupEmoji: "☕",
    sortOrder: 3,
  },
  {
    productSlug: "charm-sirius",
    sku: "SIRIUS-MATCHA",
    name: "Matcha Latte",
    stock: 30,
    imageUrl: "/images/sirius-matcha.jpg",
    imageAlt: "Charm Sirius Matcha Latte",
    description: null,
    group: "Năng lượng ngọt ngào",
    groupEmoji: "☕",
    sortOrder: 4,
  },
  {
    productSlug: "charm-sirius",
    sku: "SIRIUS-COFFEE",
    name: "Cà Phê",
    stock: 30,
    imageUrl: "/images/sirius-ca-phe.jpg",
    imageAlt: "Charm Sirius Cà Phê",
    description: null,
    group: "Năng lượng ngọt ngào",
    groupEmoji: "☕",
    sortOrder: 5,
  },
] as const;

const productSortOrders: Record<string, number> = {
  "charm-astra": 0,
  "charm-sirius": 1,
  "charm-polaris": 2,
};

const seedAllVariants = async () => {
  // Set sortOrder for products
  for (const [slug, sortOrder] of Object.entries(productSortOrders)) {
    await prisma.product.updateMany({
      where: { slug },
      data: { sortOrder },
    });
  }

  // Upsert all variants
  for (const variant of allVariants) {
    const product = await prisma.product.findUnique({
      where: { slug: variant.productSlug },
    });

    if (!product) {
      console.warn(`[seed] Product ${variant.productSlug} not found, skipping variant ${variant.sku}.`);
      continue;
    }

    await prisma.productVariant.upsert({
      where: { sku: variant.sku },
      create: {
        productId: product.id,
        name: variant.name,
        sku: variant.sku,
        stock: variant.stock,
        isActive: true,
        imageUrl: variant.imageUrl,
        imageAlt: variant.imageAlt,
        description: variant.description,
        group: variant.group,
        groupEmoji: variant.groupEmoji,
        sortOrder: variant.sortOrder,
      },
      update: {
        name: variant.name,
        imageUrl: variant.imageUrl,
        imageAlt: variant.imageAlt,
        description: variant.description,
        group: variant.group,
        groupEmoji: variant.groupEmoji,
        sortOrder: variant.sortOrder,
      },
    });
  }
};

const main = async () => {
  await seedAdmin();
  await seedCategories();
  await seedProducts();
  await seedCoupons();
  await seedAllVariants();

  console.info("Database seed completed.");
};

main()
  .catch((error) => {
    console.error("Database seed failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

