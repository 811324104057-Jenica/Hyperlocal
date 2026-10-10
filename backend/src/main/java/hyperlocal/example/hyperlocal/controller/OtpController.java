package hyperlocal.example.hyperlocal.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hyperlocal.example.hyperlocal.model.OtpRequest;
import hyperlocal.example.hyperlocal.service.OtpService;

@RestController
@RequestMapping("/api/otp")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class OtpController {

    private final OtpService otpService;

    public OtpController(OtpService otpService) {
        this.otpService = otpService;
    }

    @PostMapping("/send")
    public String sendOtp(
            @RequestBody OtpRequest request) {

        otpService.sendRegistrationOtp(
                request.getEmail()
        );

        return "OTP sent successfully to your email.";
    }

    @PostMapping("/verify")
    public String verifyOtp(
            @RequestBody OtpRequest request) {

        otpService.verifyRegistrationOtp(
                request.getEmail(),
                request.getOtp()
        );

        return "Email verified successfully.";
    }
}