package hyperlocal.example.hyperlocal.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import hyperlocal.example.hyperlocal.model.Booking;
import hyperlocal.example.hyperlocal.model.User;
import hyperlocal.example.hyperlocal.model.Worker;
import hyperlocal.example.hyperlocal.repository.BookingRepository;
import hyperlocal.example.hyperlocal.repository.UserRepository;
import hyperlocal.example.hyperlocal.repository.WorkerRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final WorkerRepository workerRepository;
    private final UserRepository userRepository;

    public BookingService(
            BookingRepository bookingRepository,
            WorkerRepository workerRepository,
            UserRepository userRepository) {

        this.bookingRepository = bookingRepository;
        this.workerRepository = workerRepository;
        this.userRepository = userRepository;
    }

    public Booking createBooking(Booking booking) {
        booking.setStatus("PENDING");
        booking.setCreatedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    public List<Booking> getCustomerBookings(Long customerId) {
        return bookingRepository.findByCustomerId(customerId);
    }

    public List<Booking> getWorkerBookings(Long workerId) {
        return bookingRepository.findByWorkerId(workerId);
    }

    public Booking acceptBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("CONFIRMED");

        return bookingRepository.save(booking);
    }

    public Booking rejectBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("REJECTED");

        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            throw new RuntimeException("Booking is already cancelled");
        }

        booking.setStatus("CANCELLED");

        return bookingRepository.save(booking);
    }

    public Worker getWorkerDetails(Long workerId) {
        return workerRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));
    }

    public User getCustomerDetails(Long customerId) {
        return userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }
}