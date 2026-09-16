package hyperlocal.example.hyperlocal.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import hyperlocal.example.hyperlocal.model.Worker;
import hyperlocal.example.hyperlocal.repository.WorkerRepository;

@Service
public class WorkerService {

    private final WorkerRepository workerRepository;

    public WorkerService(WorkerRepository workerRepository) {
        this.workerRepository = workerRepository;
    }

    public List<Worker> getRecommendedWorkers(String service) {

        List<Worker> workers =
                workerRepository.findByServiceIgnoreCase(service);

        return workers.stream()
                .sorted(
                    Comparator.comparingDouble(
                        this::calculateScore
                    ).reversed()
                )
                .limit(3)
                .toList();
    }

    private double calculateScore(Worker worker) {

        // Rating = 50%
        double ratingScore =
                (worker.getRating() / 5.0) * 50;

        // Distance = 25%
        double distanceScore =
                Math.max(
                    0,
                    1 - worker.getDistance() / 10.0
                ) * 25;

        // Price = 15%
        double priceScore =
                Math.max(
                    0,
                    1 - worker.getPrice() / 1000.0
                ) * 15;

        // Experience = 10%
        double experienceScore =
                Math.min(
                    worker.getExperience() / 10.0,
                    1
                ) * 10;

        return ratingScore
                + distanceScore
                + priceScore
                + experienceScore;
    }
}