package hyperlocal.example.hyperlocal.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hyperlocal.example.hyperlocal.model.User;
import hyperlocal.example.hyperlocal.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        try {

            User user = authService.login(
                    request.getEmail(),
                    request.getPassword(),
                    request.getRole()
            );

            Map<String, Object> response = new HashMap<>();

            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());
            response.put("workerId", user.getWorkerId());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            Map<String, String> error = new HashMap<>();

            error.put("message", e.getMessage());

            return ResponseEntity
                    .badRequest()
                    .body(error);
        }
    }

    public static class LoginRequest {

        private String email;
        private String password;
        private String role;

        public LoginRequest() {
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }
}