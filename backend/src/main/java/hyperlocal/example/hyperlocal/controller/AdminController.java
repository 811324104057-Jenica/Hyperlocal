package hyperlocal.example.hyperlocal.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hyperlocal.example.hyperlocal.model.Booking;
import hyperlocal.example.hyperlocal.model.User;
import hyperlocal.example.hyperlocal.model.Worker;
import hyperlocal.example.hyperlocal.service.AdminService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        return adminService.getStats();
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return adminService.getAllUsers();
    }

    @GetMapping("/providers")
    public List<Worker> getAllProviders() {
        return adminService.getAllProviders();
    }

    @GetMapping("/bookings")
    public List<Booking> getAllBookings() {
        return adminService.getAllBookings();
    }

    @GetMapping("/services")
    public List<hyperlocal.example.hyperlocal.model.Service> getAllServices() {
        return adminService.getAllServices();
    }
}