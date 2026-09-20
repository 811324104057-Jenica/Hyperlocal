package hyperlocal.example.hyperlocal.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hyperlocal.example.hyperlocal.model.Booking;
import hyperlocal.example.hyperlocal.model.User;
import hyperlocal.example.hyperlocal.model.Worker;
import hyperlocal.example.hyperlocal.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    @GetMapping("/customer/{customerId}")
    public List<Booking> getCustomerBookings(
            @PathVariable Long customerId) {

        return bookingService.getCustomerBookings(customerId);
    }

    @GetMapping("/customer-details/{customerId}")
    public User getCustomerDetails(
            @PathVariable Long customerId) {

        return bookingService.getCustomerDetails(customerId);
    }

    @GetMapping("/worker/{workerId}")
    public List<Booking> getWorkerBookings(
            @PathVariable Long workerId) {

        return bookingService.getWorkerBookings(workerId);
    }

    @GetMapping("/worker-details/{workerId}")
    public Worker getWorkerDetails(
            @PathVariable Long workerId) {

        return bookingService.getWorkerDetails(workerId);
    }

    @PutMapping("/{bookingId}/accept")
    public Booking acceptBooking(
            @PathVariable Long bookingId) {

        return bookingService.acceptBooking(bookingId);
    }

    @PutMapping("/{bookingId}/reject")
    public Booking rejectBooking(
            @PathVariable Long bookingId) {

        return bookingService.rejectBooking(bookingId);
    }

    @PutMapping("/{bookingId}/cancel")
    public Booking cancelBooking(
            @PathVariable Long bookingId) {

        return bookingService.cancelBooking(bookingId);
    }
}