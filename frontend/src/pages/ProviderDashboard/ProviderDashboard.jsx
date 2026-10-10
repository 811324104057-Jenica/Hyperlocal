import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProviderDashboard.css";

function ProviderDashboard() {
    const [bookings, setBookings] = useState([]);
    const [customerDetails, setCustomerDetails] = useState({});
    const [serviceDetails, setServiceDetails] = useState({});
    const [providerService, setProviderService] = useState("");
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const workerId = user?.workerId || user?.id;

    /*
    =========================================================
    FETCH PROVIDER'S REGISTERED SERVICE
    =========================================================
    */

    const fetchProviderService = async () => {
        if (!workerId) {
            return;
        }

        try {
            const response = await axios.get(
                `http://localhost:8080/api/workers/${workerId}`
            );

            const worker = response.data;

            if (
                worker?.service &&
                worker.service.trim() &&
                worker.service.trim().toLowerCase() !== "pending"
            ) {
                setProviderService(worker.service.trim());
            } else {
                setProviderService("Service Provider");
            }

        } catch (error) {
            console.error(
                "Error fetching provider service:",
                error
            );

            setProviderService("Service Provider");
        }
    };

    /*
    =========================================================
    FETCH BOOKINGS
    =========================================================
    */

    const fetchBookings = async () => {
        if (!workerId) {
            setBookings([]);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(
                `http://localhost:8080/api/bookings/worker/${workerId}`
            );

            const bookingData = response.data || [];

            setBookings(bookingData);

            /*
            -------------------------
            CUSTOMER IDs
            -------------------------
            */

            const customerIds = [
                ...new Set(
                    bookingData
                        .map(
                            (booking) =>
                                booking.customerId
                        )
                        .filter((id) => id)
                ),
            ];

            /*
            -------------------------
            SERVICE IDs
            -------------------------
            */

            const serviceIds = [
                ...new Set(
                    bookingData
                        .map(
                            (booking) =>
                                booking.serviceId
                        )
                        .filter((id) => id)
                ),
            ];

            /*
            -------------------------
            CUSTOMER DETAILS
            -------------------------
            */

            const customerResponses =
                await Promise.all(
                    customerIds.map((customerId) =>
                        axios.get(
                            `http://localhost:8080/api/bookings/customer-details/${customerId}`
                        )
                    )
                );

            const customerMap = {};

            customerResponses.forEach(
                (response) => {
                    const customer =
                        response.data;

                    if (customer?.id) {
                        customerMap[
                            customer.id
                        ] = customer;
                    }
                }
            );

            setCustomerDetails(
                customerMap
            );

            /*
            -------------------------
            SERVICE DETAILS
            -------------------------
            */

            const serviceResponses =
                await Promise.all(
                    serviceIds.map((serviceId) =>
                        axios.get(
                            `http://localhost:8080/api/services/${serviceId}`
                        )
                    )
                );

            const serviceMap = {};

            serviceResponses.forEach(
                (response) => {
                    const service =
                        response.data;

                    if (service?.id) {
                        serviceMap[
                            service.id
                        ] = service;
                    }
                }
            );

            setServiceDetails(
                serviceMap
            );

        } catch (error) {
            console.error(
                "Error fetching bookings:",
                error
            );

            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    /*
    =========================================================
    INITIAL LOAD
    =========================================================
    */

    useEffect(() => {
        if (!workerId) {
            setLoading(false);
            return;
        }

        fetchProviderService();
        fetchBookings();
    }, [workerId]);

    /*
    =========================================================
    UPDATE BOOKING STATUS
    =========================================================
    */

    const updateBookingStatus = async (
        bookingId,
        action
    ) => {
        try {
            await axios.put(
                `http://localhost:8080/api/bookings/${bookingId}/${action}`
            );

            await fetchBookings();

        } catch (error) {
            console.error(
                "Error updating booking:",
                error
            );

            alert(
                "Unable to update booking. Please try again."
            );
        }
    };

    const acceptBooking = (bookingId) => {
        updateBookingStatus(
            bookingId,
            "accept"
        );
    };

    const rejectBooking = (bookingId) => {
        updateBookingStatus(
            bookingId,
            "reject"
        );
    };

    /*
    =========================================================
    LOGOUT
    =========================================================
    */

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        window.location.href = "/";
    };

    /*
    =========================================================
    STATISTICS
    =========================================================
    */

    const totalBookings =
        bookings.length;

    const pendingBookings =
        bookings.filter(
            (booking) =>
                booking.status?.toUpperCase() ===
                "PENDING"
        ).length;

    const acceptedBookings =
        bookings.filter(
            (booking) =>
                booking.status?.toUpperCase() ===
                "ACCEPTED"
        ).length;

    const completedBookings =
        bookings.filter(
            (booking) =>
                booking.status?.toUpperCase() ===
                "COMPLETED"
        ).length;

    /*
    =========================================================
    LOADING SCREEN
    =========================================================
    */

    if (loading) {
        return (
            <div className="provider-dashboard">
                <div className="loading-screen">
                    <div className="loading-card">

                        <div className="loading-spinner"></div>

                        <h3>
                            Loading dashboard...
                        </h3>

                        <p>
                            Fetching your bookings and service details.
                        </p>

                    </div>
                </div>
            </div>
        );
    }

    /*
    =========================================================
    MAIN DASHBOARD
    =========================================================
    */

    return (
        <div className="provider-dashboard">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="provider-header">

                <div className="brand-section">

                    <div className="brand-logo">
                        H
                    </div>

                    <div>
                        <h1>
                            Provider Dashboard
                        </h1>

                        <p>
                            Manage your services and bookings
                        </p>
                    </div>

                </div>

                <button
                    className="logout-btn"
                    onClick={logout}
                >
                    <span>↪</span>
                    Logout
                </button>

            </header>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="provider-content">


                {/* =================================================
                    WELCOME BANNER
                ================================================= */}

                <section className="welcome-banner">

                    <div className="welcome-left">

                        <div className="provider-avatar">
                            {user?.name
                                ? user.name
                                      .charAt(0)
                                      .toUpperCase()
                                : "P"}
                        </div>

                        <div>

                            <p className="welcome-small">
                                Welcome back
                            </p>

                            <h2>
                                {user?.name ||
                                    "Service Provider"}{" "}
                                👋
                            </h2>

                            <p className="welcome-description">
                                Here’s what’s happening with your
                                service bookings today.
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        REGISTERED SERVICE
                    ================================================= */}

                    <div className="provider-role">

                        <span className="role-icon">
                            🛠️
                        </span>

                        <div>

                            <span>
                                Registered Service
                            </span>

                            <strong>
                                {providerService ||
                                    "Loading..."}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    STATISTICS
                ================================================= */}

                <section className="stats-grid">


                    {/* TOTAL BOOKINGS */}

                    <div className="stat-card">

                        <div className="stat-icon purple">
                            📋
                        </div>

                        <div>

                            <span>
                                Total Bookings
                            </span>

                            <strong>
                                {totalBookings}
                            </strong>

                        </div>

                    </div>


                    {/* PENDING */}

                    <div className="stat-card">

                        <div className="stat-icon orange">
                            ⏳
                        </div>

                        <div>

                            <span>
                                Pending Requests
                            </span>

                            <strong>
                                {pendingBookings}
                            </strong>

                        </div>

                    </div>


                    {/* ACCEPTED */}

                    <div className="stat-card">

                        <div className="stat-icon green">
                            ✓
                        </div>

                        <div>

                            <span>
                                Accepted
                            </span>

                            <strong>
                                {acceptedBookings}
                            </strong>

                        </div>

                    </div>


                    {/* COMPLETED */}

                    <div className="stat-card">

                        <div className="stat-icon blue">
                            ⭐
                        </div>

                        <div>

                            <span>
                                Completed
                            </span>

                            <strong>
                                {completedBookings}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    BOOKING SECTION
                ================================================= */}

                <section className="booking-section">


                    <div className="section-header">

                        <div>

                            <h2>
                                Booking Requests
                            </h2>

                            <p>
                                Review and manage customer requests
                            </p>

                        </div>


                        {pendingBookings > 0 && (
                            <span className="request-count">
                                {pendingBookings} Pending
                            </span>
                        )}

                    </div>


                    {/* =================================================
                        NO BOOKINGS
                    ================================================= */}

                    {bookings.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                🗓️
                            </div>

                            <h3>
                                No bookings yet
                            </h3>

                            <p>
                                New customer booking requests
                                will appear here.
                            </p>

                        </div>

                    ) : (

                        /* =================================================
                           BOOKING LIST
                        ================================================= */

                        <div className="booking-list">

                            {bookings.map(
                                (booking) => {

                                    const customer =
                                        customerDetails[
                                            booking.customerId
                                        ];

                                    const service =
                                        serviceDetails[
                                            booking.serviceId
                                        ];

                                    const status =
                                        booking.status
                                            ?.toUpperCase();

                                    return (

                                        <div
                                            className="booking-card"
                                            key={booking.id}
                                        >


                                            {/* =================================================
                                                BOOKING TOP
                                            ================================================= */}

                                            <div className="booking-top">

                                                <div className="booking-number">

                                                    <span>
                                                        BOOKING
                                                    </span>

                                                    <strong>
                                                        #{booking.id}
                                                    </strong>

                                                </div>


                                                <span
                                                    className={`status ${
                                                        status?.toLowerCase() ||
                                                        "pending"
                                                    }`}
                                                >
                                                    {status ||
                                                        "PENDING"}
                                                </span>

                                            </div>


                                            {/* =================================================
                                                BOOKING MAIN DETAILS
                                            ================================================= */}

                                            <div className="booking-main">


                                                {/* CUSTOMER */}

                                                <div className="customer-section">

                                                    <div className="customer-avatar">

                                                        {customer?.name
                                                            ? customer.name
                                                                  .charAt(0)
                                                                  .toUpperCase()
                                                            : "C"}

                                                    </div>

                                                    <div>

                                                        <span className="field-label">
                                                            Customer
                                                        </span>

                                                        <h3>
                                                            {customer
                                                                ? customer.name
                                                                : "Loading customer..."}
                                                        </h3>

                                                        <p>
                                                            {customer?.email ||
                                                                "Customer details"}
                                                        </p>

                                                    </div>

                                                </div>


                                                {/* SERVICE */}

                                                <div className="booking-detail">

                                                    <div className="detail-icon">
                                                        🛠️
                                                    </div>

                                                    <div>

                                                        <span className="field-label">
                                                            Service
                                                        </span>

                                                        <strong>
                                                            {service?.name ||
                                                                providerService ||
                                                                "Service"}
                                                        </strong>

                                                    </div>

                                                </div>


                                                {/* DATE */}

                                                <div className="booking-detail">

                                                    <div className="detail-icon">
                                                        📅
                                                    </div>

                                                    <div>

                                                        <span className="field-label">
                                                            Date
                                                        </span>

                                                        <strong>
                                                            {booking.bookingDate ||
                                                                "Not specified"}
                                                        </strong>

                                                    </div>

                                                </div>


                                                {/* TIME */}

                                                <div className="booking-detail">

                                                    <div className="detail-icon">
                                                        🕐
                                                    </div>

                                                    <div>

                                                        <span className="field-label">
                                                            Time
                                                        </span>

                                                        <strong>
                                                            {booking.bookingTime ||
                                                                "Not specified"}
                                                        </strong>

                                                    </div>

                                                </div>


                                                {/* PRICE */}

                                                <div className="booking-price">

                                                    <span>
                                                        Total Price
                                                    </span>

                                                    <strong>
                                                        ₹
                                                        {booking.totalPrice ??
                                                            0}
                                                    </strong>

                                                </div>

                                            </div>


                                            {/* =================================================
                                                ADDRESS
                                            ================================================= */}

                                            {booking.address && (

                                                <div className="address-row">

                                                    <span>
                                                        📍
                                                    </span>

                                                    <p>
                                                        {booking.address}
                                                    </p>

                                                </div>

                                            )}


                                            {/* =================================================
                                                ACTIONS
                                            ================================================= */}

                                            {status ===
                                                "PENDING" && (

                                                <div className="booking-actions">

                                                    <button
                                                        className="accept-btn"
                                                        onClick={() =>
                                                            acceptBooking(
                                                                booking.id
                                                            )
                                                        }
                                                    >
                                                        ✓ Accept Booking
                                                    </button>

                                                    <button
                                                        className="reject-btn"
                                                        onClick={() =>
                                                            rejectBooking(
                                                                booking.id
                                                            )
                                                        }
                                                    >
                                                        ✕ Reject
                                                    </button>

                                                </div>

                                            )}

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default ProviderDashboard;