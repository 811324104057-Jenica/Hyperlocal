package hyperlocal.example.hyperlocal.service;

import org.springframework.stereotype.Service;

import hyperlocal.example.hyperlocal.model.ProviderRegistrationRequest;
import hyperlocal.example.hyperlocal.model.RegistrationRequest;
import hyperlocal.example.hyperlocal.model.User;
import hyperlocal.example.hyperlocal.model.Worker;
import hyperlocal.example.hyperlocal.repository.UserRepository;
import hyperlocal.example.hyperlocal.repository.WorkerRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final WorkerRepository workerRepository;

    public AuthService(
            UserRepository userRepository,
            WorkerRepository workerRepository) {

        this.userRepository = userRepository;
        this.workerRepository = workerRepository;
    }

    public User login(
            String email,
            String password,
            String role) {

        User user = userRepository
                .findByEmailAndRole(email, role)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or role"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException(
                    "Invalid password");
        }

        return user;
    }

    public User registerCustomer(
            RegistrationRequest request) {

        validateBasicRegistration(request);

        if (userRepository
                .findByEmailAndRole(
                        request.getEmail(),
                        "customer")
                .isPresent()) {

            throw new RuntimeException(
                    "A customer with this email already exists");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole("customer");
        user.setWorkerId(null);

        return userRepository.save(user);
    }

    public User registerAdmin(
            RegistrationRequest request) {

        validateBasicRegistration(request);

        if (userRepository
                .findByEmailAndRole(
                        request.getEmail(),
                        "admin")
                .isPresent()) {

            throw new RuntimeException(
                    "An admin with this email already exists");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole("admin");
        user.setWorkerId(null);

        return userRepository.save(user);
    }

    public User registerProvider(
            ProviderRegistrationRequest request) {

        if (request.getName() == null
                || request.getName().trim().isEmpty()) {

            throw new RuntimeException(
                    "Name is required");
        }

        if (request.getEmail() == null
                || request.getEmail().trim().isEmpty()) {

            throw new RuntimeException(
                    "Email is required");
        }

        if (request.getPassword() == null
                || request.getPassword().trim().isEmpty()) {

            throw new RuntimeException(
                    "Password is required");
        }

        if (request.getService() == null
                || request.getService().trim().isEmpty()) {

            throw new RuntimeException(
                    "Service is required");
        }

        if (request.getPrice() <= 0) {

            throw new RuntimeException(
                    "Price must be greater than zero");
        }

        if (request.getExperience() < 0) {

            throw new RuntimeException(
                    "Experience cannot be negative");
        }

        if (request.getLatitude() < -90
                || request.getLatitude() > 90) {

            throw new RuntimeException(
                    "Invalid provider latitude");
        }

        if (request.getLongitude() < -180
                || request.getLongitude() > 180) {

            throw new RuntimeException(
                    "Invalid provider longitude");
        }

        if (userRepository
                .findByEmailAndRole(
                        request.getEmail(),
                        "provider")
                .isPresent()) {

            throw new RuntimeException(
                    "A provider with this email already exists");
        }

        Worker worker = new Worker();

        worker.setName(request.getName());
        worker.setService(request.getService());
        worker.setRating(0);
        worker.setDistance(0);
        worker.setPrice(request.getPrice());
        worker.setExperience(request.getExperience());
        worker.setCompletedJobs(0);
        worker.setLatitude(request.getLatitude());
        worker.setLongitude(request.getLongitude());

        Worker savedWorker =
                workerRepository.save(worker);

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole("provider");
        user.setWorkerId(savedWorker.getId());

        return userRepository.save(user);
    }

    private void validateBasicRegistration(
            RegistrationRequest request) {

        if (request.getName() == null
                || request.getName().trim().isEmpty()) {

            throw new RuntimeException(
                    "Name is required");
        }

        if (request.getEmail() == null
                || request.getEmail().trim().isEmpty()) {

            throw new RuntimeException(
                    "Email is required");
        }

        if (request.getPassword() == null
                || request.getPassword().trim().isEmpty()) {

            throw new RuntimeException(
                    "Password is required");
        }

        if (!request.getEmail().contains("@")) {

            throw new RuntimeException(
                    "Please enter a valid email address");
        }

        if (request.getPassword().length() < 6) {

            throw new RuntimeException(
                    "Password must contain at least 6 characters");
        }
    }
}