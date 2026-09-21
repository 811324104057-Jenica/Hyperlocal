package hyperlocal.example.hyperlocal.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import hyperlocal.example.hyperlocal.model.Payment;
import hyperlocal.example.hyperlocal.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // ==========================================
    // CREATE RAZORPAY ORDER
    // ==========================================

    @PostMapping("/razorpay/create/{bookingId}")
    public ResponseEntity<Payment> createRazorpayOrder(
            @PathVariable Long bookingId) {

        Payment payment =
                paymentService.createRazorpayOrder(bookingId);

        return ResponseEntity.ok(payment);
    }

    // ==========================================
    // VERIFY RAZORPAY PAYMENT
    // ==========================================

    @PostMapping("/razorpay/verify")
    public ResponseEntity<Payment> verifyRazorpayPayment(
            @RequestParam Long paymentId,
            @RequestParam String razorpayPaymentId,
            @RequestParam String razorpayOrderId,
            @RequestParam String razorpaySignature) {

        Payment payment =
                paymentService.verifyRazorpayPayment(
                        paymentId,
                        razorpayPaymentId,
                        razorpayOrderId,
                        razorpaySignature
                );

        return ResponseEntity.ok(payment);
    }

    // ==========================================
    // CREATE CASH PAYMENT
    // ==========================================

    @PostMapping("/cash/{bookingId}")
    public ResponseEntity<Payment> createCashPayment(
            @PathVariable Long bookingId) {

        Payment payment =
                paymentService.createCashPayment(bookingId);

        return ResponseEntity.ok(payment);
    }

    // ==========================================
    // MARK CASH PAYMENT AS PAID
    // ==========================================

    @PutMapping("/cash/{paymentId}/paid")
    public ResponseEntity<Payment> markCashPaymentAsPaid(
            @PathVariable Long paymentId) {

        Payment payment =
                paymentService.markCashPaymentAsPaid(paymentId);

        return ResponseEntity.ok(payment);
    }

    // ==========================================
    // GET PAYMENT BY BOOKING
    // ==========================================

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<Payment> getPaymentByBookingId(
            @PathVariable Long bookingId) {

        Payment payment =
                paymentService.getPaymentByBookingId(bookingId);

        return ResponseEntity.ok(payment);
    }
}