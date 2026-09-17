export const initialListings = [
  { id: 1, crop: "Tomato", farmer: "Ravi Kumar", qty: 500, price: 28, location: "Melur, Madurai", harvest: "10 Sep 2026", grade: "A", status: "Available", distance: "12 km" },
  { id: 2, crop: "Onion", farmer: "Meena Farms", qty: 800, price: 34, location: "Thirumangalam, Madurai", harvest: "11 Sep 2026", grade: "A", status: "Available", distance: "18 km" },
  { id: 3, crop: "Green Chilli", farmer: "Sakthi Agro", qty: 250, price: 62, location: "Usilampatti, Madurai", harvest: "10 Sep 2026", grade: "A", status: "Available", distance: "25 km" },
  { id: 4, crop: "Potato", farmer: "Kannan Farm", qty: 1000, price: 31, location: "Dindigul", harvest: "12 Sep 2026", grade: "B", status: "Available", distance: "45 km" },
  { id: 5, crop: "Brinjal", farmer: "Ravi Kumar", qty: 350, price: 22, location: "Melur, Madurai", harvest: "14 Sep 2026", grade: "A", status: "Available", distance: "14 km" }
];

export const initialRequirements = [
  { id: "REQ-301", crop: "Tomato", buyer: "Madurai Fresh Mart", qty: 500, maxPrice: 25, location: "Madurai", deadline: "Within 2 days", grade: "A", status: "Active", createdAt: "10 Sep 2026" },
  { id: "REQ-302", crop: "Onion", buyer: "Hotel Vaigai", qty: 600, maxPrice: 35, location: "Madurai Town", deadline: "Within 3 days", grade: "A", status: "Active", createdAt: "09 Sep 2026" },
  { id: "REQ-303", crop: "Green Chilli", buyer: "City Caterers", qty: 200, maxPrice: 65, location: "Anna Nagar, Madurai", deadline: "Within 1 day", grade: "A", status: "Matched", createdAt: "08 Sep 2026" },
  { id: "REQ-304", crop: "Potato", buyer: "Pandian Processing", qty: 1500, maxPrice: 30, location: "Dindigul Bypass", deadline: "Within 5 days", grade: "B", status: "Active", createdAt: "10 Sep 2026" }
];

export const initialOrders = [
  { id: "ORD-1042", crop: "Tomato", buyer: "Madurai Fresh Mart", farmer: "Ravi Kumar", qty: 500, amount: 12500, price: 25, status: "TRANSPORT ASSIGNED", transporter: "TN 58 AB 2211", deliveryDate: "12 Sep 2026", pickupLocation: "Melur, Madurai", deliveryLocation: "Madurai Town" },
  { id: "ORD-1041", crop: "Onion", buyer: "Hotel Vaigai", farmer: "Meena Farms", qty: 300, amount: 10200, price: 34, status: "MATCHED", transporter: "Pending", deliveryDate: "13 Sep 2026", pickupLocation: "Thirumangalam", deliveryLocation: "Vaigai Hotel" },
  { id: "ORD-1039", crop: "Green Chilli", buyer: "City Caterers", farmer: "Sakthi Agro", qty: 100, amount: 6200, price: 62, status: "DELIVERED", transporter: "TN 59 CD 8842", deliveryDate: "10 Sep 2026", pickupLocation: "Usilampatti", deliveryLocation: "Anna Nagar" },
  { id: "ORD-1038", crop: "Potato", buyer: "Pandian Processing", farmer: "Kannan Farm", qty: 800, amount: 24800, price: 31, status: "IN TRANSIT", transporter: "TN 58 EF 1098", deliveryDate: "11 Sep 2026", pickupLocation: "Dindigul", deliveryLocation: "Dindigul Bypass" },
  { id: "ORD-1037", crop: "Tomato", buyer: "Southern Mart", farmer: "Ravi Kumar", qty: 200, amount: 5600, price: 28, status: "CONFIRMED", transporter: "Pending", deliveryDate: "14 Sep 2026", pickupLocation: "Melur, Madurai", deliveryLocation: "KK Nagar" },
  { id: "ORD-1036", crop: "Brinjal", buyer: "Green Grocers", farmer: "Ravi Kumar", qty: 150, amount: 3300, price: 22, status: "REQUESTED", transporter: "Pending", deliveryDate: "15 Sep 2026", pickupLocation: "Melur, Madurai", deliveryLocation: "Tallakulam" }
];

export const initialVehicles = [
  { id: "V-101", vehicleNumber: "TN 58 AB 2211", type: "Refrigerated Van", maxCapacity: 1000, status: "On Trip", location: "Melur Highway", driver: "Karthik R.", driverPhone: "+91 98765 43210" },
  { id: "V-102", vehicleNumber: "TN 59 CD 8842", type: "Medium Truck", maxCapacity: 2500, status: "Available", location: "Madurai Depot", driver: "Murugan P.", driverPhone: "+91 98765 43211" },
  { id: "V-103", vehicleNumber: "TN 58 EF 1098", type: "Insulated Mini Truck", maxCapacity: 800, status: "On Trip", location: "Dindigul Route", driver: "Selvam S.", driverPhone: "+91 98765 43212" },
  { id: "V-104", vehicleNumber: "TN 59 GH 4201", type: "Refrigerated Van", maxCapacity: 1200, status: "Maintenance", location: "Central Workshop", driver: "Anand M.", driverPhone: "+91 98765 43213" }
];

export const initialTransportRequests = [
  { id: "TR-801", orderId: "ORD-1041", produce: "Onion", qty: 300, requiredCapacity: "500 kg", pickup: "Thirumangalam, Madurai", delivery: "Hotel Vaigai, Madurai", pickupTime: "11 Sep, 08:00 AM", deadline: "11 Sep, 02:00 PM", distance: "22 km", estCost: 850, status: "Open" },
  { id: "TR-802", orderId: "ORD-1037", produce: "Tomato", qty: 200, requiredCapacity: "300 kg", pickup: "Melur, Madurai", delivery: "KK Nagar, Madurai", pickupTime: "12 Sep, 07:00 AM", deadline: "12 Sep, 12:00 PM", distance: "16 km", estCost: 620, status: "Open" },
  { id: "TR-803", orderId: "ORD-1045", produce: "Potato", qty: 450, requiredCapacity: "600 kg", pickup: "Dindigul Depot", delivery: "Madurai Market", pickupTime: "12 Sep, 09:30 AM", deadline: "12 Sep, 04:00 PM", distance: "58 km", estCost: 1800, status: "Open" }
];

export const initialActiveTrips = [
  { id: "TRIP-401", orderId: "ORD-1042", produce: "Tomato", qty: 500, farmerPickup: "Ravi Kumar (Melur)", buyerDestination: "Madurai Fresh Mart", vehicle: "TN 58 AB 2211", transporter: "Express Logistics", distance: "18.4 km", eta: "45 mins", status: "IN TRANSIT", pickupLocation: "Melur, Madurai", currentLocation: "Othakadai", destination: "Madurai Town" },
  { id: "TRIP-402", orderId: "ORD-1038", produce: "Potato", qty: 800, farmerPickup: "Kannan Farm (Dindigul)", buyerDestination: "Pandian Processing", vehicle: "TN 58 EF 1098", transporter: "Vadasery Freight", distance: "42.0 km", eta: "1 hr 10 mins", status: "IN TRANSIT", pickupLocation: "Dindigul", currentLocation: "Vadipatti", destination: "Dindigul Bypass" }
];

export const initialUsers = [
  { id: "USR-001", name: "Ravi Kumar", role: "Farmer", location: "Melur, Madurai", status: "Active", joined: "15 Jan 2026", email: "ravi.farmer@agriconnect.in", phone: "+91 94431 11223" },
  { id: "USR-002", name: "Meena Farms", role: "Farmer", location: "Thirumangalam", status: "Active", joined: "20 Feb 2026", email: "meena.agro@agriconnect.in", phone: "+91 94432 22334" },
  { id: "USR-003", name: "Madurai Fresh Mart", role: "Buyer", location: "Madurai Town", status: "Active", joined: "10 Mar 2026", email: "procure@maduraifresh.com", phone: "+91 98421 33445" },
  { id: "USR-004", name: "Hotel Vaigai", role: "Buyer", location: "Madurai", status: "Active", joined: "05 Apr 2026", email: "kitchen@hotelvaigai.com", phone: "+91 98422 44556" },
  { id: "USR-005", name: "Express Freight Logistics", role: "Transporter", location: "Madurai Hub", status: "Active", joined: "12 Jan 2026", email: "dispatch@expressfreight.in", phone: "+91 97890 55667" },
  { id: "USR-006", name: "Kannan Farm", role: "Farmer", location: "Dindigul", status: "Suspended", joined: "01 Jun 2026", email: "kannan@dindigulfarms.org", phone: "+91 94433 66778" },
  { id: "USR-007", name: "City Caterers", role: "Buyer", location: "Anna Nagar, Madurai", status: "Active", joined: "18 May 2026", email: "info@citycaterers.in", phone: "+91 98423 77889" }
];

export const initialStorage = [
  { id: "STR-01", name: "Madurai Central Agro Hub", location: "Melur Road, Madurai", totalCapacity: "2,000 kg", occupiedCapacity: "1,440 kg", availableCapacity: "560 kg", occupancyPercent: "72%", temp: "6.2°C", humidity: "82%", status: "Operational", suitableFor: "Tomato, Chilli, Brinjal" },
  { id: "STR-02", name: "Vaigai Cold Storage", location: "Mattuthavani, Madurai", totalCapacity: "1,500 kg", occupiedCapacity: "810 kg", availableCapacity: "690 kg", occupancyPercent: "54%", temp: "4.5°C", humidity: "88%", status: "Operational", suitableFor: "Leafy Greens, Tomato" },
  { id: "STR-03", name: "Dindigul Farm Warehouse", location: "Dindigul Agro Zone", totalCapacity: "3,000 kg", occupiedCapacity: "2,430 kg", availableCapacity: "570 kg", occupancyPercent: "81%", temp: "12.0°C", humidity: "75%", status: "Operational", suitableFor: "Onion, Potato" }
];

export const initialIoTDevices = [
  { id: "IOT-TRK07", label: "Refrigerated Truck TRK-07 (TN 58 AB 2211)", type: "Vehicle Unit", location: "En-route Madurai", temp: 8.4, humidity: 82, loadKg: 485, maxLoadKg: 500, doorStatus: "Closed", riskScore: 18, riskLevel: "Low", status: "Connected", lastUpdate: "12 sec ago", ownerRole: "transporter" },
  { id: "IOT-STR01", label: "Madurai Agro Hub Storage (STR-01)", type: "Storage Sensor", location: "Melur Depot", temp: 6.2, humidity: 84, loadKg: 1440, maxLoadKg: 2000, doorStatus: "Closed", riskScore: 12, riskLevel: "Low", status: "Connected", lastUpdate: "5 sec ago", ownerRole: "farmer" },
  { id: "IOT-TRK09", label: "Mini Truck TRK-09 (TN 58 EF 1098)", type: "Vehicle Unit", location: "Dindigul Highway", temp: 11.8, humidity: 76, loadKg: 780, maxLoadKg: 800, doorStatus: "Opened 2m ago", riskScore: 42, riskLevel: "Medium", status: "Connected", lastUpdate: "25 sec ago", ownerRole: "transporter" },
  { id: "IOT-STR02", label: "Vaigai Cold Storage (STR-02)", type: "Storage Sensor", location: "Mattuthavani", temp: 4.5, humidity: 88, loadKg: 810, maxLoadKg: 1500, doorStatus: "Closed", riskScore: 8, riskLevel: "Low", status: "Connected", lastUpdate: "3 sec ago", ownerRole: "admin" }
];
