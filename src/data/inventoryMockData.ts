
export const mockInventoryItems = [
  {
    id: "1",
    name: "Surgical Gloves (Large)",
    sku: "GLV-L-001",
    category: "Clinical",
    currentStock: 250,
    reorderPoint: 500,
    maxQuantity: 2000,
    vendor: "Henry Schein",
    lastPrice: 89.99,
    status: "critical",
    expiryDate: "2025-12-31",
    usageRate: "45/week"
  },
  {
    id: "2", 
    name: "Dental Impression Material",
    sku: "DIM-ALG-002",
    category: "Clinical",
    currentStock: 12,
    reorderPoint: 20,
    maxQuantity: 100,
    vendor: "Patterson Dental",
    lastPrice: 156.50,
    status: "low",
    expiryDate: "2026-03-15",
    usageRate: "8/week"
  },
  {
    id: "3",
    name: "Office Paper (A4)",
    sku: "PPR-A4-003",
    category: "Office",
    currentStock: 150,
    reorderPoint: 50,
    maxQuantity: 500,
    vendor: "Amazon Business",
    lastPrice: 45.99,
    status: "optimal",
    expiryDate: null,
    usageRate: "15/week"
  }
];

export const mockVendors = [
  {
    id: "1",
    name: "Henry Schein",
    status: "connected",
    lastSync: "2024-06-26 08:30 AM",
    itemsCount: 1250
  },
  {
    id: "2",
    name: "Patterson Dental", 
    status: "connected",
    lastSync: "2024-06-26 07:45 AM",
    itemsCount: 890
  },
  {
    id: "3",
    name: "Amazon Business",
    status: "pending",
    lastSync: "Never",
    itemsCount: 0
  }
];
