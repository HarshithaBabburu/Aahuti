export interface FoodCategoryMeta {
  id: string;
  name: string;
  tagline: string;
  image: string;
  iconName: string;
}

export const FOOD_CATEGORIES: FoodCategoryMeta[] = [
  {
    id: "Cooked Meals",
    name: "Surplus Cooked Meals",
    tagline: "Large pots & containers of freshly prepared dal, rice, pulao, and rotis",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80", // Simple pot of dal and steamed rice
    iconName: "Utensils",
  },
  {
    id: "Hostel Food",
    name: "Hostel & Mess Surplus",
    tagline: "Stainless-steel trays of dal, rotis, rice & canteen meal batches",
    image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80", // Stainless-steel compartment thali
    iconName: "Building",
  },
  {
    id: "Bakery & Breads",
    name: "Bakery & Fresh Pav Buns",
    tagline: "Crates of fresh bakery pav, buns & surplus multigrain loaves",
    image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80", // Crate of fresh bakery pav buns
    iconName: "Wheat",
  },
  {
    id: "Event Catering",
    name: "Surplus Catering Food",
    tagline: "Simple vegetarian catering trays containing freshly cooked Indian meals",
    image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80", // Simple vegetarian thali and catering trays
    iconName: "PartyPopper",
  },
  {
    id: "Fresh Produce",
    name: "Farm & Market Produce",
    tagline: "Crates of crisp spinach, tomatoes, gourds & seasonal vegetables",
    image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80", // Crates of farm-fresh Indian vegetables
    iconName: "Apple",
  },
  {
    id: "Dairy & Packaged",
    name: "Dairy & Packaged Foods",
    tagline: "Bulk paneer blocks, curd cans & sealed pantry provisions",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80", // Bulk dairy containers & milk cans
    iconName: "Package",
  },
  {
    id: "Desserts & Beverages",
    name: "Desserts & Refreshments",
    tagline: "Trays of sweet fruit custard, traditional sweets & clean beverages",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80", // Sweet dessert trays
    iconName: "Coffee",
  }
];

/**
 * Authentic, simple, 100% vegetarian Indian surplus food photography.
 * Focuses on simple, home-style & canteen meals: dal tadka, steamed rice,
 * tawa rotis, simple sabzi, steamed idlis, and stainless-steel thalis.
 */
const SURPLUS_INDIAN_PHOTOS = {
  // 1. Dal Rice / Dal Chawal / Rice & Sambar (simple steamed rice, yellow dal tadka, and sambar)
  dalRice: [
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80", // Simple steamed rice with yellow dal tadka
    "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80", // Simple bowl of rice with curd & dal
    "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80", // Dal in pan with herbs
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80", // Simple steamed cumin jeera basmati rice
  ],

  // 2. Roti and Sabzi (simple round tawa rotis and fresh vegetable sabzi)
  rotiSabzi: [
    "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80", // Simple tawa rotis & vegetable sabzi on plate
    "https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=800&q=80", // Fresh chapatis and vegetable curry
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80", // Simple chickpea chole with flatbread
  ],

  // 3. Veg Pulao / Veg Rice (simple vegetable pulao with green peas and carrots)
  vegPulao: [
    "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=800&q=80", // Simple vegetable pulao with peas and carrots
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80", // Steamed cumin jeera basmati rice
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80", // Simple steamed rice with dal
  ],

  // 4. Veg Dum Biryani / Simple Saffron Rice (100% vegetarian peas & vegetable rice)
  bulkBiryani: [
    "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=800&q=80", // Vegetable pulao / veg biryani with peas and carrots
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80", // Steamed basmati cumin rice
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80", // Simple yellow dal and steamed rice
  ],

  // 5. Idli & South Indian Breakfast (batch of soft steamed idlis, sambar, coconut chutney)
  idliBreakfast: [
    "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80", // Soft steamed idlis with sambar & coconut chutney
    "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=800&q=80", // Plate of soft freshly steamed idlis
    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80", // Plain dosas with coconut chutney
  ],

  // 6. Simple Packed Meals & Thali (stainless steel thalis and simple meal portions)
  packedMeals: [
    "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80", // Simple vegetarian thali in stainless-steel plate
    "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80", // Simple home-style thali with rotis, dal, and sabzi
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80", // Simple dal rice meal
  ],

  // 7. Surplus Catering Food (simple vegetarian catering trays)
  surplusCatering: [
    "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80", // Simple vegetarian thali meal
    "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80", // Simple kitchen meal with rotis and dal
    "https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=800&q=80", // Fresh chapatis and vegetable curry
  ],

  // 8. Hostel & College Mess Meals (simple stainless-steel thalis with dal, rice, sabzi, roti)
  hostelMess: [
    "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80", // Stainless-steel compartment thali meal (dal, rice, sabzi, roti)
    "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80", // Mess kitchen meal platter with rotis and dal
  ],

  // 9. North Indian Vegetarian Curries (simple paneer & chole curry)
  bulkCurry: [
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80", // Simple vegetarian paneer sabzi
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80", // Simple chickpea chole curry
  ],

  // 10. Simple Snacks & Breakfast (Samosa, Poha batches)
  snacksBatch: [
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80", // Simple vegetarian potato-pea samosas
    "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80", // Simple Indian vegetarian breakfast snacks
  ],

  // 11. Bakery, Pav & Breads (fresh bakery pav buns and simple loaves)
  bakeryPav: [
    "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80", // Fresh bakery pav buns
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80", // Simple multigrain bread loaves
  ],

  // 12. Farm & Market Produce (fresh simple vegetables from kitchens/markets)
  freshProduce: [
    "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80", // Fresh farm tomatoes, spinach & gourds
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80", // Fresh green vegetables
  ],

  // 13. Dairy & Desserts (milk cans, simple fruit custard)
  dairyDessert: [
    "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80", // Simple fruit dessert
    "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80", // Bulk dairy containers & milk cans
  ],
};

/**
 * Deterministically picks a distinct variant when multiple listings match the same food type,
 * ensuring no two cards display the exact same photograph.
 */
function pickDistinct(list: string[], seed?: string): string {
  if (!list || list.length === 0) {
    return SURPLUS_INDIAN_PHOTOS.hostelMess[0];
  }
  if (!seed) return list[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % list.length;
  return list[idx];
}

/**
 * Maps a surplus food donation listing to a realistic, practical Indian surplus food photo.
 * Prioritizes bulk food containers, stainless-steel trays, packed meal boxes, and canteen batches.
 * Preserves donor-uploaded images or existing valid URLs when present.
 */
/**
 * Returns a gallery list of matching food images for a given food donation.
 * Used by cycling image components to rotate photos every 2 seconds smoothly.
 */
export function getFoodImageGallery(
  title: string = "",
  category: string = "",
  id?: string,
  existingImageUrl?: string
): string[] {
  const t = title.toLowerCase();
  const c = category.toLowerCase();
  const seed = (id || title || category).trim();

  let pool: string[] = [];

  // "Packed Meals" -> multiple packed meal containers
  if (
    t.includes("packed meal") ||
    t.includes("meal box") ||
    t.includes("packet") ||
    t.includes("takeaway container") ||
    t.includes("packed food") ||
    t.includes("tiffin")
  ) {
    pool = [...SURPLUS_INDIAN_PHOTOS.packedMeals, ...SURPLUS_INDIAN_PHOTOS.hostelMess];
  }
  // "Dal Rice" / Dal & Chawal / Sambar & Rice
  else if (
    (t.includes("dal") && t.includes("rice")) ||
    (t.includes("dal") && t.includes("chawal")) ||
    (t.includes("rice") && t.includes("sambar")) ||
    t.includes("dal rice") ||
    t.includes("dal chawal") ||
    t.includes("curd rice")
  ) {
    pool = [...SURPLUS_INDIAN_PHOTOS.dalRice, ...SURPLUS_INDIAN_PHOTOS.vegPulao, ...SURPLUS_INDIAN_PHOTOS.hostelMess];
  }
  // "Roti and Sabzi" / Chapati / Paratha
  else if (
    t.includes("roti") ||
    t.includes("chapati") ||
    t.includes("sabzi") ||
    t.includes("paratha") ||
    t.includes("aloo paratha") ||
    t.includes("tawa roti")
  ) {
    pool = [...SURPLUS_INDIAN_PHOTOS.rotiSabzi, ...SURPLUS_INDIAN_PHOTOS.bulkCurry, ...SURPLUS_INDIAN_PHOTOS.hostelMess];
  }
  // "Veg Pulao"
  else if (
    t.includes("pulao") ||
    t.includes("veg pulao") ||
    t.includes("vegetable pulao") ||
    t.includes("jeera rice") ||
    t.includes("matar pulao")
  ) {
    pool = [...SURPLUS_INDIAN_PHOTOS.vegPulao, ...SURPLUS_INDIAN_PHOTOS.bulkBiryani, ...SURPLUS_INDIAN_PHOTOS.dalRice];
  }
  // Bulk Biryani
  else if (t.includes("biryani") || t.includes("dum biryani")) {
    pool = [...SURPLUS_INDIAN_PHOTOS.bulkBiryani, ...SURPLUS_INDIAN_PHOTOS.vegPulao, ...SURPLUS_INDIAN_PHOTOS.surplusCatering];
  }
  // South Indian / Breakfast
  else if (
    t.includes("idli") ||
    t.includes("idlis") ||
    t.includes("dosa") ||
    t.includes("vada") ||
    t.includes("upma") ||
    t.includes("pongal")
  ) {
    pool = [...SURPLUS_INDIAN_PHOTOS.idliBreakfast, ...SURPLUS_INDIAN_PHOTOS.snacksBatch];
  }
  // Catering surplus
  else if (
    t.includes("catering") ||
    t.includes("banquet") ||
    t.includes("reception") ||
    t.includes("buffet") ||
    c.includes("catering")
  ) {
    pool = [...SURPLUS_INDIAN_PHOTOS.surplusCatering, ...SURPLUS_INDIAN_PHOTOS.bulkCurry, ...SURPLUS_INDIAN_PHOTOS.bulkBiryani];
  }
  // Hostel / College mess
  else if (
    t.includes("hostel") ||
    t.includes("mess") ||
    t.includes("canteen") ||
    t.includes("thali") ||
    c.includes("hostel")
  ) {
    pool = [...SURPLUS_INDIAN_PHOTOS.hostelMess, ...SURPLUS_INDIAN_PHOTOS.dalRice, ...SURPLUS_INDIAN_PHOTOS.rotiSabzi];
  }
  // Curries & bulk paneer / chole
  else if (
    t.includes("paneer") ||
    t.includes("chole") ||
    t.includes("rajma") ||
    t.includes("curry") ||
    t.includes("gravy")
  ) {
    pool = [...SURPLUS_INDIAN_PHOTOS.bulkCurry, ...SURPLUS_INDIAN_PHOTOS.rotiSabzi, ...SURPLUS_INDIAN_PHOTOS.dalRice];
  }
  // Snacks & breakfast
  else if (
    t.includes("samosa") ||
    t.includes("pakora") ||
    t.includes("poha") ||
    t.includes("dhokla") ||
    t.includes("snack") ||
    t.includes("bhajiya")
  ) {
    pool = [...SURPLUS_INDIAN_PHOTOS.snacksBatch, ...SURPLUS_INDIAN_PHOTOS.bakeryPav];
  }
  // Bakery & Breads
  else if (
    t.includes("bread") ||
    t.includes("pav") ||
    t.includes("bun") ||
    t.includes("bakery") ||
    t.includes("loaf") ||
    c.includes("bakery")
  ) {
    pool = [...SURPLUS_INDIAN_PHOTOS.bakeryPav, ...SURPLUS_INDIAN_PHOTOS.snacksBatch];
  }
  // Fresh Produce
  else if (
    t.includes("produce") ||
    t.includes("vegetable") ||
    t.includes("spinach") ||
    t.includes("tomato") ||
    t.includes("gourd") ||
    c.includes("produce")
  ) {
    pool = [...SURPLUS_INDIAN_PHOTOS.freshProduce, ...SURPLUS_INDIAN_PHOTOS.hostelMess];
  }
  // Dairy & Desserts
  else if (
    t.includes("dairy") ||
    t.includes("milk") ||
    t.includes("custard") ||
    t.includes("sweet") ||
    t.includes("dessert") ||
    c.includes("dairy") ||
    c.includes("dessert")
  ) {
    pool = [...SURPLUS_INDIAN_PHOTOS.dairyDessert, ...SURPLUS_INDIAN_PHOTOS.surplusCatering];
  }
  // Cooked meals general
  else if (c.includes("cooked") || c.includes("meal")) {
    pool = [...SURPLUS_INDIAN_PHOTOS.dalRice, ...SURPLUS_INDIAN_PHOTOS.rotiSabzi, ...SURPLUS_INDIAN_PHOTOS.vegPulao, ...SURPLUS_INDIAN_PHOTOS.hostelMess];
  }
  // Default fallback
  else {
    pool = [...SURPLUS_INDIAN_PHOTOS.hostelMess, ...SURPLUS_INDIAN_PHOTOS.dalRice, ...SURPLUS_INDIAN_PHOTOS.surplusCatering, ...SURPLUS_INDIAN_PHOTOS.packedMeals];
  }

  // Deduplicate pool
  const uniquePool = Array.from(new Set(pool));

  // Rotate starting index deterministically based on seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const offset = uniquePool.length > 0 ? Math.abs(hash) % uniquePool.length : 0;
  const rotated = [...uniquePool.slice(offset), ...uniquePool.slice(0, offset)];

  if (existingImageUrl && existingImageUrl.startsWith("http")) {
    return [existingImageUrl, ...rotated.filter((u) => u !== existingImageUrl)];
  }

  return rotated.length > 0 ? rotated : [SURPLUS_INDIAN_PHOTOS.hostelMess[0]];
}

/**
 * Maps a surplus food donation listing to a realistic, practical Indian surplus food photo.
 * Prioritizes bulk food containers, stainless-steel trays, packed meal boxes, and canteen batches.
 * Preserves donor-uploaded images or existing valid URLs when present.
 */
export function getFoodImage(
  title: string = "",
  category: string = "",
  id?: string,
  existingImageUrl?: string
): string {
  const gallery = getFoodImageGallery(title, category, id, existingImageUrl);
  return gallery[0] || SURPLUS_INDIAN_PHOTOS.hostelMess[0];
}

/**
 * Generates descriptive, accessible alt text representing surplus food for donation.
 */
export function getFoodAltText(title: string = "", category: string = ""): string {
  const cleanTitle = title.replace(/\[(Fictional|Demo)\]\s*/i, "").trim();
  const cat = category || "Pure Veg Cooked Meals";

  if (cleanTitle) {
    return `Surplus pure vegetarian donation: ${cleanTitle} (${cat}, freshly prepared for NGO collection)`;
  }
  return `Surplus pure vegetarian Indian meal batch prepared for community distribution`;
}
