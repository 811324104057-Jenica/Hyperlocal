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

    /*
     * Pricing rule:
     *
     * First 5 km = FREE
     * Every km beyond 5 km = ₹20
     */
    private static final double FREE_DISTANCE_KM = 5.0;
    private static final double EXTRA_CHARGE_PER_KM = 20.0;

    public BookingService(
            BookingRepository bookingRepository,
            WorkerRepository workerRepository,
            UserRepository userRepository) {

        this.bookingRepository = bookingRepository;
        this.workerRepository = workerRepository;
        this.userRepository = userRepository;
    }

    public Booking createBooking(Booking booking) {

        if (booking.getWorkerId() == null) {
            throw new RuntimeException(
                    "Service provider is required"
            );
        }

        /*
         * Find the provider from the database.
         */
        Worker worker =
                workerRepository
                        .findById(booking.getWorkerId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Service provider not found"
                                )
                        );

        /*
         * Validate customer location.
         */
        double customerLatitude =
                booking.getCustomerLatitude();

        double customerLongitude =
                booking.getCustomerLongitude();

        if (customerLatitude < -90
                || customerLatitude > 90) {

            throw new RuntimeException(
                    "Invalid customer latitude"
            );
        }

        if (customerLongitude < -180
                || customerLongitude > 180) {

            throw new RuntimeException(
                    "Invalid customer longitude"
            );
        }

        /*
         * Provider location comes directly
         * from the database.
         */
        double workerLatitude =
                worker.getLatitude();

        double workerLongitude =
                worker.getLongitude();

        /*
         * Calculate REAL distance at booking time.
         */
        double distance =
                calculateDistance(
                        customerLatitude,
                        customerLongitude,
                        workerLatitude,
                        workerLongitude
                );

        /*
         * Calculate final price from the
         * provider's database price.
         */
        double basePrice =
                worker.getPrice();

        double finalPrice =
                calculatePrice(
                        basePrice,
                        distance
                );

        /*
         * Round distance and price.
         */
        distance =
                Math.round(
                        distance * 100.0
                ) / 100.0;

        finalPrice =
                Math.round(
                        finalPrice * 100.0
                ) / 100.0;

        /*
         * Store ONLY the backend-calculated
         * final price in the booking.
         *
         * The frontend's totalPrice is ignored.
         */
        booking.setTotalPrice(finalPrice);

        /*
         * Runtime distance can be returned
         * to frontend but is not stored in DB.
         */
        booking.setCalculatedDistance(distance);

        booking.setStatus("PENDING");

        booking.setCreatedAt(
                LocalDateTime.now()
        );

        return bookingRepository.save(booking);
    }

    /*
     * Calculate final service price.
     */
    private double calculatePrice(
            double basePrice,
            double distanceKm) {

        if (distanceKm <= FREE_DISTANCE_KM) {
            return basePrice;
        }

        double extraDistance =
                distanceKm - FREE_DISTANCE_KM;

        double distanceCharge =
                extraDistance *
                EXTRA_CHARGE_PER_KM;

        return basePrice + distanceCharge;
    }

    /*
     * Haversine formula.
     *
     * Calculates actual distance between
     * two latitude/longitude coordinates.
     */
    private double calculateDistance(
            double latitude1,
            double longitude1,
            double latitude2,
            double longitude2) {

        final double EARTH_RADIUS_KM =
                6371.0;

        double lat1 =
                Math.toRadians(latitude1);

        double lat2 =
                Math.toRadians(latitude2);

        double deltaLatitude =
                Math.toRadians(
                        latitude2 - latitude1
                );

        double deltaLongitude =
                Math.toRadians(
                        longitude2 - longitude1
                );

        double a =
                Math.sin(deltaLatitude / 2)
                        * Math.sin(deltaLatitude / 2)
                +
                Math.cos(lat1)
                        * Math.cos(lat2)
                        * Math.sin(deltaLongitude / 2)
                        * Math.sin(deltaLongitude / 2);

        double c =
                2 * Math.atan2(
                        Math.sqrt(a),
                        Math.sqrt(1 - a)
                );

        return EARTH_RADIUS_KM * c;
    }

    public List<Booking> getCustomerBookings(
            Long customerId) {

        return bookingRepository
                .findByCustomerId(customerId);
    }

    public List<Booking> getWorkerBookings(
            Long workerId) {

        return bookingRepository
                .findByWorkerId(workerId);
    }

    public Booking acceptBooking(
            Long bookingId) {

        Booking booking =
                bookingRepository
                        .findById(bookingId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found"
                                )
                        );

        booking.setStatus("CONFIRMED");

        return bookingRepository.save(
                booking
        );
    }

    public Booking rejectBooking(
            Long bookingId) {

        Booking booking =
                bookingRepository
                        .findById(bookingId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found"
                                )
                        );

        booking.setStatus("REJECTED");

        return bookingRepository.save(
                booking
        );
    }

    public Booking cancelBooking(
            Long bookingId) {

        Booking booking =
                bookingRepository
                        .findById(bookingId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found"
                                )
                        );

        if ("CANCELLED".equalsIgnoreCase(
                booking.getStatus())) {

            throw new RuntimeException(
                    "Booking is already cancelled"
            );
        }

        booking.setStatus("CANCELLED");

        return bookingRepository.save(
                booking
        );
    }

    public Worker getWorkerDetails(
            Long workerId) {

        return workerRepository
                .findById(workerId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Worker not found"
                        )
                );
    }

    public User getCustomerDetails(
            Long customerId) {

        return userRepository
                .findById(customerId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Customer not found"
                        )
                );
    }
}









