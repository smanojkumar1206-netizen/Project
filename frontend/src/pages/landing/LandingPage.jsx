import React, { useState } from "react";
import {
  Leaf,
  ArrowRight,
  LogIn,
  UserPlus,
  ShieldCheck,
  Sprout,
  ShoppingCart,
  Truck,
  Sparkles,
  Thermometer,
  Mic,
  CheckCircle2,
  Globe,
  Layers,
  ArrowUpRight,
  Menu,
  X,
  Radio,
  Zap,
  Activity,
  Award,
  ChevronDown
} from "lucide-react";
import "./landing.css";

export default function LandingPage({ onNavigateToAuth }) {
  const [activeRoleTab, setActiveRoleTab] = useState("farmer");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);

  const roleDetails = {
    farmer: {
      tag: "For Growers & Producers",
      title: "Direct Access to Wholesale Buyers with Zero Middlemen",
      description:
        "List your seasonal harvest in seconds, receive direct transparent purchase orders from verified retail buyers, and enjoy guaranteed payment settlements with automated transport pickup.",
      image: "/images/harvest_produce_fresh.jpg",
      imageAlt: "Fresh organic farm harvest crate",
      badgeClass: "farmer",
      highlights: [
        "Eliminate predatory middleman commission cuts completely",
        "Set your fair market prices or accept verified purchase bids",
        "AgriAI Multilingual Voice assistant for hands-free listing in Tamil & English",
        "Automated cold-chain transport pickup scheduled directly to your farm gate",
        "Instant digital escrow payment released immediately upon buyer delivery"
      ],
      ctaText: "Login as Farmer",
      actionRole: "farmer"
    },
    buyer: {
      tag: "For Wholesale, Retailers & Markets",
      title: "Direct Farm Sourcing with Total Batch Freshness & Traceability",
      description:
        "Source premium, farm-fresh produce directly from registered growers. Review verified crop conditions, track cold-chain temperature from field to store, and lock in reliable seasonal contracts.",
      image: "/images/hero_smart_farm.jpg",
      imageAlt: "Sustainable smart farm crop fields",
      badgeClass: "buyer",
      highlights: [
        "Direct procurement from vetted, geotagged organic and commercial farms",
        "Continuous IoT cold-chain temperature verification for optimal shelf-life",
        "Publish bulk custom crop procurement requirements to all regional growers",
        "Transparent quality inspection checklist prior to order dispatch",
        "Simplified digital invoicing, milestone payments, and purchase order tracking"
      ],
      ctaText: "Login as Buyer",
      actionRole: "buyer"
    },
    transporter: {
      tag: "For Fleets & Independent Logistics",
      title: "Optimized Agricultural Haulage with IoT Cold-Chain Assured",
      description:
        "Access high-paying agricultural haul requests matching your refrigerated truck capacity. Minimize empty deadhead miles with intelligent route aggregation and automated proof of delivery.",
      image: "/images/smart_logistics_truck.jpg",
      imageAlt: "Electric refrigerated agricultural transport truck",
      badgeClass: "transporter",
      highlights: [
        "Immediate broadcast notifications for newly confirmed harvest orders",
        "Integrated IoT telemetry monitoring vehicle humidity and refrigeration",
        "Turn-by-turn farm-to-warehouse route optimization reducing transit fuel",
        "Rapid digital gate-in / gate-out delivery verification without paper manifests",
        "Guaranteed trip compensation released directly upon verified delivery"
      ],
      ctaText: "Login as Transporter",
      actionRole: "transporter"
    }
  };

  const currentRole = roleDetails[activeRoleTab];

  const faqs = [
    {
      q: "How does AgriConnect eliminate agricultural middleman fees?",
      a: "AgriConnect connects growers directly with supermarkets, wholesale aggregators, and institutional buyers through a transparent digital bidding and order platform. Contracts are created directly between farm and buyer, with no hidden commissions."
    },
    {
      q: "How does cold-chain IoT tracking protect fresh produce?",
      a: "Every registered transporter vehicle and transit container is equipped with real-time temperature and humidity sensors. Both farmers and buyers can monitor environmental conditions live, ensuring perishable crops stay fresh."
    },
    {
      q: "Can farmers use AgriConnect using local voice dialects?",
      a: "Yes! AgriConnect includes an integrated AgriAI Voice Assistant supporting Tamil and English voice commands. Growers can check market demand, create listings, and check order statuses completely hands-free."
    },
    {
      q: "How are payments handled securely?",
      a: "Orders are secured through digital escrow. When a buyer places an order, payment is reserved. Once the produce is inspected and verified at delivery, funds are instantly disbursed to the farmer and transporter."
    }
  ];

  return (
    <div className="landingWrapper">
      {/* Subtle Ambient Background Glows */}
      <div className="landingAmbientGlow1" />
      <div className="landingAmbientGlow2" />

      {/* ==================== 1. TOP NAVBAR ==================== */}
      <header className="landingNav">
        <div className="landingContainer">
          <div className="landingNavInner">
            {/* Brand */}
            <div
              className="landingBrand"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="landingBrandIcon">
                <Leaf size={24} />
              </div>
              <div className="landingBrandText">
                <span className="landingBrandTitle">AGRICONNECT</span>
                <span className="landingBrandTagline">Smart Agri Ecosystem</span>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="landingNavLinks">
              <a
                href="#ecosystem"
                className="landingNavLink"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("ecosystem")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Ecosystem
              </a>
              <a
                href="#innovations"
                className="landingNavLink"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("innovations")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Innovations
              </a>
              <a
                href="#journey"
                className="landingNavLink"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("journey")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                How It Works
              </a>
              <a
                href="#faq"
                className="landingNavLink"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                FAQs
              </a>
            </nav>

            {/* Actions: Dedicated Login Button & Registration */}
            <div className="landingNavActions">
              <button
                type="button"
                className="btnNavSecondary"
                onClick={() => onNavigateToAuth("register")}
                title="Create a new farmer, buyer, or transporter account"
              >
                Register
              </button>

              {/* DEDICATED SEPARATE BUTTON TO ROUTE TO LOGIN SECTION */}
              <button
                type="button"
                id="landingNavLoginBtn"
                className="btnNavLoginPrimary"
                onClick={() => onNavigateToAuth("login")}
                title="Route directly to Login section"
              >
                <LogIn size={16} />
                <span>Sign In / Login</span>
              </button>

              <button
                type="button"
                className="mobileMenuToggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: "rgba(7, 23, 15, 0.98)",
            padding: "20px 24px",
            borderBottom: "1px solid var(--landing-border)",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >
          <a
            href="#ecosystem"
            style={{ color: "#fff", textDecoration: "none", fontSize: "16px" }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Ecosystem
          </a>
          <a
            href="#innovations"
            style={{ color: "#fff", textDecoration: "none", fontSize: "16px" }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Innovations
          </a>
          <a
            href="#journey"
            style={{ color: "#fff", textDecoration: "none", fontSize: "16px" }}
            onClick={() => setMobileMenuOpen(false)}
          >
            How It Works
          </a>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              style={{ flex: 1 }}
              className="btnNavSecondary"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToAuth("register");
              }}
            >
              Register
            </button>
            <button
              style={{ flex: 1 }}
              className="btnNavLoginPrimary"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToAuth("login");
              }}
            >
              <LogIn size={16} /> Login
            </button>
          </div>
        </div>
      )}

      {/* ==================== 2. HERO SECTION ==================== */}
      <section className="landingHeroSection">
        <div className="landingContainer">
          <div className="landingHeroGrid">
            {/* Left Content */}
            <div className="heroTextCol">
              <div className="heroTagBadge">
                <span className="heroTagPulse" />
                <span>Direct Farm-to-Table Supply Chain</span>
              </div>

              <h1 className="heroTitle">
                Next-Generation <br />
                <span className="heroHighlightGreen">Agricultural Marketplace</span> &amp; Cold Logistics
              </h1>

              <p className="heroDescription">
                Empowering growers with transparent direct buyer connections, end-to-end
                IoT temperature-monitored transit, and intelligent voice assistance — eliminating
                costly middlemen and post-harvest wastage.
              </p>

              {/* Action Cluster with Dedicated Login Button */}
              <div className="heroCtaCluster">
                <button
                  type="button"
                  id="heroPrimaryLoginBtn"
                  className="btnHeroLoginPrimary"
                  onClick={() => onNavigateToAuth("login")}
                >
                  <LogIn size={18} />
                  <span>Login to Portal</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  type="button"
                  className="btnHeroSecondary"
                  onClick={() => onNavigateToAuth("register")}
                >
                  <UserPlus size={18} />
                  <span>Create Free Account</span>
                </button>
              </div>

              {/* Qualitative Feature Badges */}
              <div className="heroQualitativePills">
                <div className="qualitativePill">
                  <ShieldCheck size={16} />
                  <span>Zero Middleman Markups</span>
                </div>
                <div className="qualitativePill">
                  <Thermometer size={16} />
                  <span>Active Cold-Chain Telemetry</span>
                </div>
                <div className="qualitativePill">
                  <Mic size={16} />
                  <span>AgriAI Multilingual Voice</span>
                </div>
                <div className="qualitativePill">
                  <Zap size={16} />
                  <span>Guaranteed Escrow Payouts</span>
                </div>
              </div>
            </div>

            {/* Right Media Display with AI Generated Image & Dynamic Badges */}
            <div className="heroVisualWrapper">
              <div className="heroImageCard">
                <img
                  src="/images/hero_smart_farm.jpg"
                  alt="AgriConnect Smart Agriculture and Terraced Farm Landscape"
                  className="heroMainImg"
                  loading="eager"
                />
                <div className="heroImageOverlay" />
              </div>

              {/* Floating Dynamic Badges */}
              <div className="floatingGlassBadge badgeTopRight">
                <div className="badgeIconCircle">
                  <Activity size={18} />
                </div>
                <div className="badgeTextGroup">
                  <span className="badgeTextPrimary">Fresh Harvest Verified</span>
                  <span className="badgeTextSecondary">Direct Gate-to-Store</span>
                </div>
              </div>

              <div className="floatingGlassBadge badgeBottomLeft">
                <div className="badgeIconCircle" style={{ color: "#f59e0b", background: "rgba(245, 158, 11, 0.18)" }}>
                  <Thermometer size={18} />
                </div>
                <div className="badgeTextGroup">
                  <span className="badgeTextPrimary">Refrigerated Transit</span>
                  <span className="badgeTextSecondary">IoT Monitored Route</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. ROLE-BASED ECOSYSTEM EXPLORER ==================== */}
      <section id="ecosystem" className="sectionRoles">
        <div className="landingContainer">
          <div className="sectionHeader">
            <span className="sectionSuperTitle">Tailored For Every Stakeholder</span>
            <h2 className="sectionHeading">A Unified Platform Connecting All Three Pillars</h2>
            <p className="sectionSubtext">
              Whether you cultivate the soil, supply commercial grocery networks, or operate cold transport,
              AgriConnect provides specialized, role-locked tooling for your workflow.
            </p>
          </div>

          {/* Interactive Role Switcher Tabs */}
          <div className="roleTabsContainer">
            <button
              type="button"
              className={`roleTabBtn ${activeRoleTab === "farmer" ? "active" : ""}`}
              onClick={() => setActiveRoleTab("farmer")}
            >
              <Sprout size={18} />
              <span>Farmers &amp; Producers</span>
            </button>
            <button
              type="button"
              className={`roleTabBtn ${activeRoleTab === "buyer" ? "active" : ""}`}
              onClick={() => setActiveRoleTab("buyer")}
            >
              <ShoppingCart size={18} />
              <span>Wholesale &amp; Retail Buyers</span>
            </button>
            <button
              type="button"
              className={`roleTabBtn ${activeRoleTab === "transporter" ? "active" : ""}`}
              onClick={() => setActiveRoleTab("transporter")}
            >
              <Truck size={18} />
              <span>Logistics &amp; Transporters</span>
            </button>
          </div>

          {/* Role Showcase Stage */}
          <div className="roleCardStage">
            <div className="roleContentCol">
              <span className={`roleBadgeNotice ${currentRole.badgeClass}`}>
                {currentRole.tag}
              </span>
              <h3>{currentRole.title}</h3>
              <p>{currentRole.description}</p>

              <div className="roleFeatureList">
                {currentRole.highlights.map((point, idx) => (
                  <div key={idx} className="roleFeatureItem">
                    <div className="roleCheckIcon">
                      <CheckCircle2 size={14} />
                    </div>
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="btnHeroLoginPrimary"
                  onClick={() => onNavigateToAuth("login")}
                >
                  <LogIn size={16} />
                  <span>{currentRole.ctaText}</span>
                </button>
                <button
                  type="button"
                  className="btnHeroSecondary"
                  onClick={() => onNavigateToAuth("register")}
                >
                  <span>Register Account</span>
                </button>
              </div>
            </div>

            <div className="roleMediaCol">
              <img
                src={currentRole.image}
                alt={currentRole.imageAlt}
                className="roleImg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4. BENTO GRID INNOVATIONS ==================== */}
      <section id="innovations" className="sectionBento">
        <div className="landingContainer">
          <div className="sectionHeader">
            <span className="sectionSuperTitle">Platform Innovations</span>
            <h2 className="sectionHeading">Smart Technology Solving Traditional Agriculture Bottlenecks</h2>
            <p className="sectionSubtext">
              Built from the ground up to address real agricultural challenges: post-harvest spoilage,
              unequal market access, and unpredictable shipping logistics.
            </p>
          </div>

          <div className="bentoGrid">
            {/* Bento Card 1: Cold-Chain Telemetry */}
            <div className="bentoCard bentoSpan2">
              <div className="bentoIconBadge">
                <Thermometer size={24} />
              </div>
              <h4>Real-Time IoT Cold-Chain Preservation</h4>
              <p>
                Continuous environmental sensor logging inside registered vehicles and storage depots.
                Both growers and buyers receive instant threshold alerts if compartment temperatures deviate,
                safeguarding crop shelf life and freshness.
              </p>
              <div className="bentoTagList">
                <span className="bentoTag">Live Temperature &amp; Humidity</span>
                <span className="bentoTag">Trip Telemetry</span>
                <span className="bentoTag">Spoilage Prevention</span>
                <span className="bentoTag">Zero Cold-Break Guarantee</span>
              </div>
            </div>

            {/* Bento Card 2: AgriAI Voice Assistant */}
            <div className="bentoCard">
              <div className="bentoIconBadge gold">
                <Mic size={24} />
              </div>
              <h4>AgriAI Voice Assistant</h4>
              <p>
                Hands-free field assistant designed for rural farmers. Speak naturally in Tamil or English
                to check current wholesale market demand, list fresh harvests, or confirm dispatch.
              </p>
              <div className="bentoTagList">
                <span className="bentoTag">Tamil &amp; English Voice</span>
                <span className="bentoTag">Hands-Free In Field</span>
                <span className="bentoTag">Instant Crop Query</span>
              </div>
            </div>

            {/* Bento Card 3: Direct Fair Marketplace */}
            <div className="bentoCard">
              <div className="bentoIconBadge blue">
                <Sprout size={24} />
              </div>
              <h4>Direct Transparent Pricing</h4>
              <p>
                Open market rate visibility across regions. Farmers post their harvest with desired rates,
                while verified commercial buyers place direct binding orders without agent commissions.
              </p>
              <div className="bentoTagList">
                <span className="bentoTag">Zero Intermediary Fees</span>
                <span className="bentoTag">Fair Value Realization</span>
              </div>
            </div>

            {/* Bento Card 4: Intelligent Route Optimization */}
            <div className="bentoCard bentoSpan2">
              <div className="bentoIconBadge">
                <Truck size={24} />
              </div>
              <h4>Intelligent Farm Fleet &amp; Route Aggregation</h4>
              <p>
                Multi-point pickup clustering connects regional farms with bulk transport loads. Transporters
                benefit from higher capacity utilization, while smallholder farmers gain access to affordable
                refrigerated freight.
              </p>
              <div className="bentoTagList">
                <span className="bentoTag">Load Clustering</span>
                <span className="bentoTag">Reduced Carbon Footprint</span>
                <span className="bentoTag">Automated Waypoint Dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 5. INTERACTIVE PROCESS TIMELINE ==================== */}
      <section id="journey" className="sectionProcess">
        <div className="landingContainer">
          <div className="sectionHeader">
            <span className="sectionSuperTitle">Seamless Process</span>
            <h2 className="sectionHeading">From Soil to Shelf in Four Direct Steps</h2>
            <p className="sectionSubtext">
              A frictionless transparent cycle eliminating paper trails, price uncertainty, and delayed transit.
            </p>
          </div>

          <div className="processStepsGrid">
            <div className="processStepCard">
              <div className="stepNumberBadge">1</div>
              <h5>Harvest Listing</h5>
              <p>
                Growers post seasonal crop availability, grade, quantity, and preferred pickup date via web or voice.
              </p>
            </div>

            <div className="processStepCard">
              <div className="stepNumberBadge">2</div>
              <h5>Direct Buyer Order</h5>
              <p>
                Wholesale and retail buyers review verified produce batches, agree on fair terms, and place secured orders.
              </p>
            </div>

            <div className="processStepCard">
              <div className="stepNumberBadge">3</div>
              <h5>Cold Transit Haul</h5>
              <p>
                Matched refrigerated transporter arrives for farm gate pickup with active IoT sensor monitoring throughout transit.
              </p>
            </div>

            <div className="processStepCard">
              <div className="stepNumberBadge">4</div>
              <h5>Delivery &amp; Settlement</h5>
              <p>
                Fresh produce is verified upon store arrival, automatically unlocking instant digital escrow payments to all parties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 6. FREQUENTLY ASKED QUESTIONS ==================== */}
      <section id="faq" style={{ padding: "80px 0" }}>
        <div className="landingContainer" style={{ maxWidth: "840px" }}>
          <div className="sectionHeader">
            <span className="sectionSuperTitle">Got Questions?</span>
            <h2 className="sectionHeading">Frequently Asked Questions</h2>
            <p className="sectionSubtext">
              Everything you need to know about navigating the AgriConnect ecosystem.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {faqs.map((faq, index) => {
              const isOpen = faqOpen === index;
              return (
                <div
                  key={index}
                  style={{
                    background: "rgba(16, 44, 28, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "14px",
                    overflow: "hidden",
                    transition: "all 0.2s ease"
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setFaqOpen(isOpen ? null : index)}
                    style={{
                      width: "100%",
                      padding: "20px 24px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "none",
                      border: "none",
                      color: "#fff",
                      fontSize: "16px",
                      fontWeight: 650,
                      textAlign: "left"
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.25s ease",
                        color: "#34d399",
                        flexShrink: 0
                      }}
                    />
                  </button>
                  {isOpen && (
                    <div
                      style={{
                        padding: "0 24px 20px",
                        color: "#94a3b8",
                        fontSize: "14px",
                        lineHeight: 1.65,
                        borderTop: "1px solid rgba(255, 255, 255, 0.04)"
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== 7. CALL TO ACTION SECTION ==================== */}
      <section className="sectionCta">
        <div className="landingContainer">
          <div className="ctaCardBox">
            <h2>Ready to Transform Your Agricultural Operations?</h2>
            <p>
              Join thousands of forward-thinking farmers, commercial retailers, and transport fleets
              leveraging direct smart contracts and real-time cold-chain visibility.
            </p>

            <div className="ctaBtnCluster">
              {/* DEDICATED SEPARATE BUTTON TO ROUTE TO LOGIN SECTION */}
              <button
                type="button"
                id="ctaBottomLoginBtn"
                className="btnCtaLoginPrimary"
                onClick={() => onNavigateToAuth("login")}
              >
                <LogIn size={18} />
                <span>Sign In / Login to Portal</span>
              </button>

              <button
                type="button"
                className="btnCtaRegisterSecondary"
                onClick={() => onNavigateToAuth("register")}
              >
                <UserPlus size={18} />
                <span>Create Free Account</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 8. FOOTER ==================== */}
      <footer className="landingFooter">
        <div className="landingContainer">
          <div className="footerGrid">
            <div className="footerCol footerColBrand">
              <div className="landingBrand">
                <div className="landingBrandIcon">
                  <Leaf size={22} />
                </div>
                <div className="landingBrandText">
                  <span className="landingBrandTitle">AGRICONNECT</span>
                  <span className="landingBrandTagline">Smart Agri Ecosystem</span>
                </div>
              </div>
              <p>
                Bridging agricultural producers and commercial buyers with direct digital contracts,
                IoT cold-chain telemetry, and voice-assisted field operations.
              </p>
            </div>

            <div className="footerCol">
              <h6>Role Portals</h6>
              <ul className="footerLinks">
                <li>
                  <button type="button" onClick={() => onNavigateToAuth("login")}>
                    Farmer Portal
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigateToAuth("login")}>
                    Buyer Marketplace
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigateToAuth("login")}>
                    Transporter Fleet
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigateToAuth("login")}>
                    Administrative Access
                  </button>
                </li>
              </ul>
            </div>

            <div className="footerCol">
              <h6>Innovations</h6>
              <ul className="footerLinks">
                <li>
                  <a href="#innovations">Cold-Chain IoT</a>
                </li>
                <li>
                  <a href="#innovations">AgriAI Voice Engine</a>
                </li>
                <li>
                  <a href="#ecosystem">Direct Fair Pricing</a>
                </li>
                <li>
                  <a href="#journey">Automated Settlement</a>
                </li>
              </ul>
            </div>

            <div className="footerCol">
              <h6>Get Started</h6>
              <ul className="footerLinks">
                <li>
                  <button
                    type="button"
                    style={{ fontWeight: 700, color: "#34d399" }}
                    onClick={() => onNavigateToAuth("login")}
                  >
                    Go to Login &rarr;
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigateToAuth("register")}>
                    Register New Account
                  </button>
                </li>
                <li>
                  <a href="#faq">Help &amp; Documentation</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footerBottom">
            <div>&copy; {new Date().getFullYear()} AgriConnect Platform. All rights reserved.</div>
            <div style={{ display: "flex", gap: "20px" }}>
              <span>Role-Secured System</span>
              <span>Encrypted Cold-Chain Telemetry</span>
              <span>Direct Farm Fair-Trade</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
