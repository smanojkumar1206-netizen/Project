import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import { ROLE_CONFIG, ROLES, normalizeRole, isPageAllowed } from "./config/roles";
import {
  initialListings, initialRequirements, initialOrders,
  initialVehicles, initialTransportRequests, initialActiveTrips,
  initialStorage, initialIoTDevices
} from "./data/seedData";

import AuthPage from "./pages/auth/AuthPage";
import { signOutUser, getRegisteredUsersStore } from "./services/supabase";
import RoleGuard from "./components/RoleGuard";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AccessRestricted from "./components/AccessRestricted";
import { Toast } from "./components/Toast";

// Farmer Pages
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import MyProduce from "./pages/farmer/MyProduce";
import FindBuyers from "./pages/farmer/FindBuyers";
import FarmerOrders from "./pages/farmer/FarmerOrders";
import FarmerTransport from "./pages/farmer/FarmerTransport";
import FarmerStorage from "./pages/farmer/FarmerStorage";
import FarmerIoT from "./pages/farmer/FarmerIoT";
import FarmerPayments from "./pages/farmer/FarmerPayments";
import FarmerProfile from "./pages/farmer/FarmerProfile";

// Buyer Pages
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import FindProduce from "./pages/buyer/FindProduce";
import MyRequirements from "./pages/buyer/MyRequirements";
import BuyerOrders from "./pages/buyer/BuyerOrders";
import BuyerTransportTracking from "./pages/buyer/BuyerTransportTracking";
import BuyerPayments from "./pages/buyer/BuyerPayments";
import BuyerProfile from "./pages/buyer/BuyerProfile";

// Transporter Pages
import TransporterDashboard from "./pages/transporter/TransporterDashboard";
import TransportRequests from "./pages/transporter/TransportRequests";
import MyVehicles from "./pages/transporter/MyVehicles";
import ActiveTrips from "./pages/transporter/ActiveTrips";
import RouteOptimizer from "./pages/transporter/RouteOptimizer";
import DeliveryHistory from "./pages/transporter/DeliveryHistory";
import TransporterEarnings from "./pages/transporter/TransporterEarnings";
import TransporterIoT from "./pages/transporter/TransporterIoT";
import TransporterProfile from "./pages/transporter/TransporterProfile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import OrdersManagement from "./pages/admin/OrdersManagement";
import TransportManagement from "./pages/admin/TransportManagement";
import StorageManagement from "./pages/admin/StorageManagement";
import AdminIoT from "./pages/admin/AdminIoT";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import SystemSettings from "./pages/admin/SystemSettings";

// AgriAI Voice Assistant Components
import VoiceButton from "./components/VoiceButton";
import VoiceAssistant from "./components/VoiceAssistant";
import NotificationPanel from "./components/NotificationPanel";

function App() {
  // Session Persistence Check (Requirement #16)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem("agriconnect_session"));
  });

  const [currentUserProfile, setCurrentUserProfile] = useState(() => {
    const saved = localStorage.getItem("agriconnect_session");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  // User Role is permanently associated with authenticated account (Requirement #4)
  const role = currentUserProfile ? normalizeRole(currentUserProfile.role) : ROLES.farmer;
  const [page, setPage] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Synchronize Registered Users with Database Store (Requirement #8)
  const [users, setUsers] = useState(() => getRegisteredUsersStore());

  useEffect(() => {
    setUsers(getRegisteredUsersStore());
  }, [isAuthenticated, currentUserProfile]);

  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: "NOTIF-ADMIN-100",
      user_id: "USR-ADMIN-001",
      role: "admin",
      title: "New User Registered",
      message: "New Farmer Ravi Kumar registered in Melur, Madurai.",
      type: "NEW_USER_REGISTERED",
      channel: "IN_APP",
      is_demo_channel: true,
      read: false,
      timestamp: "5 mins ago"
    },
    {
      id: "NOTIF-101",
      user_id: "USR-FARMER-1",
      role: "farmer",
      title: "Offer Accepted",
      message: "Madurai Fresh Mart accepted your offer for 500 kg Tomato. Waiting for transport.",
      type: "OFFER_ACCEPTED",
      channel: "IN_APP",
      is_demo_channel: true,
      read: false,
      timestamp: "10 mins ago"
    },
    {
      id: "NOTIF-102",
      user_id: "USR-BUYER-1",
      role: "buyer",
      title: "Order Confirmed",
      message: "Your order ORD-1042 has been confirmed by farmer Ravi Kumar. Waiting for transport.",
      type: "ORDER_CONFIRMED",
      channel: "IN_APP",
      is_demo_channel: true,
      read: false,
      timestamp: "10 mins ago"
    }
  ]);

  // Operational Data State
  const [listings, setListings] = useState(initialListings);
  const [requirements, setRequirements] = useState(initialRequirements);
  const [orders, setOrders] = useState(initialOrders);
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [transportRequests, setTransportRequests] = useState(initialTransportRequests);
  const [activeTrips, setActiveTrips] = useState(initialActiveTrips);
  const [storage, setStorage] = useState(initialStorage);
  const [iotDevices, setIotDevices] = useState(initialIoTDevices);

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // Login Handler (Requirement #13 & #14)
  const handleLoginSuccess = (profile) => {
    setCurrentUserProfile(profile);
    setIsAuthenticated(true);
    localStorage.setItem("agriconnect_session", JSON.stringify(profile));

    const userRoleKey = normalizeRole(profile.role);
    const cfg = ROLE_CONFIG[userRoleKey] || ROLE_CONFIG.farmer;
    setPage(cfg.defaultPage);
    notify(`Authenticated as ${profile.full_name} (${cfg.name}). Access Granted.`);

    // If new user, append to users list and notify admin (Requirement #18)
    setUsers(getRegisteredUsersStore());
    if (userRoleKey !== "admin") {
      setNotifications((prev) => [
        {
          id: `N-ADMIN-${Date.now()}`,
          user_id: "USR-ADMIN-001",
          role: "admin",
          title: `New ${cfg.name} Account`,
          message: `New ${cfg.name} ${profile.full_name} signed in from ${profile.location || 'Madurai'}.`,
          type: "NEW_USER_REGISTERED",
          channel: "IN_APP",
          is_demo_channel: true,
          read: false,
          timestamp: "Just now"
        },
        ...prev
      ]);
    }
  };

  // Logout Handler (Requirement #15)
  const handleLogout = async () => {
    await signOutUser();
    localStorage.removeItem("agriconnect_session");
    setIsAuthenticated(false);
    setCurrentUserProfile(null);
    notify("Session ended. Signed out successfully.");
  };

  const normKey = normalizeRole(role);
  const currentUserId = currentUserProfile?.id || (
    normKey === "farmer" ? "USR-FARMER-1" :
    normKey === "buyer" ? "USR-BUYER-1" :
    normKey === "transporter" ? "USR-TRANSPORTER-1" : "USR-ADMIN-001"
  );

  const currentRoleConfig = ROLE_CONFIG[normKey] || ROLE_CONFIG.farmer;

  // Order & Transport Workflow Handlers
  const handlePlaceOrderFromBuyer = (listingItem) => {
    const qty = listingItem.requestedQty || listingItem.qty || 500;
    const orderId = `ORD-${Math.floor(1045 + Math.random() * 899)}`;
    const buyerName = currentUserProfile?.full_name || "Madurai Fresh Mart";
    const farmerName = listingItem.farmer || "Ravi Kumar";

    const newOrd = {
      id: orderId,
      crop: listingItem.crop,
      buyer: buyerName,
      buyer_id: currentUserId,
      farmer: farmerName,
      farmer_id: listingItem.farmer_id || "USR-FARMER-1",
      qty: qty,
      price: listingItem.price,
      amount: qty * listingItem.price,
      status: "ORDER_PLACED",
      transport_status: "PENDING",
      transporter: "Pending",
      deliveryDate: "14 Sep 2026",
      pickupLocation: listingItem.location || "Melur, Madurai",
      deliveryLocation: "Madurai Town"
    };

    setOrders((prev) => [newOrd, ...prev]);

    const newNotifs = [
      {
        id: `N-${Date.now()}-1`,
        user_id: listingItem.farmer_id || "USR-FARMER-1",
        role: "farmer",
        title: "New Order Received",
        message: `Buyer ${buyerName} placed an order for ${qty} kg ${listingItem.crop}.`,
        type: "NEW_ORDER",
        channel: "IN_APP",
        is_demo_channel: true,
        read: false,
        timestamp: "Just now"
      },
      {
        id: `N-${Date.now()}-2`,
        user_id: currentUserId,
        role: "buyer",
        title: "Order Confirmation",
        message: `Your order ${orderId} for ${qty} kg ${listingItem.crop} has been placed.`,
        type: "ORDER_PLACED",
        channel: "IN_APP",
        is_demo_channel: true,
        read: false,
        timestamp: "Just now"
      }
    ];

    setNotifications((prev) => [...newNotifs, ...prev]);
    notify(`Order ${orderId} placed for ${qty} kg of ${listingItem.crop}!`);
    setPage("My Orders");
  };

  const handleAcceptOffer = (orderId) => {
    let targetOrder = null;

    setOrders((prevOrders) =>
      prevOrders.map((o) => {
        if (o.id === orderId) {
          targetOrder = { ...o, status: "ACCEPTED", transport_status: "WAITING_FOR_TRANSPORT" };
          return targetOrder;
        }
        return o;
      })
    );

    if (!targetOrder) {
      targetOrder = orders.find(o => o.id === orderId) || { id: orderId, crop: "Tomato", qty: 500, pickupLocation: "Melur, Madurai", deliveryLocation: "Madurai Town" };
    }

    const trId = `TR-${Math.floor(810 + Math.random() * 80)}`;
    const newTr = {
      id: trId,
      orderId: targetOrder.id,
      order_id: targetOrder.id,
      produce: targetOrder.crop,
      qty: targetOrder.qty,
      farmer_id: targetOrder.farmer_id || "USR-FARMER-1",
      buyer_id: targetOrder.buyer_id || "USR-BUYER-1",
      pickup: targetOrder.pickupLocation || "Melur, Madurai",
      delivery: targetOrder.deliveryLocation || "Madurai Town",
      requiredCapacity: `${targetOrder.qty} kg`,
      pickupTime: "Today 09:00 AM",
      deadline: "Today 05:00 PM",
      distance: "18.4 km",
      estCost: 850,
      status: "WAITING_FOR_TRANSPORT"
    };

    setTransportRequests((prev) => [newTr, ...prev]);

    const newNotifs = [
      {
        id: `N-${Date.now()}-3`,
        user_id: targetOrder.farmer_id || "USR-FARMER-1",
        role: "farmer",
        title: "Offer Accepted",
        message: `Your offer for ${targetOrder.qty} kg ${targetOrder.crop} has been accepted and is waiting for transport.`,
        type: "OFFER_ACCEPTED",
        channel: "IN_APP",
        is_demo_channel: true,
        read: false,
        timestamp: "Just now"
      },
      {
        id: `N-${Date.now()}-4`,
        user_id: targetOrder.buyer_id || "USR-BUYER-1",
        role: "buyer",
        title: "Offer Accepted",
        message: `Order ${targetOrder.id} has been accepted by farmer and is waiting for transport.`,
        type: "OFFER_ACCEPTED",
        channel: "IN_APP",
        is_demo_channel: true,
        read: false,
        timestamp: "Just now"
      },
      {
        id: `N-${Date.now()}-5`,
        user_id: "USR-TRANSPORTER-1",
        role: "transporter",
        title: "New Transport Request",
        message: `New transport request ${newTr.id}: ${targetOrder.qty} kg ${targetOrder.crop} from ${newTr.pickup} to ${newTr.delivery}.`,
        type: "NEW_TRANSPORT_REQUEST",
        channel: "IN_APP",
        is_demo_channel: true,
        read: false,
        timestamp: "Just now"
      }
    ];

    setNotifications((prev) => [...newNotifs, ...prev]);
    notify(`Offer Accepted! Transport Request ${newTr.id} created automatically.`);
  };

  const handleAcceptTransport = (req) => {
    setTransportRequests((prev) => prev.filter((r) => r.id !== req.id));

    const vehicleNo = "TN 58 AB 2211";
    const newTrip = {
      id: `TRIP-${Math.floor(405 + Math.random() * 90)}`,
      orderId: req.orderId || req.order_id || "ORD-1042",
      produce: req.produce,
      qty: req.qty,
      farmerPickup: req.pickup,
      buyerDestination: req.delivery,
      vehicle: vehicleNo,
      transporter: "Express Logistics",
      transporter_id: currentUserId,
      distance: req.distance || "18.4 km",
      eta: "45 mins",
      status: "TRANSPORT ASSIGNED",
      pickupLocation: req.pickup,
      currentLocation: req.pickup,
      destination: req.delivery
    };

    setActiveTrips((prev) => [newTrip, ...prev]);

    setOrders((prev) =>
      prev.map((o) =>
        o.id === newTrip.orderId ? { ...o, status: "TRANSPORT ASSIGNED", transporter: vehicleNo } : o
      )
    );

    const newNotifs = [
      {
        id: `N-${Date.now()}-6`,
        user_id: req.farmer_id || "USR-FARMER-1",
        role: "farmer",
        title: "Transport Assigned",
        message: `Vehicle ${vehicleNo} has been assigned to transport your ${req.produce}.`,
        type: "TRANSPORT_ASSIGNED",
        channel: "IN_APP",
        is_demo_channel: true,
        read: false,
        timestamp: "Just now"
      },
      {
        id: `N-${Date.now()}-7`,
        user_id: req.buyer_id || "USR-BUYER-1",
        role: "buyer",
        title: "Transport Assigned",
        message: `Vehicle ${vehicleNo} has been assigned to your shipment.`,
        type: "TRANSPORT_ASSIGNED",
        channel: "IN_APP",
        is_demo_channel: true,
        read: false,
        timestamp: "Just now"
      }
    ];

    setNotifications((prev) => [...newNotifs, ...prev]);
    notify(`Transport Request Accepted! Vehicle ${vehicleNo} assigned.`);
  };

  const handleUpdateTripStatus = (tripId, newStatus) => {
    setActiveTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, status: newStatus } : t))
    );

    let targetTrip = activeTrips.find(t => t.id === tripId);

    setOrders((prev) =>
      prev.map((o) => {
        if (!targetTrip || o.id === targetTrip.orderId) {
          return { ...o, status: newStatus };
        }
        return o;
      })
    );

    notify(`Trip status updated to '${newStatus.replace(/_/g, " ")}'!`);
  };

  const renderContent = () => {
    // Role = Farmer
    if (normKey === ROLES.farmer) {
      switch (page) {
        case "Dashboard":
          return (
            <FarmerDashboard
              listings={listings}
              orders={orders}
              requirements={requirements}
              storage={storage}
              go={setPage}
              onOpenAddProduce={() => setPage("My Produce")}
            />
          );
        case "My Produce":
          return <MyProduce listings={listings} setListings={setListings} notify={notify} />;
        case "Find Buyers":
          return <FindBuyers requirements={requirements} notify={notify} />;
        case "My Orders":
          return <FarmerOrders orders={orders} onAcceptOffer={handleAcceptOffer} notify={notify} go={setPage} />;
        case "Transport":
          return <FarmerTransport activeTrips={activeTrips} notify={notify} />;
        case "Storage":
          return <FarmerStorage storage={storage} notify={notify} />;
        case "IoT Monitoring":
          return <FarmerIoT iotDevices={iotDevices} notify={notify} />;
        case "Payments":
          return <FarmerPayments notify={notify} />;
        case "Profile":
          return <FarmerProfile notify={notify} />;
        default:
          return <FarmerDashboard listings={listings} orders={orders} requirements={requirements} storage={storage} go={setPage} />;
      }
    }

    // Role = Buyer
    if (normKey === ROLES.buyer) {
      switch (page) {
        case "Dashboard":
          return (
            <BuyerDashboard
              listings={listings}
              requirements={requirements}
              orders={orders}
              activeTrips={activeTrips}
              go={setPage}
              onOpenPostReq={() => setPage("My Requirements")}
            />
          );
        case "Find Produce":
          return <FindProduce listings={listings} onPlaceOrder={handlePlaceOrderFromBuyer} notify={notify} />;
        case "My Requirements":
          return <MyRequirements requirements={requirements} setRequirements={setRequirements} notify={notify} />;
        case "My Orders":
          return <BuyerOrders orders={orders} notify={notify} />;
        case "Transport Tracking":
          return <BuyerTransportTracking activeTrips={activeTrips} notify={notify} />;
        case "Payments":
          return <BuyerPayments notify={notify} />;
        case "Profile":
          return <BuyerProfile notify={notify} />;
        default:
          return <BuyerDashboard listings={listings} requirements={requirements} orders={orders} activeTrips={activeTrips} go={setPage} />;
      }
    }

    // Role = Transporter
    if (normKey === ROLES.transporter) {
      switch (page) {
        case "Dashboard":
          return (
            <TransporterDashboard
              transportRequests={transportRequests}
              vehicles={vehicles}
              activeTrips={activeTrips}
              go={setPage}
              notify={notify}
            />
          );
        case "Transport Requests":
          return (
            <TransportRequests
              transportRequests={transportRequests}
              setTransportRequests={setTransportRequests}
              setActiveTrips={setActiveTrips}
              onAcceptTransport={handleAcceptTransport}
              notify={notify}
            />
          );
        case "My Vehicles":
          return <MyVehicles vehicles={vehicles} setVehicles={setVehicles} notify={notify} />;
        case "Active Trips":
          return <ActiveTrips activeTrips={activeTrips} onUpdateTripStatus={handleUpdateTripStatus} notify={notify} />;
        case "Route Optimizer":
          return <RouteOptimizer vehicles={vehicles} notify={notify} />;
        case "Delivery History":
          return <DeliveryHistory notify={notify} />;
        case "Earnings":
          return <TransporterEarnings notify={notify} />;
        case "IoT Monitoring":
          return <TransporterIoT iotDevices={iotDevices} notify={notify} />;
        case "Profile":
          return <TransporterProfile notify={notify} />;
        default:
          return <TransporterDashboard transportRequests={transportRequests} vehicles={vehicles} activeTrips={activeTrips} go={setPage} notify={notify} />;
      }
    }

    // Role = Admin
    if (normKey === ROLES.admin) {
      switch (page) {
        case "Dashboard":
          return (
            <AdminDashboard
              users={users}
              listings={listings}
              orders={orders}
              vehicles={vehicles}
              activeTrips={activeTrips}
              storage={storage}
              iotDevices={iotDevices}
              go={setPage}
            />
          );
        case "Users":
        case "Farmers":
        case "Buyers":
        case "Transporters":
          return <UsersManagement users={users} setUsers={setUsers} roleFilter={page} notify={notify} />;
        case "Produce Listings":
          return <FindProduce listings={listings} onPlaceOrder={() => {}} notify={notify} />;
        case "Orders":
          return <OrdersManagement orders={orders} notify={notify} />;
        case "Transportation":
          return <TransportManagement vehicles={vehicles} activeTrips={activeTrips} notify={notify} />;
        case "Storage":
          return <StorageManagement storage={storage} notify={notify} />;
        case "IoT Monitoring":
          return <AdminIoT iotDevices={iotDevices} notify={notify} />;
        case "Analytics":
          return <AnalyticsPage />;
        case "System Settings":
          return <SystemSettings notify={notify} />;
        default:
          return <AdminDashboard users={users} listings={listings} orders={orders} vehicles={vehicles} activeTrips={activeTrips} storage={storage} iotDevices={iotDevices} go={setPage} />;
      }
    }

    return null;
  };

  // Requirement #1: First Screen must be Welcome/Login page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  const userScopedNotifs = notifications.filter(
    (n) => n.user_id === currentUserId || n.user_id === "BROADCAST" || n.role === normKey
  );
  const unreadCount = userScopedNotifs.filter((n) => !n.read).length;

  return (
    <div className={`app ${currentRoleConfig.themeClass}`}>
      <Sidebar
        role={role}
        page={page}
        setPage={setPage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        notify={notify}
        onLogout={handleLogout}
      />

      <main className="main">
        <Header
          role={role}
          page={page}
          setMobileOpen={setMobileOpen}
          notify={notify}
          unreadCount={unreadCount}
          onOpenNotifications={() => setNotifOpen(!notifOpen)}
          currentUserProfile={currentUserProfile}
          onLogout={handleLogout}
        />

        <div className="content">
          <RoleGuard userRole={role} targetPage={page} setPage={setPage}>
            {renderContent()}
          </RoleGuard>
        </div>
      </main>

      <Toast toast={toast} />

      <NotificationPanel
        notifications={userScopedNotifs}
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
        onMarkRead={(id) =>
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          )
        }
        onNavigate={(targetPage) => setPage(targetPage)}
      />

      <VoiceButton
        isOpen={assistantOpen}
        onClick={() => setAssistantOpen(!assistantOpen)}
      />

      <VoiceAssistant
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        role={role}
        userId={currentUserId}
        setPage={setPage}
        notify={notify}
        appState={{
          listings, setListings,
          requirements, setRequirements,
          orders, setOrders,
          vehicles, setVehicles,
          transportRequests, setTransportRequests,
          activeTrips, setActiveTrips,
          users, setUsers,
          storage, setStorage,
          iotDevices, setIotDevices
        }}
      />
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
