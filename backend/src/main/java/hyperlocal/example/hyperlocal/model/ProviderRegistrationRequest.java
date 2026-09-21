package hyperlocal.example.hyperlocal.model;

public class ProviderRegistrationRequest {

    private String name;
    private String email;
    private String password;
    private String service;
    private double price;
    private int experience;
    private int completedJobs;
    private double latitude;
    private double longitude;

    public ProviderRegistrationRequest() {
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getService() {
        return service;
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

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setService(String service) {
        this.service = service;
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