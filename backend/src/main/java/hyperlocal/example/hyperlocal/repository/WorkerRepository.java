package hyperlocal.example.hyperlocal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import hyperlocal.example.hyperlocal.model.Worker;

public interface WorkerRepository extends JpaRepository<Worker, Long> {

    List<Worker> findByServiceIgnoreCase(String service);
}