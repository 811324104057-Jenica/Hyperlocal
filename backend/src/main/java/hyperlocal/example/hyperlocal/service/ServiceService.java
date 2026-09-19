package hyperlocal.example.hyperlocal.service;

import java.util.List;

import org.springframework.stereotype.Service;

import hyperlocal.example.hyperlocal.repository.ServiceRepository;

@Service
public class ServiceService {

    private final ServiceRepository serviceRepository;

    public ServiceService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    public List<hyperlocal.example.hyperlocal.model.Service> getAllServices() {
        return serviceRepository.findAll();
    }

    public hyperlocal.example.hyperlocal.model.Service getServiceById(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
    }
}