package hyperlocal.example.hyperlocal.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import hyperlocal.example.hyperlocal.model.Booking;
import hyperlocal.example.hyperlocal.model.User;
import hyperlocal.example.hyperlocal.model.Worker;
import hyperlocal.example.hyperlocal.repository.BookingRepository;
import hyperlocal.example.hyperlocal.repository.UserRepository;
import hyperlocal.example.hyperlocal.repository.WorkerRepository;
import hyperlocal.example.hyperlocal.repository.ServiceRepository;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final WorkerRepository workerRepository;
    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;

    public AdminService(
            UserRepository userRepository,
            WorkerRepository workerRepository,
            BookingRepository bookingRepository,
            ServiceRepository serviceRepository) {

        this.userRepository = userRepository;
        this.workerRepository = workerRepository;
        this.bookingRepository = bookingRepository;
        this.serviceRepository = serviceRepository;
    }

    public Map<String, Object> getStats() {

        List<User> users = userRepository.findAll();

        long customers = users.stream()
                .filter(user -> "customer".equalsIgnoreCase(user.getRole()))
                .count();

        long providers = users.stream()
                .filter(user -> "provider".equalsIgnoreCase(user.getRole()))
                .count();

        long admins = users.stream()
                .filter(user -> "admin".equalsIgnoreCase(user.getRole()))
                .count();

        Map<String, Object> stats = new HashMap<>();

        stats.put("totalUsers", users.size());
        stats.put("totalCustomers", customers);
        stats.put("totalProviders", providers);
        stats.put("totalAdmins", admins);
        stats.put("totalWorkers", workerRepository.count());
        stats.put("totalServices", serviceRepository.count());
        stats.put("totalBookings", bookingRepository.count());

        return stats;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<Worker> getAllProviders() {
        return workerRepository.findAll();
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<hyperlocal.example.hyperlocal.model.Service> getAllServices() {
        return serviceRepository.findAll();
    }
}