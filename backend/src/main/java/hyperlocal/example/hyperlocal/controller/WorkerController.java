package hyperlocal.example.hyperlocal.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hyperlocal.example.hyperlocal.model.Worker;
import hyperlocal.example.hyperlocal.service.WorkerService;

@RestController
@RequestMapping("/api/workers")
@CrossOrigin(origins = "http://localhost:5173")
public class WorkerController {

    private final WorkerService workerService;

    public WorkerController(WorkerService workerService) {
        this.workerService = workerService;
    }

    @GetMapping("/recommendations")
    public List<Worker> getRecommendedWorkers(
            @RequestParam String service) {

        return workerService.getRecommendedWorkers(service);
    }
}