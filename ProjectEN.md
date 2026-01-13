Here is the definitive **README.md** in English. It consolidates all the context from the meetings, the messy CSV analysis, the Product Owner's logic, and the technical decisions we've made.

You can copy and paste this directly into the root of your repository.

***

# 🏠 Real State Admin System

> **Listing Management & Drip Campaign Automation System**

## 📖 Overview

This project was initiated to solve a critical operational bottleneck for **Eric's Realty**: the management of property listings using disorganized spreadsheets ("messy data") and manual email processes.

The goal is to centralize all listings into a normalized database, enable management via a modern CRUD Dashboard, and—most importantly—implement a **Weekly Cycle Logic** to protect the client's data exclusivity against competitors while automating marketing.

---

## ⚙️ Core Business Logic: "The Cycle"

This is the kernel of the system. The client **DOES NOT** send all listings to subscribers at once. He uses a manual rotation strategy.

### 1. Manual Assignment (The Input)
There is no automatic algorithm to group properties. The client (Eric) acts as a **"Curator."** When creating or editing a property, he subjectively decides which group a property belongs to in order to ensure an attractive "mix" of deals (e.g., balancing luxury homes with fixer-uppers).
*   **Group 1 (Week 1)**
*   **Group 2 (Week 2)**
*   **Group 3 (Week 3)**

### 2. The Scheduler (The Trigger)
The system acts as a Scheduler that checks the current date.
*   **1st of the Month:** System sends listings assigned to **Week 1**.
*   **15th of the Month:** System sends listings assigned to **Week 2**.
*   **30th of the Month:** System sends listings assigned to **Week 3**.
*(Note: These trigger dates are configurable via the Settings panel).*

### 3. "Active" Status vs. "Cycle Group"
It is crucial to distinguish between these two fields:
*   **`is_active` (Boolean):**
    *   **TRUE:** The property is available on the market. In the email, it is visually highlighted with a red **"NEW LISTING"** badge.
    *   **FALSE:** The property is old or off-market. It is rendered as gray/archived.
*   **`week_group` (Integer):** Determines **WHEN** the email is sent, not whether the property is new or old.

---

### Configuration
*   **`cycle_schedules`**: Stores which day of the month (1-31) each group is triggered.

---

## 🚀 Features & Scope

### 1. "Cycle Manager" Dashboard
*   Main view with **Tabs** for Week 1, Week 2, and Week 3.
*   Allows the client to visualize the "mix" of properties scheduled for the next email blast.
*   Summary Cards (Total properties, Next scheduled send date).

### 2. Listings Management (CRUD)
*   **Create/Edit:** A robust form that handles data normalization.
    *   Selects for Zoning, Condition, and Type.
    *   Multi-select for Features.
    *   Switch to toggle "New/Active" status.
    *   Cycle Assignment Selector (1, 2, 3).
*   **List View:** Paginated Data Table with faceted filters (by Zoning, Condition, Cycle).

### 3. Scheduler Settings
*   A simple admin panel to change the trigger dates (e.g., changing Group 2's send date from the 15th to the 18th).

---

---

## 🗺️ Roadmap

- [x] **Phase 1:** Database Design & Business Logic Definition.
- [ ] **Phase 2:** Frontend Construction (Dashboard, Forms, Tables).
- [ ] **Phase 3:** Next.js API Routes Integration (Backend).
- [ ] **Phase 4:** Cron Job / Scheduler development for emails.
- [ ] **Phase 5:** Email Service Integration (SMTP/Resend/SendGrid).