package hyperlocal.example.hyperlocal.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import hyperlocal.example.hyperlocal.model.Service;

public interface ServiceRepository extends JpaRepository<Service, Long> {
}