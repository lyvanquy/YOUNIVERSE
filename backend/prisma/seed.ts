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
    description: "Astra helps you own your unique name and ignite your inner flame.",
    price: 129000,
    status: ProductStatus.ACTIVE,
    stock: 50,
    lowStockThreshold: 5,
    imageUrl: "/images/placeholders/charm-astra.jpg",
  },
  {
    name: "Charm Sirius",
    slug: "charm-sirius",
    productLine: ProductLine.SIRIUS,
    badge: "Passion",
    shortDescription:
      "Encapsulate the little things you love, from simple everyday passions and sweet pets to your daily rituals.",
    description: "Sirius packs the joy you seek and lets your passion speak.",
    price: 129000,
    status: ProductStatus.ACTIVE,
    stock: 50,
    lowStockThreshold: 5,
    imageUrl: "/images/placeholders/charm-sirius.jpg",
  },
  {
    name: "Charm Polaris",
    slug: "charm-polaris",
    productLine: ProductLine.POLARIS,
    badge: "Inspiring",
    shortDescription: "Inspiring quotes that serve as a guiding compass for your soul.",
    description: "Polaris helps you trust the guiding quote and let your spirit float.",
    price: 129000,
    status: ProductStatus.ACTIVE,
    stock: 50,
    lowStockThreshold: 5,
    imageUrl: "/images/placeholders/charm-polaris.jpg",
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
  const passwordHash = await bcrypt.hash("Admin123456", SALT_ROUNDS);

  await prisma.user.upsert({
    where: {
      email: "admin@youniverse.local",
    },
    create: {
      fullName: "YOUniverse Admin",
      email: "admin@youniverse.local",
      passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    },
    update: {
      fullName: "YOUniverse Admin",
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

const main = async () => {
  await seedAdmin();
  await seedCategories();
  await seedProducts();
  await seedCoupons();

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
