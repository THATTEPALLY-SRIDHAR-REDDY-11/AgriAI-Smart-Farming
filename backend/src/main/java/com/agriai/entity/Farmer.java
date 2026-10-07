package com.agriai.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "farmers")
public class Farmer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    private String phone;
    private String location;
    private String farmDetails;

    public Farmer() {}

    public Farmer(Long id, Long userId, String phone, String location, String farmDetails) {
        this.id = id;
        this.userId = userId;
        this.phone = phone;
        this.location = location;
        this.farmDetails = farmDetails;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getFarmDetails() { return farmDetails; }
    public void setFarmDetails(String farmDetails) { this.farmDetails = farmDetails; }

    public static FarmerBuilder builder() { return new FarmerBuilder(); }

    public static class FarmerBuilder {
        private Long id;
        private Long userId;
        private String phone;
        private String location;
        private String farmDetails;

        public FarmerBuilder id(Long id) { this.id = id; return this; }
        public FarmerBuilder userId(Long userId) { this.userId = userId; return this; }
        public FarmerBuilder phone(String phone) { this.phone = phone; return this; }
        public FarmerBuilder location(String location) { this.location = location; return this; }
        public FarmerBuilder farmDetails(String farmDetails) { this.farmDetails = farmDetails; return this; }

        public Farmer build() {
            return new Farmer(id, userId, phone, location, farmDetails);
        }
    }
}
