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

    private final OtpService otpService;

    public AuthService(
            UserRepository userRepository,
            WorkerRepository workerRepository,
            OtpService otpService) {

        this.userRepository = userRepository;
        this.workerRepository = workerRepository;
        this.otpService = otpService;
    }

    public User login(
            String email,
            String password,
            String role) {

        User user =
                userRepository
                        .findByEmailAndRole(email, role)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid email or role"
                                )
                        );

        if (!user.getPassword().equals(password)) {

            throw new RuntimeException(
                    "Invalid password"
            );
        }

        return user;
    }

    public User registerCustomer(
            RegistrationRequest request) {

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        if (!otpService.isEmailVerified(email)) {

            throw new RuntimeException(
                    "Please verify your email with OTP before registering."
            );
        }

        if (userRepository.findByEmail(email).isPresent()) {

            throw new RuntimeException(
                    "An account with this email already exists."
            );
        }

        if (request.getName() == null ||
                request.getName().trim().isEmpty()) {

            throw new RuntimeException(
                    "Name is required."
            );
        }

        if (request.getPassword() == null ||
                request.getPassword().length() < 6) {

            throw new RuntimeException(
                    "Password must contain at least 6 characters."
            );
        }

        User user = new User();

        user.setName(
                request.getName().trim()
        );

        user.setEmail(email);

        user.setPassword(
                request.getPassword()
        );

        user.setRole("customer");

        user.setWorkerId(null);

        return userRepository.save(user);
    }

    public User registerAdmin(
            RegistrationRequest request) {

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        if (userRepository.findByEmail(email).isPresent()) {

            throw new RuntimeException(
                    "An account with this email already exists."
            );
        }

        if (request.getName() == null ||
                request.getName().trim().isEmpty()) {

            throw new RuntimeException(
                    "Name is required."
            );
        }

        if (request.getPassword() == null ||
                request.getPassword().length() < 6) {

            throw new RuntimeException(
                    "Password must contain at least 6 characters."
            );
        }

        User user = new User();

        user.setName(
                request.getName().trim()
        );

        user.setEmail(email);

        user.setPassword(
                request.getPassword()
        );

        user.setRole("admin");

        user.setWorkerId(null);

        return userRepository.save(user);
    }

    public User registerProvider(
            ProviderRegistrationRequest request) {

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        if (!otpService.isEmailVerified(email)) {

            throw new RuntimeException(
                    "Please verify your email with OTP before registering."
            );
        }

        if (userRepository.findByEmail(email).isPresent()) {

            throw new RuntimeException(
                    "An account with this email already exists."
            );
        }

        if (request.getName() == null ||
                request.getName().trim().isEmpty()) {

            throw new RuntimeException(
                    "Name is required."
            );
        }

        if (request.getPassword() == null ||
                request.getPassword().length() < 6) {

            throw new RuntimeException(
                    "Password must contain at least 6 characters."
            );
        }

        if (request.getService() == null ||
                request.getService().trim().isEmpty()) {

            throw new RuntimeException(
                    "Service is required."
            );
        }

        if (request.getPrice() < 0) {

            throw new RuntimeException(
                    "Price cannot be negative."
            );
        }

        if (request.getExperience() < 0) {

            throw new RuntimeException(
                    "Experience cannot be negative."
            );
        }

        if (request.getLatitude() < -90 ||
                request.getLatitude() > 90) {

            throw new RuntimeException(
                    "Invalid latitude."
            );
        }

        if (request.getLongitude() < -180 ||
                request.getLongitude() > 180) {

            throw new RuntimeException(
                    "Invalid longitude."
            );
        }

        Worker worker = new Worker();

        worker.setName(
                request.getName().trim()
        );

        worker.setService(
                request.getService().trim()
        );

        worker.setRating(0);

        worker.setDistance(0);

        worker.setPrice(
                request.getPrice()
        );

        worker.setExperience(
                request.getExperience()
        );

        worker.setCompletedJobs(0);

        worker.setLatitude(
                request.getLatitude()
        );

        worker.setLongitude(
                request.getLongitude()
        );

        Worker savedWorker =
                workerRepository.save(worker);

        User user = new User();

        user.setName(
                request.getName().trim()
        );

        user.setEmail(email);

        user.setPassword(
                request.getPassword()
        );

        user.setRole("provider");

        user.setWorkerId(
                savedWorker.getId()
        );

        return userRepository.save(user);
    }
}