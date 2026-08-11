# Smart Society Management System

## Database Design

The Smart Society Management System uses a relational MySQL database to manage residents, apartments, complaints, maintenance payments, visitors, amenities, bookings, notices, notifications, and administrative activities.

---

## 1. Database Modules

- User and Role Management
- Apartment and Resident Management
- Complaint Management
- Maintenance Payment Management
- Visitor Management
- Amenity Management
- Notice Management
- Notification Management
- Audit and Reporting

---

## 2. Users

Stores authentication and role information for all system users.

| Column | Type | Key |
|---|---|---|
| user_id | BIGINT | PK |
| name | VARCHAR(100) | |
| email | VARCHAR(150) | UNIQUE |
| password_hash | VARCHAR(255) | |
| phone | VARCHAR(15) | UNIQUE |
| role | VARCHAR(20) | |
| status | VARCHAR(20) | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### Roles

- RESIDENT
- SECURITY_GUARD
- ADMIN

---

## 3. Apartments

Stores apartment and flat details.

| Column | Type | Key |
|---|---|---|
| apartment_id | BIGINT | PK |
| block_name | VARCHAR(50) | |
| flat_number | VARCHAR(20) | UNIQUE |
| floor_number | INT | |
| apartment_type | VARCHAR(50) | |
| status | VARCHAR(20) | |
| created_at | TIMESTAMP | |

---

## 4. Residents

Stores resident information and apartment assignment.

| Column | Type | Key |
|---|---|---|
| resident_id | BIGINT | PK |
| user_id | BIGINT | FK |
| apartment_id | BIGINT | FK |
| first_name | VARCHAR(100) | |
| last_name | VARCHAR(100) | |
| emergency_contact | VARCHAR(15) | |
| created_at | TIMESTAMP | |

---

## 5. Complaints

Stores complaints raised by residents.

| Column | Type | Key |
|---|---|---|
| complaint_id | BIGINT | PK |
| resident_id | BIGINT | FK |
| category_id | BIGINT | FK |
| title | VARCHAR(150) | |
| description | TEXT | |
| priority | VARCHAR(20) | |
| status | VARCHAR(30) | |
| assigned_to | BIGINT | FK |
| created_at | TIMESTAMP | |
| resolved_at | TIMESTAMP | |

### Complaint Status

```text
OPEN -> ASSIGNED -> IN_PROGRESS -> RESOLVED -> CLOSED
```

---

## 6. Complaint Categories

Stores categories used for complaint classification.

| Column | Type | Key |
|---|---|---|
| category_id | BIGINT | PK |
| category_name | VARCHAR(100) | UNIQUE |
| description | TEXT | |
| status | VARCHAR(20) | |

Examples: Plumbing, Electrical, Cleaning, Security, Parking, Water Supply, Maintenance

---

## 7. Complaint History

Tracks complaint status changes.

| Column | Type | Key |
|---|---|---|
| history_id | BIGINT | PK |
| complaint_id | BIGINT | FK |
| old_status | VARCHAR(30) | |
| new_status | VARCHAR(30) | |
| changed_by | BIGINT | FK |
| remarks | VARCHAR(500) | |
| changed_at | TIMESTAMP | |

---

## 8. Maintenance Payments

Stores resident maintenance payment records.

| Column | Type | Key |
|---|---|---|
| payment_id | BIGINT | PK |
| resident_id | BIGINT | FK |
| apartment_id | BIGINT | FK |
| billing_month | VARCHAR(20) | |
| amount | DECIMAL(10,2) | |
| payment_method | VARCHAR(30) | |
| transaction_id | VARCHAR(100) | UNIQUE |
| payment_status | VARCHAR(20) | |
| payment_date | TIMESTAMP | |

### Payment Status

- PENDING
- SUCCESS
- FAILED
- REFUNDED

---

## 9. Visitors

Stores visitor registration and entry and exit details.

| Column | Type | Key |
|---|---|---|
| visitor_id | BIGINT | PK |
| resident_id | BIGINT | FK |
| visitor_name | VARCHAR(100) | |
| phone | VARCHAR(15) | |
| purpose | VARCHAR(150) | |
| vehicle_number | VARCHAR(30) | |
| qr_pass | VARCHAR(255) | UNIQUE |
| verification_status | VARCHAR(20) | |
| entry_time | TIMESTAMP | |
| exit_time | TIMESTAMP | |
| created_at | TIMESTAMP | |

---

## 10. Visitor Verification

Stores verification actions performed by security guards.

| Column | Type | Key |
|---|---|---|
| verification_id | BIGINT | PK |
| visitor_id | BIGINT | FK |
| guard_id | BIGINT | FK |
| verification_method | VARCHAR(30) | |
| status | VARCHAR(20) | |
| remarks | VARCHAR(500) | |
| verified_at | TIMESTAMP | |

---

## 11. Amenities

Stores society amenities available for booking.

| Column | Type | Key |
|---|---|---|
| amenity_id | BIGINT | PK |
| name | VARCHAR(100) | UNIQUE |
| description | TEXT | |
| location | VARCHAR(150) | |
| capacity | INT | |
| booking_fee | DECIMAL(10,2) | |
| opening_time | TIME | |
| closing_time | TIME | |
| status | VARCHAR(20) | |

Examples: Gym, Swimming Pool, Community Hall, Club House, Sports Court

---

## 12. Amenity Bookings

Stores resident amenity reservations.

| Column | Type | Key |
|---|---|---|
| booking_id | BIGINT | PK |
| amenity_id | BIGINT | FK |
| resident_id | BIGINT | FK |
| booking_date | DATE | |
| start_time | TIME | |
| end_time | TIME | |
| amount | DECIMAL(10,2) | |
| booking_status | VARCHAR(20) | |
| created_at | TIMESTAMP | |

### Booking Status

- PENDING
- CONFIRMED
- CANCELLED
- COMPLETED

> The system must prevent overlapping confirmed bookings for the same amenity.

---

## 13. Notices

Stores notices published by administrators.

| Column | Type | Key |
|---|---|---|
| notice_id | BIGINT | PK |
| admin_id | BIGINT | FK |
| title | VARCHAR(150) | |
| content | TEXT | |
| notice_type | VARCHAR(50) | |
| priority | VARCHAR(20) | |
| publish_date | TIMESTAMP | |
| expiry_date | TIMESTAMP | |
| status | VARCHAR(20) | |

### Notice Types

- GENERAL
- MAINTENANCE
- EVENT
- EMERGENCY
- SECURITY

---

## 14. Notifications

Stores system notifications.

| Column | Type | Key |
|---|---|---|
| notification_id | BIGINT | PK |
| user_id | BIGINT | FK |
| title | VARCHAR(150) | |
| message | VARCHAR(500) | |
| notification_type | VARCHAR(50) | |
| is_read | BOOLEAN | |
| read_at | TIMESTAMP | |
| created_at | TIMESTAMP | |

---

## 15. Audit Logs

Tracks important user and administrator actions.

| Column | Type | Key |
|---|---|---|
| audit_id | BIGINT | PK |
| user_id | BIGINT | FK |
| entity_type | VARCHAR(50) | |
| entity_id | BIGINT | |
| action | VARCHAR(100) | |
| old_value | TEXT | |
| new_value | TEXT | |
| ip_address | VARCHAR(45) | |
| created_at | TIMESTAMP | |

### Example Actions

- USER_LOGIN
- COMPLAINT_CREATED
- COMPLAINT_UPDATED
- PAYMENT_COMPLETED
- VISITOR_VERIFIED
- AMENITY_BOOKED
- NOTICE_PUBLISHED

---

## 16. Entity Relationships

```
USERS
  |
  |---> RESIDENTS ---> APARTMENTS
  |       |
  |       |---> COMPLAINTS ---> COMPLAINT_HISTORY
  |       |       ^
  |       |       |
  |       |   COMPLAINT_CATEGORIES
  |       |
  |       |---> MAINTENANCE_PAYMENTS
  |       |
  |       |---> VISITORS ---> VISITOR_VERIFICATION
  |       |
  |       |--> AMENITY_BOOKINGS <.. AMENITIES
  |
  |---> NOTIFICATIONS
  |
  |--> AUDIT_LOGS
```

---

## 17. Main Business Flows

### Complaint Flow

```
Resident -> Raise Complaint -> Select Category -> AI Classification (Optional)
    |
Admin Assignment -> In Progress -> Resolved -> Closed
```

### Payment Flow

```
Maintenance Bill -> Resident Payment -> Payment Processing
    |
SUCCESS / FAILED -> Transaction Recorded -> Payment History
```

### Visitor Flow

```
Visitor Registration -> QR Pass Generation -> Security Verification
    |
Entry Recorded -> Visitor Exit -> Exit Time Recorded
```

### Amenity Booking Flow

```
Select Amenity -> Select Date and Time -> Check Availability
    |
Available?
  +--+
 NO    YES
  |    |
Reject  Confirm Booking
```

---

## 18. Security

The application follows this architecture:

```
React.js -> Axios -> REST API -> Spring Boot -> Spring Security + JWT -> JPA / Hibernate -> MySQL
```

### Security Features

- JWT authentication
- Role-based access control
- Password hashing
- Input validation
- API authorization
- Foreign key constraints
- Transaction management
- Audit logging

---

## 19. Database Design Principles

### Normalization

Tables are separated according to business entities to reduce data duplication and maintain consistency.

### Primary Keys

Every major table has a unique primary key.

### Foreign Keys

Foreign keys maintain referential integrity between related entities.

### Unique Constraints

- USERS.email
- USERS.phone
- APARTMENTS.flat_number
- MAINTENANCE_PAYMENTS.transaction_id
- VISITORS.qr_pass
- AMENITIES.name

### Auditability

Important operations are recorded through:

- COMPLAINT_HISTORY
- AUDIT_LOGS

---

## 20. Core Business Rules

1. Every user must have a valid role.
2. Every resident must be associated with an apartment.
3. A resident can raise multiple complaints.
4. Complaint status changes must be recorded.
5. Only authorized admins can manage complaints.
6. Every maintenance payment belongs to a resident and apartment.
7. Successful payments require a unique transaction ID.
8. Visitors must be verified before entry.
9. Security guards manage visitor verification.
10. Every visitor entry should have an entry time.
11. Every visitor exit should have an exit time.
12. Amenity bookings cannot overlap.
13. Only admins can publish official notices.
14. Important events generate notifications.
15. Sensitive data must be protected.
16. Administrative actions must be auditable.
17. AI complaint classification is optional and can be overridden by an admin.

---

## 21. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| HTTP Client | Axios |
| UI | Bootstrap / Tailwind CSS |
| Backend | Java, Spring Boot |
| Security | Spring Security, JWT |
| ORM | JPA, Hibernate |
| Database | MySQL |
| Testing | JUnit 5, Mockito |
| API Documentation | Swagger / OpenAPI |
| Build | Maven |
| Version Control | Git, GitHub |
| CI/CD | GitHub Actions |
| Deployment | Render / Railway + Vercel / Netlify |

---

## 22. Future Enhancements

- Mobile application
- Push notifications
- Online payment gateway
- Advanced AI complaint classification
- Emergency alerts
- Parking and vehicle management
- Community voting
- Smart lock integration
- CCTV integration
- IoT-based energy monitoring
