import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProviderDashboard.css";

function ProviderDashboard() {
    const [bookings, setBookings] = useState([]);
    const [customerDetails, setCustomerDetails] = useState({});
    const [serviceDetails, setServiceDetails] = useState({});
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const workerId = user?.workerId || user?.id;

    useEffect(() => {
        if (workerId) {
            fetchBookings();
        } else {
            setLoading(false);
        }
    }, [workerId]);

    const fetchBookings = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/bookings/worker/${workerId}`
            );

            const bookingData = response.data;

            setBookings(bookingData);

            const customerIds = [
                ...new Set(
                    bookingData
                        .map((booking) => booking.customerId)
                        .filter((id) => id)
                ),
            ];

            const serviceIds = [
                ...new Set(
                    bookingData
                        .map((booking) => booking.serviceId)
                        .filter((id) => id)
                ),
            ];

            const customerResponses = await Promise.all(
                customerIds.map((customerId) =>
                    axios.get(
                        `http://localhost:8080/api/bookings/customer-details/${customerId}`
                    )
                )
            );

            const serviceResponses = await Promise.all(
                serviceIds.map((serviceId) =>
                    axios.get(
                        `http://localhost:8080/api/services/${serviceId}`
                    )
                )
            );

            const customerMap = {};

            customerResponses.forEach((response) => {
                const customer = response.data;
                customerMap[customer.id] = customer;
            });

            const serviceMap = {};

            serviceResponses.forEach((response) => {
                const service = response.data;
                serviceMap[service.id] = service;
            });

            setCustomerDetails(customerMap);
            setServiceDetails(serviceMap);

        } catch (error) {
            console.error(
                "Error fetching bookings:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

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

    const logout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    if (loading) {
        return (
            <div className="provider-dashboard">
                <div className="no-bookings">
                    <h3>
                        Loading bookings...
                    </h3>
                </div>
            </div>
        );
    }

    return (
        <div className="provider-dashboard">

            <header className="provider-header">
                <div>
                    <h1>
                        Provider Dashboard
                    </h1>

                    <p>
                        Manage your service bookings
                    </p>
                </div>

                <button onClick={logout}>
                    Logout
                </button>
            </header>

            <main className="provider-content">

                <div className="welcome-section">
                    <h2>
                        Welcome,{" "}
                        {user?.name ||
                            "Service Provider"}{" "}
                        👋
                    </h2>

                    <p>
                        Review and manage customer
                        booking requests.
                    </p>
                </div>

                <div className="booking-section">

                    <h2>
                        Booking Requests
                    </h2>

                    {bookings.length === 0 ? (
                        <div className="no-bookings">

                            <h3>
                                No bookings yet
                            </h3>

                            <p>
                                New customer booking
                                requests will appear here.
                            </p>

                        </div>
                    ) : (
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

                                    return (
                                        <div
                                            className="booking-card"
                                            key={
                                                booking.id
                                            }
                                        >

                                            <div className="booking-info">

                                                <h3>
                                                    Booking #
                                                    {
                                                        booking.id
                                                    }
                                                </h3>

                                                <p>
                                                    <strong>
                                                        Customer:
                                                    </strong>{" "}
                                                    {customer
                                                        ? customer.name
                                                        : "Loading customer..."}
                                                </p>

                                                {customer && (
                                                    <p>
                                                        <strong>
                                                            Email:
                                                        </strong>{" "}
                                                        {
                                                            customer.email
                                                        }
                                                    </p>
                                                )}

                                                <p>
                                                    <strong>
                                                        Service:
                                                    </strong>{" "}
                                                    {service
                                                        ? service.name
                                                        : "Loading service..."}
                                                </p>

                                                <p>
                                                    <strong>
                                                        Date:
                                                    </strong>{" "}
                                                    {
                                                        booking.bookingDate
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Time:
                                                    </strong>{" "}
                                                    {
                                                        booking.bookingTime
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Address:
                                                    </strong>{" "}
                                                    {
                                                        booking.address
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Price:
                                                    </strong>{" "}
                                                    ₹
                                                    {
                                                        booking.totalPrice
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Status:
                                                    </strong>{" "}

                                                    <span
                                                        className={`status ${booking.status?.toLowerCase()}`}
                                                    >
                                                        {
                                                            booking.status
                                                        }
                                                    </span>
                                                </p>

                                            </div>

                                            {booking.status ===
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
                                                        Accept
                                                    </button>

                                                    <button
                                                        className="reject-btn"
                                                        onClick={() =>
                                                            rejectBooking(
                                                                booking.id
                                                            )
                                                        }
                                                    >
                                                        Reject
                                                    </button>

                                                </div>
                                            )}

                                        </div>
                                    );
                                }
                            )}

                        </div>
                    )}

                </div>

            </main>

        </div>
    );
}

export default ProviderDashboard;