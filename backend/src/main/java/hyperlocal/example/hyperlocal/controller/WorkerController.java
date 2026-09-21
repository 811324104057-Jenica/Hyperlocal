package hyperlocal.example.hyperlocal.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hyperlocal.example.hyperlocal.model.Worker;
import hyperlocal.example.hyperlocal.service.WorkerService;

@RestController
@RequestMapping("/api/workers")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class WorkerController {

    private final WorkerService workerService;

    public WorkerController(
            WorkerService workerService) {

        this.workerService = workerService;
    }

    @GetMapping("/recommendations")
    public ResponseEntity<?> getRecommendations(

            @RequestParam String service,

            @RequestParam double latitude,

            @RequestParam double longitude) {

        try {

            if (latitude < -90
                    || latitude > 90) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Invalid latitude"
                        ));
            }

            if (longitude < -180
                    || longitude > 180) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Invalid longitude"
                        ));
            }

            List<Worker> workers =
                    workerService
                            .getRecommendedWorkers(
                                    service,
                                    latitude,
                                    longitude
                            );

            return ResponseEntity.ok(workers);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }

    @PutMapping("/{workerId}/service")
    public ResponseEntity<?> updateWorkerService(

            @PathVariable Long workerId,

            @RequestBody Map<String, String> request) {

        try {

            String service =
                    request.get("service");

            if (service == null
                    || service.trim().isEmpty()) {

                Map<String, String> error =
                        new HashMap<>();

                error.put(
                        "message",
                        "Service is required"
                );

                return ResponseEntity
                        .badRequest()
                        .body(error);
            }

            Worker worker =
                    workerService.updateWorkerService(
                            workerId,
                            service
                    );

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "message",
                    "Job role updated successfully"
            );

            response.put(
                    "workerId",
                    worker.getId()
            );

            response.put(
                    "service",
                    worker.getService()
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            Map<String, String> error =
                    new HashMap<>();

            error.put(
                    "message",
                    e.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .body(error);
        }
    }

    @PutMapping("/{workerId}/location")
    public ResponseEntity<?> updateWorkerLocation(

            @PathVariable Long workerId,

            @RequestBody Map<String, Double> request) {

        try {

            Double latitude =
                    request.get("latitude");

            Double longitude =
                    request.get("longitude");

            if (latitude == null
                    || longitude == null) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Latitude and longitude are required"
                        ));
            }

            Worker worker =
                    workerService.updateWorkerLocation(
                            workerId,
                            latitude,
                            longitude
                    );

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "message",
                    "Provider location updated successfully"
            );

            response.put(
                    "workerId",
                    worker.getId()
            );

            response.put(
                    "latitude",
                    worker.getLatitude()
            );

            response.put(
                    "longitude",
                    worker.getLongitude()
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }
    @PutMapping("/{workerId}/details")
public ResponseEntity<?> updateWorkerDetails(
        @PathVariable Long workerId,
        @RequestBody Map<String, Object> request) {

    try {

        Object priceValue = request.get("price");
        Object experienceValue = request.get("experience");

        if (priceValue == null || experienceValue == null) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Price and experience are required"
                            )
                    );
        }

        double price =
                Double.parseDouble(
                        priceValue.toString()
                );

        int experience =
                Integer.parseInt(
                        experienceValue.toString()
                );

        Worker worker =
                workerService.updateWorkerDetails(
                        workerId,
                        price,
                        experience
                );

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "message",
                "Provider details updated successfully"
        );

        response.put(
                "workerId",
                worker.getId()
        );

        response.put(
                "price",
                worker.getPrice()
        );

        response.put(
                "experience",
                worker.getExperience()
        );

        return ResponseEntity.ok(response);

    } catch (RuntimeException e) {

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                e.getMessage()
                        )
                );
    }
}
@GetMapping("/{workerId}")
public ResponseEntity<?> getWorkerById(
        @PathVariable Long workerId) {

    try {

        Worker worker =
                workerService.getWorkerById(workerId);

        return ResponseEntity.ok(worker);

    } catch (RuntimeException e) {

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                e.getMessage()
                        )
                );
    }
}
}