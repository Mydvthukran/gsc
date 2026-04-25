// Retailer locations for route optimization demo
// Centered around Bangalore, India for a realistic scenario

const retailerLocations = [
  {
    id: 'W001',
    name: 'Central Warehouse',
    type: 'warehouse',
    lat: 12.9716,
    lng: 77.5946,
    address: 'MG Road, Bangalore',
    icon: 'Warehouse'
  },
  {
    id: 'R001',
    name: 'FreshMart Koramangala',
    type: 'retailer',
    lat: 12.9352,
    lng: 77.6245,
    address: 'Koramangala 5th Block, Bangalore',
    demand: 120,
    icon: 'Store'
  },
  {
    id: 'R002',
    name: 'GreenBasket Indiranagar',
    type: 'retailer',
    lat: 12.9784,
    lng: 77.6408,
    address: '100 Feet Road, Indiranagar, Bangalore',
    demand: 95,
    icon: 'Store'
  },
  {
    id: 'R003',
    name: 'QuickStop Whitefield',
    type: 'retailer',
    lat: 12.9698,
    lng: 77.7500,
    address: 'ITPL Main Road, Whitefield, Bangalore',
    demand: 85,
    icon: 'Store'
  },
  {
    id: 'R004',
    name: 'DailyNeeds JP Nagar',
    type: 'retailer',
    lat: 12.9063,
    lng: 77.5857,
    address: '15th Cross, JP Nagar, Bangalore',
    demand: 110,
    icon: 'Store'
  },
  {
    id: 'R005',
    name: 'SuperSave Malleshwaram',
    type: 'retailer',
    lat: 13.0035,
    lng: 77.5710,
    address: 'Sampige Road, Malleshwaram, Bangalore',
    demand: 75,
    icon: 'Store'
  },
  {
    id: 'R006',
    name: 'ValueMart Electronic City',
    type: 'retailer',
    lat: 12.8456,
    lng: 77.6603,
    address: 'Phase 1, Electronic City, Bangalore',
    demand: 130,
    icon: 'Store'
  },
  {
    id: 'R007',
    name: 'CityGrocers HSR Layout',
    type: 'retailer',
    lat: 12.9116,
    lng: 77.6474,
    address: 'Sector 1, HSR Layout, Bangalore',
    demand: 90,
    icon: 'Store'
  },
  {
    id: 'R008',
    name: 'MegaStore Jayanagar',
    type: 'retailer',
    lat: 12.9299,
    lng: 77.5838,
    address: '4th Block, Jayanagar, Bangalore',
    demand: 105,
    icon: 'Store'
  }
];

export default retailerLocations;
