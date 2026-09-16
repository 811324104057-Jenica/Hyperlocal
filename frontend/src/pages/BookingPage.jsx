import React, { useState } from "react";
import "./BookingPage.css";

function BookingPage() {
  const selectedService =
    localStorage.getItem("selectedService") || "";

  const [service, setService] = useState(selectedService);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const handleBooking = (e) => {
    e.preventDefault();

    if (!service || !date || !time || !address) {
      alert("Please fill all required fields.");
      return;
    }

    const booking = {
      service,
      date,
      time,
      address,
      notes,
      status: "Pending",
    };

    localStorage.setItem(
      "booking",
      JSON.stringify(booking)
    );

    localStorage.removeItem("selectedService");

    alert("Booking request submitted successfully!");

    window.location.href = "/dashboard";
  };

  return (
    <div className="booking-page">

      <nav className="booking-navbar">

        <div className="booking-logo">
          HyperLocal
        </div>

        <button
          className="back-button"
          onClick={() =>
            (window.location.href = "/dashboard")
          }
        >
          ← Back to Dashboard
        </button>

      </nav>

      <main className="booking-container">

        <div className="booking-card">

          <div className="booking-header">
            <h1>Book a Service</h1>

            <p>
              Schedule a trusted local professional
            </p>
          </div>

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

            <button
              type="submit"
              className="confirm-button"
            >
              Confirm Booking →
            </button>

          </form>

        </div>

      </main>

    </div>
  );
}

export default BookingPage;