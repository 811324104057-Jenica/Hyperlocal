package hyperlocal.example.hyperlocal.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "workers")
public class Worker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String service;

    private double rating;

    @Transient
    private double distance;

    @Transient
    private double calculatedPrice;

    private double price;

    private int experience;

    private int completedJobs;

    private double latitude;

    private double longitude;

    public Worker() {
    }

    public Worker(
            String name,
            String service,
            double rating,
            double price,
            int experience,
            int completedJobs,
            double latitude,
            double longitude
    ) {
        this.name = name;
        this.service = service;
        this.rating = rating;
        this.price = price;
        this.experience = experience;
        this.completedJobs = completedJobs;
        this.latitude = latitude;
        this.longitude = longitude;
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

    public double getCalculatedPrice() {
        return calculatedPrice;
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

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
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

    public void setCalculatedPrice(double calculatedPrice) {
        this.calculatedPrice = calculatedPrice;
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

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
}