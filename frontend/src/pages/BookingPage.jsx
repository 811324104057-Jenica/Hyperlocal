import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BookingPage.css";

function BookingPage() {
  const selectedService =
    localStorage.getItem("selectedService") || "";

  const [service, setService] = useState(selectedService);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedWorker, setSelectedWorker] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [processing, setProcessing] = useState(false);

  const serviceIds = {
    Plumbing: 1,
    Electrical: 2,
    Cleaning: 3,
    Painting: 4,
    Repair: 5,
    Moving: 6,
  };

  useEffect(() => {
    const savedWorker =
      localStorage.getItem("selectedWorker");

    if (savedWorker) {
      setSelectedWorker(JSON.parse(savedWorker));
    }
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const getFinalPrice = () => {
    if (!selectedWorker) {
      return 0;
    }

    return (
      Number(selectedWorker.calculatedPrice) ||
      Number(selectedWorker.price) ||
      0
    );
  };

  const getBasePrice = () => {
    if (!selectedWorker) {
      return 0;
    }

    return Number(selectedWorker.price) || 0;
  };

  const getDistanceCharge = () => {
    const basePrice = getBasePrice();
    const finalPrice = getFinalPrice();

    return Math.max(
      0,
      finalPrice - basePrice
    );
  };

  const createBooking = async () => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user || !user.id) {
      throw new Error(
        "Please login as a customer first."
      );
    }

    if (!selectedWorker || !selectedWorker.id) {
      throw new Error(
        "Please select a service provider before booking."
      );
    }

    const booking = {
      customerId: user.id,
      workerId: selectedWorker.id,
      serviceId: serviceIds[service],
      bookingDate: date,
      bookingTime: time,
      address: address,
      totalPrice: getFinalPrice(),
    };

    const response = await axios.post(
      "http://localhost:8080/api/bookings",
      booking
    );

    return response.data;
  };

  const handleCashPayment = async (bookingId) => {
    const response = await axios.post(
      `http://localhost:8080/api/payments/cash/${bookingId}`
    );

    console.log(
      "Cash payment created:",
      response.data
    );

    return response.data;
  };

  const handleRazorpayPayment = async (bookingId) => {
    const razorpayLoaded =
      await loadRazorpayScript();

    if (!razorpayLoaded) {
      throw new Error(
        "Unable to load Razorpay checkout."
      );
    }

    const orderResponse = await axios.post(
      `http://localhost:8080/api/payments/razorpay/create/${bookingId}`
    );

    const payment = orderResponse.data;

    const razorpayKey =
      import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!razorpayKey) {
      throw new Error(
        "Razorpay test key is not configured yet."
      );
    }

    return new Promise((resolve, reject) => {
      const options = {
        key: razorpayKey,

        amount: Math.round(
          payment.amount * 100
        ),

        currency: "INR",

        name: "HyperLocal",

        description:
          "HyperLocal Service Booking",

        order_id:
          payment.razorpayOrderId,

        handler: async function (response) {
          try {
            const verifyResponse =
              await axios.post(
                "http://localhost:8080/api/payments/razorpay/verify",
                null,
                {
                  params: {
                    paymentId: payment.id,

                    razorpayPaymentId:
                      response.razorpay_payment_id,

                    razorpayOrderId:
                      response.razorpay_order_id,

                    razorpaySignature:
                      response.razorpay_signature,
                  },
                }
              );

            console.log(
              "Payment verified:",
              verifyResponse.data
            );

            resolve(
              verifyResponse.data
            );
          } catch (error) {
            console.error(
              "Payment verification error:",
              error.response?.data || error
            );

            reject(
              new Error(
                "Payment verification failed."
              )
            );
          }
        },

        modal: {
          ondismiss: function () {
            reject(
              new Error(
                "Payment was cancelled."
              )
            );
          },
        },

        theme: {
          color: "#7c3aed",
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Razorpay payment failed:",
            response.error
          );

          reject(
            new Error(
              response.error?.description ||
                "Payment failed."
            )
          );
        }
      );

      razorpay.open();
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!service || !date || !time || !address) {
      alert(
        "Please fill all required fields."
      );
      return;
    }

    if (!selectedWorker || !selectedWorker.id) {
      alert(
        "Please select a service provider before booking."
      );
      return;
    }

    if (processing) {
      return;
    }

    try {
      setProcessing(true);

      /*
       * STEP 1
       * Create booking in database
       * using the runtime-calculated price.
       */
      const booking = await createBooking();

      console.log(
        "Booking created:",
        booking
      );

      /*
       * STEP 2
       * Process selected payment method.
       */
      if (paymentMethod === "CASH") {
        await handleCashPayment(
          booking.id
        );

        localStorage.removeItem(
          "selectedService"
        );

        localStorage.removeItem(
          "selectedWorker"
        );

        alert(
          "Booking confirmed! You can pay cash to the service provider."
        );

        window.location.href =
          "/dashboard";

        return;
      }

      if (paymentMethod === "RAZORPAY") {
        await handleRazorpayPayment(
          booking.id
        );

        localStorage.removeItem(
          "selectedService"
        );

        localStorage.removeItem(
          "selectedWorker"
        );

        alert(
          "Payment successful! Your booking is confirmed."
        );

        window.location.href =
          "/dashboard";

        return;
      }

    } catch (error) {
      console.error(
        "Booking / Payment Error:",
        error.response?.data || error
      );

      alert(
        error.message ||
          "Booking or payment failed. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  const basePrice = getBasePrice();
  const distanceCharge = getDistanceCharge();
  const finalPrice = getFinalPrice();

  return (
    <div className="booking-page">

      <nav className="booking-navbar">

        <div className="booking-logo">
          HyperLocal
        </div>

        <button
          className="back-button"
          onClick={() =>
            (window.location.href =
              "/dashboard")
          }
        >
          ← Back to Dashboard
        </button>

      </nav>

      <main className="booking-container">

        <div className="booking-card">

          <div className="booking-header">

            <h1>
              Book a Service
            </h1>

            <p>
              Schedule a trusted local professional
            </p>

          </div>

          {selectedWorker && (
            <div className="selected-worker">

              <h3>
                Selected Professional
              </h3>

              <p>
                <strong>Name:</strong>{" "}
                {selectedWorker.name}
              </p>

              <p>
                <strong>Service:</strong>{" "}
                {selectedWorker.service}
              </p>

              <p>
                <strong>Rating:</strong>{" "}
                ⭐{" "}
                {Number(
                  selectedWorker.rating
                ).toFixed(1)}
              </p>

              <p>
                <strong>Distance:</strong>{" "}
                📍{" "}
                {Number(
                  selectedWorker.distance || 0
                ).toFixed(2)}{" "}
                km
              </p>

            </div>
          )}

          <form onSubmit={handleBooking}>

            <div className="form-group">

              <label>
                Select Service *
              </label>

              <select
                value={service}
                onChange={(e) =>
                  setService(e.target.value)
                }
              >

                <option value="">
                  Choose a service
                </option>

                <option value="Plumbing">
                  🔧 Plumbing
                </option>

                <option value="Electrical">
                  ⚡ Electrical
                </option>

                <option value="Cleaning">
                  🧹 Cleaning
                </option>

                <option value="Painting">
                  🎨 Painting
                </option>

                <option value="Repair">
                  🔨 Repair
                </option>

                <option value="Moving">
                  🚚 Moving
                </option>

              </select>

            </div>

            <div className="form-group">

              <label>
                Preferred Date *
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
              />

            </div>

            <div className="form-group">

              <label>
                Preferred Time *
              </label>

              <input
                type="time"
                value={time}
                onChange={(e) =>
                  setTime(e.target.value)
                }
              />

            </div>

            <div className="form-group">

              <label>
                Service Address *
              </label>

              <textarea
                rows="3"
                placeholder="Enter your complete address"
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
              />

            </div>

            <div className="form-group">

              <label>
                Additional Notes
              </label>

              <textarea
                rows="3"
                placeholder="Describe your requirements..."
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
              />

            </div>

            {/* BILL BREAKDOWN */}

            <div className="bill-section">

              <h3>
                🧾 Booking Bill
              </h3>

              <div className="bill-row">

                <span>
                  Base Service Price
                </span>

                <strong>
                  ₹{basePrice.toFixed(2)}
                </strong>

              </div>

              <div className="bill-row">

                <span>
                  Distance
                </span>

                <strong>
                  {Number(
                    selectedWorker?.distance || 0
                  ).toFixed(2)}{" "}
                  km
                </strong>

              </div>

              <div className="bill-row">

                <span>
                  Distance Charge
                </span>

                <strong>
                  ₹{distanceCharge.toFixed(2)}
                </strong>

              </div>

              <div className="bill-info">

                <span>
                  📍
                </span>

                <p>
                  First 5 km is free.
                  Every kilometre beyond
                  5 km adds ₹20.
                </p>

              </div>

              <div className="bill-divider"></div>

              <div className="bill-total">

                <span>
                  Total Amount
                </span>

                <strong>
                  ₹{finalPrice.toFixed(2)}
                </strong>

              </div>

            </div>

            {/* PAYMENT METHOD */}

            <div className="payment-section">

              <h3>
                Choose Payment Method
              </h3>

              <label
                className={`payment-option ${
                  paymentMethod === "CASH"
                    ? "selected"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="paymentMethod"
                  value="CASH"
                  checked={
                    paymentMethod === "CASH"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <span className="payment-icon">
                  💵
                </span>

                <span>
                  <strong>
                    Cash on Service
                  </strong>

                  <small>
                    Pay the service provider after the service
                  </small>
                </span>

              </label>

              <label
                className={`payment-option ${
                  paymentMethod === "RAZORPAY"
                    ? "selected"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="paymentMethod"
                  value="RAZORPAY"
                  checked={
                    paymentMethod ===
                    "RAZORPAY"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <span className="payment-icon">
                  💳
                </span>

                <span>
                  <strong>
                    Online Payment
                  </strong>

                  <small>
                    Secure payment using Razorpay
                  </small>
                </span>

              </label>

            </div>

            {/* FINAL TOTAL */}

            <div className="booking-total">

              <span>
                Amount to Pay
              </span>

              <strong>
                ₹{finalPrice.toFixed(2)}
              </strong>

            </div>

            <button
              type="submit"
              className="confirm-button"
              disabled={processing}
            >

              {processing
                ? "Processing..."
                : paymentMethod === "CASH"
                ? `Confirm Booking & Pay ₹${finalPrice.toFixed(2)} →`
                : `Proceed to Pay ₹${finalPrice.toFixed(2)} →`}

            </button>

          </form>

        </div>

      </main>

    </div>
  );
}

export default BookingPage;

