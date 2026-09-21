package hyperlocal.example.hyperlocal.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import hyperlocal.example.hyperlocal.model.Worker;
import hyperlocal.example.hyperlocal.repository.WorkerRepository;

@Service
public class WorkerService {

    private final WorkerRepository workerRepository;

    // Distance pricing rule
    private static final double FREE_DISTANCE_KM = 5.0;
    private static final double EXTRA_CHARGE_PER_KM = 20.0;

    public WorkerService(
            WorkerRepository workerRepository) {

        this.workerRepository = workerRepository;
    }

    public List<Worker> getRecommendedWorkers(
            String service,
            double customerLatitude,
            double customerLongitude) {

        List<Worker> workers =
                workerRepository.findByServiceIgnoreCase(service);

        workers.removeIf(worker ->
                worker.getLatitude() == 0
                        && worker.getLongitude() == 0
        );

        for (Worker worker : workers) {

            // Calculate real-time distance
            double distance = calculateDistance(
                    customerLatitude,
                    customerLongitude,
                    worker.getLatitude(),
                    worker.getLongitude()
            );

            // Round distance to 2 decimal places
            double roundedDistance =
                    Math.round(distance * 100.0) / 100.0;

            worker.setDistance(roundedDistance);

            // Calculate price based on distance
            double calculatedPrice =
                    calculatePrice(
                            worker.getPrice(),
                            distance
                    );

            // Round calculated price to 2 decimal places
            calculatedPrice =
                    Math.round(calculatedPrice * 100.0) / 100.0;

            worker.setCalculatedPrice(calculatedPrice);
        }

        workers.sort(
                Comparator.comparingDouble(
                        Worker::getDistance
                )
                .thenComparing(
                        Comparator.comparingDouble(
                                Worker::getRating
                        ).reversed()
                )
                .thenComparingDouble(
                        Worker::getCalculatedPrice
                )
        );

        return workers.stream()
                .limit(3)
                .toList();
    }

    /**
     * Calculates the final service price.
     *
     * First 5 km are free.
     * Every additional kilometre costs ₹20.
     *
     * Example:
     *
     * Base price = ₹800
     * Distance = 10 km
     *
     * Extra distance = 10 - 5 = 5 km
     * Distance charge = 5 × ₹20 = ₹100
     *
     * Final price = ₹900
     */
    private double calculatePrice(
            double basePrice,
            double distanceKm) {

        if (distanceKm <= FREE_DISTANCE_KM) {
            return basePrice;
        }

        double extraDistance =
                distanceKm - FREE_DISTANCE_KM;

        double distanceCharge =
                extraDistance * EXTRA_CHARGE_PER_KM;

        return basePrice + distanceCharge;
    }

    /**
     * Calculates distance between customer and provider
     * using the Haversine formula.
     */
    private double calculateDistance(
            double latitude1,
            double longitude1,
            double latitude2,
            double longitude2) {

        final double EARTH_RADIUS_KM = 6371.0;

        double lat1 =
                Math.toRadians(latitude1);

        double lat2 =
                Math.toRadians(latitude2);

        double deltaLatitude =
                Math.toRadians(
                        latitude2 - latitude1
                );

        double deltaLongitude =
                Math.toRadians(
                        longitude2 - longitude1
                );

        double a =
                Math.sin(deltaLatitude / 2)
                        * Math.sin(deltaLatitude / 2)
                +
                Math.cos(lat1)
                        * Math.cos(lat2)
                        * Math.sin(deltaLongitude / 2)
                        * Math.sin(deltaLongitude / 2);

        double c =
                2 * Math.atan2(
                        Math.sqrt(a),
                        Math.sqrt(1 - a)
                );

        return EARTH_RADIUS_KM * c;
    }

    public Worker updateWorkerService(
            Long workerId,
            String service) {

        Worker worker =
                workerRepository
                        .findById(workerId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Worker not found"
                                )
                        );

        worker.setService(service);

        return workerRepository.save(worker);
    }

    public Worker updateWorkerLocation(
            Long workerId,
            double latitude,
            double longitude) {

        if (latitude < -90
                || latitude > 90) {

            throw new RuntimeException(
                    "Invalid latitude"
            );
        }

        if (longitude < -180
                || longitude > 180) {

            throw new RuntimeException(
                    "Invalid longitude"
            );
        }

        Worker worker =
                workerRepository
                        .findById(workerId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Worker not found"
                                )
                        );

        worker.setLatitude(latitude);
        worker.setLongitude(longitude);

        return workerRepository.save(worker);
    }

    public Worker updateWorkerDetails(
            Long workerId,
            double price,
            int experience) {

        if (price <= 0) {
            throw new RuntimeException(
                    "Price must be greater than zero"
            );
        }

        if (experience < 0) {
            throw new RuntimeException(
                    "Experience cannot be negative"
            );
        }

        Worker worker =
                workerRepository
                        .findById(workerId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Worker not found"
                                )
                        );

        worker.setPrice(price);
        worker.setExperience(experience);

        return workerRepository.save(worker);
    }

    public Worker getWorkerById(Long workerId) {

        return workerRepository
                .findById(workerId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Worker not found"
                        )
                );
    }
}