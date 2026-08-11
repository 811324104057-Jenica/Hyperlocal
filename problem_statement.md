# Problem Statement

## 1. Title

**Smart Hyperlocal Services Marketplace with AI-Based Provider Matching and Dynamic Pricing**

## 2. Domain

**Service Marketplace / Local Services / E-Commerce**

## 3. Who is the user?

The system has three primary users:

1. **Customer**
2. **Service Provider**
3. **Admin**

Customers can search for local services, compare service providers, book services, make payments, track bookings, and provide ratings and reviews.

Service Providers can manage their profiles, services, pricing, availability, bookings, and earnings.

Admins can manage customers, service providers, services, bookings, payments, complaints, reviews, and system reports.

## 4. What problem are we solving?

Customers often struggle to find reliable local service professionals such as plumbers, electricians, cleaners, AC technicians, appliance repair technicians, and painters.

Existing methods such as phone calls, personal references, social media, and local listings make it difficult to:

* Find trustworthy service providers
* Compare prices and ratings
* Identify providers who are currently available
* Find providers close to the customer's location
* Estimate service costs
* Track bookings and service status
* Handle complaints and disputes

Service providers also face difficulties in reaching nearby customers, managing bookings, maintaining availability, and building a trusted digital presence.

## 5. Proposed Solution

The **Smart Hyperlocal Services Marketplace** is a web application that connects customers with verified local service providers.

The system uses location, availability, rating, pricing, service history, and customer preferences to recommend suitable providers.

### Key Features

* Secure login and role-based access
* Customer and service-provider management
* Service category management
* Location-based provider discovery
* Smart provider recommendation
* Provider verification
* Service availability management
* Online service booking
* Booking status tracking
* Dynamic price estimation
* Mock/online payment management
* Digital invoices
* Ratings and reviews
* Complaint and dispute management
* Notifications and alerts
* Customer and provider dashboards
* Admin dashboard and reports
* AI-based provider matching as an enhancement

## 6. Core Entities / Database Tables

* Users
* Customers
* Service Providers
* Services
* Service Categories
* Provider Services
* Locations
* Availability
* Bookings
* Payments
* Reviews
* Complaints
* Notifications
* Invoices

## 7. User Roles & Permissions

### Customer

* Register and login
* Manage profile
* Search for services
* View nearby service providers
* Compare providers based on rating, price, distance, and availability
* Receive recommended providers
* Book services
* Track booking status
* Make payments
* View invoices
* View booking and payment history
* Rate and review providers
* Raise complaints

### Service Provider

* Register and manage profile
* Submit verification details
* Add and manage services
* Set service pricing
* Define service location/coverage area
* Manage availability
* Accept or reject bookings
* Update service status
* View customer details for confirmed bookings
* View earnings and completed services
* View ratings and reviews

### Admin

* Manage customers
* Verify and manage service providers
* Manage service categories and services
* Monitor bookings
* Manage payments and invoices
* Manage complaints and disputes
* Monitor ratings and reviews
* Publish notifications
* Suspend fraudulent or inactive accounts
* Generate service, booking, payment, and provider reports
* View system analytics

## 8. Success Criteria

The project will be considered successful if it provides:

* Secure authentication and role-based authorization
* Successful customer and provider registration
* Verified service-provider management
* Location-based service-provider discovery
* Smart provider recommendation
* Conflict-free service booking
* Accurate booking status tracking
* Service price estimation
* Secure payment record management
* Digital invoice generation
* Rating and review functionality
* Complaint and dispute management
* Admin dashboard and reporting
* Secure and consistent database records
* Responsive web interface
* Successful deployment on a public URL

## 9. Out of Scope

The following features are outside the initial project scope:

* Physical cash collection
* Direct management of service-provider employees
* Hardware-based GPS tracking devices
* CCTV integration
* Facial recognition
* Biometric verification
* Government-level identity verification
* Fully automated real-world payment settlement
* Native Android/iOS applications
* Advanced robotic/IoT service automation
* Real-time video consultation
* Full-scale financial/accounting management

## 10. Chosen Track

**Java (Spring Boot)**

### Technology Stack

**Frontend:** React.js, Axios, Bootstrap/Tailwind CSS

**Backend:** Java, Spring Boot, Spring Security, JWT, JPA, Hibernate

**Database:** MySQL

**AI/Recommendation:** Java-based weighted recommendation algorithm / optional Python microservice for ML enhancement

**Maps & Location:** Google Maps API / Mapbox API

**Testing:** JUnit 5, Mockito

**API Documentation:** Swagger/OpenAPI

**Build:** Maven

**Version Control:** Git/GitHub

**CI/CD:** GitHub Actions

**Deployment:** Render/Railway + Vercel/Netlify