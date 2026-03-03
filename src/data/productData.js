// ======================================================
//  productData.js  —  Edit this file to update product
// ======================================================

const productData = {
    id: "prod-001",
    type: "digital",           // "digital" | "physical"
    name: "Premium Gift Card",
    tagline: "Instant delivery to your inbox",
    description:
        "Get instant access to our Premium Gift Card. Perfect for gifting or personal use. The code will be delivered to your email within minutes of payment.",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=400&fit=crop",
    badge: "Best Seller",      // null to hide
    features: [
        "Instant email delivery",
        "Valid for 12 months",
        "No hidden charges",
        "24/7 customer support",
    ],
    packages: [
        { id: "pkg-1", label: "₹99", price: 99, description: "Basic Pack" },
        { id: "pkg-2", label: "₹199", price: 199, description: "Standard Pack" },
        { id: "pkg-3", label: "₹499", price: 499, description: "Premium Pack" },
        { id: "pkg-4", label: "₹999", price: 999, description: "Ultimate Pack" },
    ],
    upiId: "yourstore@upi",    // shown to customer after order (optional)
};

export default productData;
