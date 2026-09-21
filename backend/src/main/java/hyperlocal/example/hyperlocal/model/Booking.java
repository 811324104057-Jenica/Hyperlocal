package hyperlocal.example.hyperlocal.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long customerId;
    private Long workerId;
    private Long serviceId;

    private LocalDate bookingDate;
    private LocalTime bookingTime;

    private String address;
    private String status;
    private double totalPrice;
    private LocalDateTime createdAt;

    /*
     * Customer's current location.
     * These values are sent by the frontend and
     * used by the backend to calculate the price.
     */
    @Transient
    private double customerLatitude;

    @Transient
    private double customerLongitude;

    /*
     * Runtime calculated distance.
     * Not stored in database.
     */
    @Transient
    private double calculatedDistance;

    public Booking() {
    }

    public Long getId() {
        return id;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public Long getWorkerId() {
        return workerId;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public LocalTime getBookingTime() {
        return bookingTime;
    }

    public String getAddress() {
        return address;
    }

    public String getStatus() {
        return status;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public double getCustomerLatitude() {
        return customerLatitude;
    }

    public double getCustomerLongitude() {
        return customerLongitude;
    }

    public double getCalculatedDistance() {
        return calculatedDistance;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public void setWorkerId(Long workerId) {
        this.workerId = workerId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public void setBookingTime(LocalTime bookingTime) {
        this.bookingTime = bookingTime;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setCustomerLatitude(double customerLatitude) {
        this.customerLatitude = customerLatitude;
    }

    public void setCustomerLongitude(double customerLongitude) {
        this.customerLongitude = customerLongitude;
    }

    public void setCalculatedDistance(double calculatedDistance) {
        this.calculatedDistance = calculatedDistance;
    }
}

