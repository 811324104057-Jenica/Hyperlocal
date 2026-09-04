package hyperlocal.example.hyperlocal.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import hyperlocal.example.hyperlocal.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailAndRole(String email, String role);
}