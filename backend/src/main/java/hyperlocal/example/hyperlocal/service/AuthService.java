package hyperlocal.example.hyperlocal.service;

import org.springframework.stereotype.Service;

import hyperlocal.example.hyperlocal.model.User;
import hyperlocal.example.hyperlocal.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User login(String email, String password, String role) {

        User user = userRepository
                .findByEmailAndRole(email, role)
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or role"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
}