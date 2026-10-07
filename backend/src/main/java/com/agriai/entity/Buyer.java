package com.agriai.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "buyers")
public class Buyer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    private String phone;
    private String location;

    public Buyer() {}

    public Buyer(Long id, Long userId, String phone, String location) {
        this.id = id;
        this.userId = userId;
        this.phone = phone;
        this.location = location;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public static BuyerBuilder builder() { return new BuyerBuilder(); }

    public static class BuyerBuilder {
        private Long id;
        private Long userId;
        private String phone;
        private String location;

        public BuyerBuilder id(Long id) { this.id = id; return this; }
        public BuyerBuilder userId(Long userId) { this.userId = userId; return this; }
        public BuyerBuilder phone(String phone) { this.phone = phone; return this; }
        public BuyerBuilder location(String location) { this.location = location; return this; }

        public Buyer build() {
            return new Buyer(id, userId, phone, location);
        }
    }
}
