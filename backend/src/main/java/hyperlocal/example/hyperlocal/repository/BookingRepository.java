package hyperlocal.example.hyperlocal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import hyperlocal.example.hyperlocal.model.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomerId(Long customerId);

    List<Booking> findByWorkerId(Long workerId);
}