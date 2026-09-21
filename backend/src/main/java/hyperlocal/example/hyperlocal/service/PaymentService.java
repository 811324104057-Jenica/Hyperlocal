package hyperlocal.example.hyperlocal.service;

import java.time.LocalDateTime;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

import hyperlocal.example.hyperlocal.model.Booking;
import hyperlocal.example.hyperlocal.model.Payment;
import hyperlocal.example.hyperlocal.repository.BookingRepository;
import hyperlocal.example.hyperlocal.repository.PaymentRepository;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public PaymentService(
            PaymentRepository paymentRepository,
            BookingRepository bookingRepository) {

        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    // ==============================
    // CREATE RAZORPAY ORDER
    // ==============================

    public Payment createRazorpayOrder(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        double amount = booking.getTotalPrice();

        if (amount <= 0) {
            throw new RuntimeException("Invalid booking amount");
        }

        try {

            RazorpayClient razorpayClient =
                    new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();

            orderRequest.put("amount", Math.round(amount * 100));
            orderRequest.put("currency", "INR");
            orderRequest.put(
                    "receipt",
                    "booking_" + bookingId
            );

            Order razorpayOrder =
                    razorpayClient.orders.create(orderRequest);

            Payment payment = new Payment();

            payment.setBookingId(bookingId);
            payment.setAmount(amount);
            payment.setPaymentMethod("RAZORPAY");
            payment.setPaymentStatus("CREATED");
            payment.setRazorpayOrderId(
                    razorpayOrder.get("id")
            );
            payment.setCreatedAt(LocalDateTime.now());

            return paymentRepository.save(payment);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to create Razorpay order: "
                            + e.getMessage()
            );
        }
    }

    // ==============================
    // VERIFY RAZORPAY PAYMENT
    // ==============================

    public Payment verifyRazorpayPayment(
            Long paymentId,
            String razorpayPaymentId,
            String razorpayOrderId,
            String razorpaySignature) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() ->
                        new RuntimeException("Payment not found"));

        try {

            JSONObject attributes = new JSONObject();

            attributes.put(
                    "razorpay_payment_id",
                    razorpayPaymentId
            );

            attributes.put(
                    "razorpay_order_id",
                    razorpayOrderId
            );

            attributes.put(
                    "razorpay_signature",
                    razorpaySignature
            );

            Utils.verifyPaymentSignature(
                    attributes,
                    razorpayKeySecret
            );

            payment.setRazorpayPaymentId(
                    razorpayPaymentId
            );

            payment.setRazorpayOrderId(
                    razorpayOrderId
            );

            payment.setRazorpaySignature(
                    razorpaySignature
            );

            payment.setPaymentStatus("PAID");

            payment.setPaidAt(LocalDateTime.now());

            Payment savedPayment =
                    paymentRepository.save(payment);

            Booking booking = bookingRepository
                    .findById(payment.getBookingId())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Booking not found"
                            ));

            booking.setStatus("CONFIRMED");

            bookingRepository.save(booking);

            return savedPayment;

        } catch (Exception e) {

            payment.setPaymentStatus("FAILED");

            paymentRepository.save(payment);

            throw new RuntimeException(
                    "Payment verification failed: "
                            + e.getMessage()
            );
        }
    }

    // ==============================
    // CASH PAYMENT
    // ==============================

    public Payment createCashPayment(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        Payment existingPayment =
                paymentRepository.findByBookingId(bookingId)
                        .orElse(null);

        if (existingPayment != null) {
            throw new RuntimeException(
                    "Payment already exists for this booking"
            );
        }

        Payment payment = new Payment();

        payment.setBookingId(bookingId);
        payment.setAmount(booking.getTotalPrice());
        payment.setPaymentMethod("CASH");
        payment.setPaymentStatus("CASH_PENDING");
        payment.setCreatedAt(LocalDateTime.now());

        return paymentRepository.save(payment);
    }

    // ==============================
    // MARK CASH PAYMENT AS PAID
    // ==============================

    public Payment markCashPaymentAsPaid(Long paymentId) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() ->
                        new RuntimeException("Payment not found"));

        if (!"CASH".equalsIgnoreCase(
                payment.getPaymentMethod())) {

            throw new RuntimeException(
                    "This is not a cash payment"
            );
        }

        payment.setPaymentStatus("PAID");
        payment.setPaidAt(LocalDateTime.now());

        Payment savedPayment =
                paymentRepository.save(payment);

        Booking booking = bookingRepository
                .findById(payment.getBookingId())
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        booking.setStatus("CONFIRMED");

        bookingRepository.save(booking);

        return savedPayment;
    }

    // ==============================
    // GET PAYMENT BY BOOKING
    // ==============================

    public Payment getPaymentByBookingId(Long bookingId) {

        return paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payment not found for booking"
                        ));
    }
}