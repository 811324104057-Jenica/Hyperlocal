package hyperlocal.example.hyperlocal.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "workers")
public class Worker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String service;

    private double rating;

    private double distance;

    private double price;

    private int experience;

    private int completedJobs;

    public Worker() {
    }

    public Worker(
            String name,
            String service,
            double rating,
            double distance,
            double price,
            int experience,
            int completedJobs) {

        this.name = name;
        this.service = service;
        this.rating = rating;
        this.distance = distance;
        this.price = price;
        this.experience = experience;
        this.completedJobs = completedJobs;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getService() {
        return service;
    }

    public double getRating() {
        return rating;
    }

    public double getDistance() {
        return distance;
    }

    public double getPrice() {
        return price;
    }

    public int getExperience() {
        return experience;
    }

    public int getCompletedJobs() {
        return completedJobs;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setService(String service) {
        this.service = service;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setExperience(int experience) {
        this.experience = experience;
    }

    public void setCompletedJobs(int completedJobs) {
        this.completedJobs = completedJobs;
    }
}