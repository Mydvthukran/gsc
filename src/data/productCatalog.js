// Product catalog for OptiChain demo
const productCatalog = [
  {
    id: 'P001',
    name: 'Organic Milk (1L)',
    category: 'Dairy',
    unit: 'liters',
    reorderPoint: 50,
    maxStock: 300,
    currentStock: 78,
    unitCost: 2.5,
    shelfLife: 7,
    icon: 'Milk'
  },
  {
    id: 'P002',
    name: 'Whole Wheat Bread',
    category: 'Bakery',
    unit: 'loaves',
    reorderPoint: 40,
    maxStock: 200,
    currentStock: 145,
    unitCost: 3.0,
    shelfLife: 5,
    icon: 'Croissant'
  },
  {
    id: 'P003',
    name: 'Fresh Apples (1kg)',
    category: 'Produce',
    unit: 'kg',
    reorderPoint: 60,
    maxStock: 400,
    currentStock: 32,
    unitCost: 4.0,
    shelfLife: 14,
    icon: 'Apple'
  },
  {
    id: 'P004',
    name: 'Free-Range Eggs (12pk)',
    category: 'Dairy',
    unit: 'packs',
    reorderPoint: 30,
    maxStock: 150,
    currentStock: 112,
    unitCost: 5.5,
    shelfLife: 21,
    icon: 'Egg'
  },
  {
    id: 'P005',
    name: 'Basmati Rice (5kg)',
    category: 'Grains',
    unit: 'bags',
    reorderPoint: 25,
    maxStock: 200,
    currentStock: 180,
    unitCost: 8.0,
    shelfLife: 365,
    icon: 'Wheat'
  },
  {
    id: 'P006',
    name: 'Chicken Breast (1kg)',
    category: 'Meat',
    unit: 'kg',
    reorderPoint: 40,
    maxStock: 250,
    currentStock: 15,
    unitCost: 9.0,
    shelfLife: 3,
    icon: 'Drumstick'
  },
  {
    id: 'P007',
    name: 'Orange Juice (1L)',
    category: 'Beverages',
    unit: 'bottles',
    reorderPoint: 35,
    maxStock: 180,
    currentStock: 95,
    unitCost: 3.5,
    shelfLife: 10,
    icon: 'GlassWater'
  },
  {
    id: 'P008',
    name: 'Greek Yogurt (500g)',
    category: 'Dairy',
    unit: 'cups',
    reorderPoint: 45,
    maxStock: 220,
    currentStock: 210,
    unitCost: 4.5,
    shelfLife: 14,
    icon: 'Coffee'
  },
  {
    id: 'P009',
    name: 'Pasta Penne (500g)',
    category: 'Grains',
    unit: 'packs',
    reorderPoint: 20,
    maxStock: 300,
    currentStock: 65,
    unitCost: 2.0,
    shelfLife: 730,
    icon: 'UtensilsCrossed'
  },
  {
    id: 'P010',
    name: 'Tomato Sauce (400g)',
    category: 'Canned',
    unit: 'cans',
    reorderPoint: 30,
    maxStock: 250,
    currentStock: 88,
    unitCost: 2.5,
    shelfLife: 365,
    icon: 'Container'
  },
  {
    id: 'P011',
    name: 'Frozen Pizza',
    category: 'Frozen',
    unit: 'pcs',
    reorderPoint: 25,
    maxStock: 150,
    currentStock: 42,
    unitCost: 6.0,
    shelfLife: 90,
    icon: 'Pizza'
  },
  {
    id: 'P012',
    name: 'Mineral Water (6pk)',
    category: 'Beverages',
    unit: 'packs',
    reorderPoint: 50,
    maxStock: 400,
    currentStock: 320,
    unitCost: 3.0,
    shelfLife: 365,
    icon: 'Droplet'
  }
];

export default productCatalog;
