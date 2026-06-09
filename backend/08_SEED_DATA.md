# Backend 08. Seed Data

## 1. Admin account

```json
{
  "fullName": "YOUniverse Admin",
  "email": "admin@youniverse.local",
  "password": "Admin123456",
  "role": "ADMIN"
}
```

## 2. Categories

```json
[
  {
    "name": "Charms",
    "slug": "charms"
  },
  {
    "name": "Personalized Accessories",
    "slug": "personalized-accessories"
  }
]
```

## 3. Products

### Charm Astra

```json
{
  "name": "Charm Astra",
  "slug": "charm-astra",
  "productLine": "ASTRA",
  "badge": "Unique",
  "shortDescription": "A bold statement of identity, customized with your name, celestial symbols, and your unique elemental energy.",
  "description": "Astra helps you own your unique name and ignite your inner flame.",
  "price": 129000,
  "status": "ACTIVE",
  "stock": 50,
  "lowStockThreshold": 5,
  "imageUrl": "/images/placeholders/charm-astra.jpg"
}
```

### Charm Sirius

```json
{
  "name": "Charm Sirius",
  "slug": "charm-sirius",
  "productLine": "SIRIUS",
  "badge": "Passion",
  "shortDescription": "Encapsulate the little things you love, from simple everyday passions and sweet pets to your daily rituals.",
  "description": "Sirius packs the joy you seek and lets your passion speak.",
  "price": 129000,
  "status": "ACTIVE",
  "stock": 50,
  "lowStockThreshold": 5,
  "imageUrl": "/images/placeholders/charm-sirius.jpg"
}
```

### Charm Polaris

```json
{
  "name": "Charm Polaris",
  "slug": "charm-polaris",
  "productLine": "POLARIS",
  "badge": "Inspiring",
  "shortDescription": "Inspiring quotes that serve as a guiding compass for your soul.",
  "description": "Polaris helps you trust the guiding quote and let your spirit float.",
  "price": 129000,
  "status": "ACTIVE",
  "stock": 50,
  "lowStockThreshold": 5,
  "imageUrl": "/images/placeholders/charm-polaris.jpg"
}
```

## 4. Coupons

```json
[
  {
    "code": "WELCOME10",
    "name": "Welcome 10%",
    "type": "PERCENTAGE",
    "value": 10,
    "minOrderAmount": 100000,
    "maxDiscountAmount": 50000,
    "usageLimit": 100,
    "usagePerUser": 1,
    "isActive": true
  },
  {
    "code": "YOU30K",
    "name": "Giảm 30K",
    "type": "FIXED_AMOUNT",
    "value": 30000,
    "minOrderAmount": 200000,
    "usageLimit": 100,
    "usagePerUser": 2,
    "isActive": true
  }
]
```
