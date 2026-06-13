const fs = require('fs');

const sambalPrices = {
  "beef-sambal": { name: "Beef Sambal", emoji: "🥩", desc: "A dry, textured sambal featuring savory shredded beef pan-fried with caramelized onions and hot chili flakes.", prices: [380, 540, 1350, 2700, 4700] },
  "chicken-sambal": { name: "Chicken Sambal", emoji: "🐔", desc: "A rich, flavour-packed sambal made with tender chicken and our special chili blend.", prices: [350, 500, 1250, 2500, 4300] },
  "maldive-fish-sambal": { name: "Maldive Fish Sambal", emoji: "🐠", desc: "Traditional Sri Lankan Umbalakada Sambal. Thick, spicy onion-relish loaded with Maldive fish chips.", prices: [350, 500, 1250, 2500, 4300] },
  "kooni-sambal": { name: "Prawns Sambal", emoji: "🦐", desc: "Classic Sri Lankan Kooni Sambal. Sun-dried small shrimp toasted and ground with onions, red chili, and fresh lime.", prices: [350, 500, 1250, 2500, 4300] },
  "dry-fish-sambal": { name: "Dry Fish Sambal", emoji: "🐟", desc: "Made from premium dried tuna — crispy, salty, spicy, and tangy.", prices: [350, 500, 1250, 2500, 4300] },
  "banana-blossom-sambal": { name: "Banana Blossom Sambal", emoji: "🌸", desc: "A rare vegetarian-friendly delicacy. Finely shredded banana blossoms tempered with spices, curry leaves, and lime.", prices: [280, 400, 1000, 2000, 3300] } // NOTE: using 2000 for 500g instead of 1000
};

const sambalWeights = ["70g", "100g", "250g", "500g", "1kg"];

const picklePrices = {
  "beef-pickle": { name: "Beef Pickle", emoji: "🥩", desc: "Our homemade Beef Pickle is slow-cured with authentic Sri Lankan spices and vinegar.", prices: [700, 1350, 2700, 5400] },
  "chicken-pickle": { name: "Chicken Pickle", emoji: "🐔", desc: "Tangy, spicy, and packed with authentic Sri Lankan flavour — our homemade Chicken Pickle.", prices: [700, 1350, 2700, 5400] },
  "baabath-pickle": { name: "Baabath Pickle", emoji: "🥘", desc: "Traditional tripe pickle, intensely flavoured with local spices and vinegar.", prices: [700, 1350, 2700, 5400] },
  "prawns-pickle": { name: "Prawns Pickle", emoji: "🦐", desc: "Tangy and spice-kissed prawns pickle, handmade with the freshest local catch.", prices: [700, 1350, 2700, 5400] },
  "crab-pickle": { name: "Crab Pickle", emoji: "🦀", desc: "A rare and luxurious pickle made from fresh crab meat, slow-cooked in a spicy tamarind base.", prices: [650, 1250, 2500, 5000] },
  "fish-pickle": { name: "Fish Pickle", emoji: "🐟", desc: "Traditional Sri Lankan fish pickle made from fresh tuna cubes, cured with goraka and black pepper.", prices: [650, 1250, 2500, 5000] }
};

const pickleWeights = ["150g", "300g", "500g", "1kg"];

// Also keep existing ones: biriyani-combo-kit, ghee-rice-combo-kit, seenima (200g, 300g, 500g, 1kg), gift-packs

let allProducts = [];

// Adding Biriyani & Ghee Rice
allProducts.push({
    id: "biriyani-combo-kit",
    name: "Biriyani Combo Kit",
    slug: "biriyani-combo-kit",
    category: "biriyani-kit",
    price: 1400,
    weight: "500g",
    shelfLife: "3 months",
    ingredients: "Basmati rice spice blend, dried herbs, whole spices (cinnamon, cardamom, cloves), natural salt",
    description: "Our signature Biriyani Combo Kit brings the authentic flavour of Sri Lankan biriyani to your home. Packed with hand-selected whole spices and a carefully blended masala, this kit makes cooking perfect biriyani effortless. Simply follow our included recipe card for restaurant-quality results every time.",
    emoji: "🍛",
    badge: "Best Seller",
    rating: 4.9,
    reviews: 120,
    customizable: false
});

allProducts.push({
    id: "ghee-rice-combo-kit",
    name: "Ghee Rice Combo Kit",
    slug: "ghee-rice-combo-kit",
    category: "ghee-rice-combo-kit",
    price: 1350,
    weight: "500g",
    shelfLife: "3 months",
    ingredients: "Premium short-grain rice, pure ghee, cardamom, cloves, bay leaves, roasted cashews, raisins",
    description: "Indulge in the aromatic goodness of traditional Ghee Rice. This kit provides everything you need to prepare fluffy, flavorful ghee rice, loaded with the richest spices, pure cow ghee, and a crunchy topping of cashews and raisins.",
    emoji: "🍚",
    badge: "Best Seller",
    rating: 4.8,
    reviews: 87,
    customizable: false
});

// Adding Seenima
const seenimaPrices = { "200g": 380, "300g": 500, "500g": 880, "1kg": 1760 };
for (const [w, p] of Object.entries(seenimaPrices)) {
  allProducts.push({
    id: `seenima-${w}`,
    name: `Seenima ${w}`,
    slug: `seenima-${w}`,
    category: "seenima",
    price: p,
    weight: w,
    shelfLife: "6 months",
    ingredients: "Seenima leaves, cardamom, cloves, onions, chili flakes, sugar, salt, oil",
    description: "A sweet and spicy onion relish caramelized to perfection with Sri Lankan spices. Rich, fragrant, and highly versatile.",
    emoji: "🫙",
    badge: null,
    rating: 4.6,
    reviews: 38,
    customizable: true
  });
}

// Generate Pickles
for (const [key, details] of Object.entries(picklePrices)) {
  for (let i = 0; i < pickleWeights.length; i++) {
    const w = pickleWeights[i];
    const price = details.prices[i];
    allProducts.push({
      id: `${key}-${w}`,
      name: `${details.name} ${w}`,
      slug: `${key}-${w}`,
      category: `pickles-${w}`,
      price: price,
      weight: w,
      shelfLife: "6 months",
      ingredients: "Secret spices, vinegar, oil", // simplified
      description: details.desc,
      emoji: details.emoji,
      badge: i === 0 ? "Popular" : null,
      rating: 4.8,
      reviews: 50,
      customizable: true
    });
  }
}

// Generate Sambals
for (const [key, details] of Object.entries(sambalPrices)) {
  for (let i = 0; i < sambalWeights.length; i++) {
    const w = sambalWeights[i];
    const price = details.prices[i];
    allProducts.push({
      id: `${key}-${w}`,
      name: `${details.name} ${w}`,
      slug: `${key}-${w}`,
      category: `sambal-${w}`,
      price: price,
      weight: w,
      shelfLife: "4 months",
      ingredients: "Onion, chili, spices, oil", // simplified
      description: details.desc,
      emoji: details.emoji,
      badge: null,
      rating: 4.7,
      reviews: 60,
      customizable: true
    });
  }
}

// Generate Gift Packs
allProducts.push({
    id: "gift-pack-small",
    name: "Gift Pack — Small",
    slug: "gift-pack-small",
    category: "gift-packs",
    price: 2500,
    weight: "800g",
    shelfLife: "3 months",
    ingredients: "Assortment of selected pickles and sambals in a premium decorated gift box",
    description: "A beautiful mini-gift box containing an assortment of our best-selling pickles and sambals in smaller 100g jars. Ideal for gifting loved ones.",
    emoji: "🎁",
    badge: "Popular",
    rating: 4.9,
    reviews: 67,
    customizable: false
  });
  
allProducts.push({
  id: "gift-pack-large",
  name: "Gift Pack — Large",
  slug: "gift-pack-large",
  category: "gift-packs",
  price: 4500,
  weight: "1.8kg",
  shelfLife: "3 months",
  ingredients: "Full size Biriyani Combo Kit, plus three full-size jars (Pickle, Sambal, Seenima) in a premium custom-decorated gift box",
  description: "Our ultimate signature gift box. Contains a full-size Biriyani Combo Kit, a jar of Chicken Pickle, a jar of Maldive Fish Sambal, and a jar of Seenima. Packed beautifully in a custom-designed Fathima's Foods gift chest.",
  emoji: "🎀",
  badge: "Popular",
  rating: 5.0,
  reviews: 42,
  customizable: false
});

const mockDataContent = `export interface Category {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  color: string;
  subCategories?: Category[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  weight: string;
  shelfLife: string;
  ingredients: string;
  description: string;
  emoji: string;
  badge: string | null;
  rating: number;
  reviews: number;
  customizable: boolean;
  images?: string[];
}

export const categories: Category[] = [
  { id: "biriyani-kit", name: "Biriyani Kit", slug: "biriyani-kit", emoji: "🍛", color: "bg-amber-100" },
  { id: "ghee-rice-combo-kit", name: "Ghee Rice", slug: "ghee-rice-combo-kit", emoji: "🍚", color: "bg-yellow-100" },
  { 
    id: "pickles", name: "Pickles", slug: "pickles", emoji: "🥒", color: "bg-green-100",
    subCategories: [
      { id: "pickles-150g", name: "150g", slug: "pickles-150g", emoji: "🥒", color: "bg-green-50" },
      { id: "pickles-300g", name: "300g", slug: "pickles-300g", emoji: "🥒", color: "bg-green-50" },
      { id: "pickles-500g", name: "500g", slug: "pickles-500g", emoji: "🥒", color: "bg-green-50" },
      { id: "pickles-1kg", name: "1kg", slug: "pickles-1kg", emoji: "🥒", color: "bg-green-50" },
    ]
  },
  { id: "seenima", name: "Seenima", slug: "seenima", emoji: "🫙", color: "bg-orange-100" },
  { 
    id: "sambals", name: "Sambals", slug: "sambals", emoji: "🌶️", color: "bg-red-100",
    subCategories: [
      { id: "sambal-70g", name: "Sambal 70g", slug: "sambal-70g", emoji: "🌶️", color: "bg-red-50" },
      { id: "sambal-100g", name: "Sambal 100g", slug: "sambal-100g", emoji: "🌶️", color: "bg-red-50" },
      { id: "sambal-250g", name: "Sambal 250g", slug: "sambal-250g", emoji: "🌶️", color: "bg-red-50" },
      { id: "sambal-500g", name: "Sambal 500g", slug: "sambal-500g", emoji: "🌶️", color: "bg-red-50" },
      { id: "sambal-1kg", name: "Sambal 1kg", slug: "sambal-1kg", emoji: "🌶️", color: "bg-red-50" },
    ]
  },
  { id: "food-truck-list", name: "Food Truck List", slug: "food-truck-list", emoji: "🚚", color: "bg-indigo-100" },
  { id: "custom-orders", name: "Custom Orders", slug: "custom-orders", emoji: "✨", color: "bg-teal-100" },
  { id: "gift-packs", name: "Gift Packs", slug: "gift-packs", emoji: "🎁", color: "bg-purple-100" },
];

export const products: Product[] = ${JSON.stringify(allProducts, null, 2)};
`;

fs.writeFileSync('src/lib/mockData.ts', mockDataContent);
console.log("mockData.ts generated");

const seedRouteContent = `import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const categories = [
  { id: "biriyani-kit", name: "Biriyani Kit", slug: "biriyani-kit", emoji: "🍛", color: "bg-amber-100" },
  { id: "ghee-rice-combo-kit", name: "Ghee Rice", slug: "ghee-rice-combo-kit", emoji: "🍚", color: "bg-yellow-100" },
  { 
    id: "pickles", name: "Pickles", slug: "pickles", emoji: "🥒", color: "bg-green-100",
    subCategories: [
      { id: "pickles-150g", name: "150g", slug: "pickles-150g", emoji: "🥒", color: "bg-green-50" },
      { id: "pickles-300g", name: "300g", slug: "pickles-300g", emoji: "🥒", color: "bg-green-50" },
      { id: "pickles-500g", name: "500g", slug: "pickles-500g", emoji: "🥒", color: "bg-green-50" },
      { id: "pickles-1kg", name: "1kg", slug: "pickles-1kg", emoji: "🥒", color: "bg-green-50" },
    ]
  },
  { id: "seenima", name: "Seenima", slug: "seenima", emoji: "🫙", color: "bg-orange-100" },
  { 
    id: "sambals", name: "Sambals", slug: "sambals", emoji: "🌶️", color: "bg-red-100",
    subCategories: [
      { id: "sambal-70g", name: "Sambal 70g", slug: "sambal-70g", emoji: "🌶️", color: "bg-red-50" },
      { id: "sambal-100g", name: "Sambal 100g", slug: "sambal-100g", emoji: "🌶️", color: "bg-red-50" },
      { id: "sambal-250g", name: "Sambal 250g", slug: "sambal-250g", emoji: "🌶️", color: "bg-red-50" },
      { id: "sambal-500g", name: "Sambal 500g", slug: "sambal-500g", emoji: "🌶️", color: "bg-red-50" },
      { id: "sambal-1kg", name: "Sambal 1kg", slug: "sambal-1kg", emoji: "🌶️", color: "bg-red-50" },
    ]
  },
  { id: "food-truck-list", name: "Food Truck List", slug: "food-truck-list", emoji: "🚚", color: "bg-indigo-100" },
  { id: "custom-orders", name: "Custom Orders", slug: "custom-orders", emoji: "✨", color: "bg-teal-100" },
  { id: "gift-packs", name: "Gift Packs", slug: "gift-packs", emoji: "🎁", color: "bg-purple-100" }
];

const products = ${JSON.stringify(allProducts, null, 2)};

export async function GET() {
  try {
    const batch = adminDb.batch();

    // WIPE ALL EXISTING PRODUCTS SO WE DON'T HAVE ORPHANS
    const existingProducts = await adminDb.collection("products").get();
    for (const doc of existingProducts.docs) {
      batch.delete(doc.ref);
    }
    
    // WIPE CATEGORIES
    const existingCategories = await adminDb.collection("categories").get();
    for (const doc of existingCategories.docs) {
      batch.delete(doc.ref);
    }

    // Seed Categories
    for (const cat of categories) {
      const docRef = adminDb.collection("categories").doc(cat.id);
      batch.set(docRef, cat);
    }

    // Seed Products
    for (const prod of products) {
      const docRef = adminDb.collection("products").doc(prod.id);
      batch.set(docRef, {
        ...prod,
        stock_count: 50,
        availability: "in_stock",
        created_at: FieldValue.serverTimestamp(),
        updated_at: FieldValue.serverTimestamp(),
        deleted_at: null,
      });
    }

    await batch.commit();

    return NextResponse.json({ message: "Database seeded successfully!" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
`;

fs.writeFileSync('src/app/api/seed/route.ts', seedRouteContent);
console.log("seed/route.ts generated");
