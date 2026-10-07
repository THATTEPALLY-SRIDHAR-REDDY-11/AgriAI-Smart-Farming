package com.agriai.dto;

public class DashboardStatsDto {
    private long totalProducts;
    private long pendingRequests;
    private long acceptedRequests;
    private long readyForPickupRequests;
    private long completedPurchases;
    private long totalAiPredictions;

    public DashboardStatsDto() {}

    public DashboardStatsDto(long totalProducts, long pendingRequests, long acceptedRequests, long readyForPickupRequests, long completedPurchases, long totalAiPredictions) {
        this.totalProducts = totalProducts;
        this.pendingRequests = pendingRequests;
        this.acceptedRequests = acceptedRequests;
        this.readyForPickupRequests = readyForPickupRequests;
        this.completedPurchases = completedPurchases;
        this.totalAiPredictions = totalAiPredictions;
    }

    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }

    public long getPendingRequests() { return pendingRequests; }
    public void setPendingRequests(long pendingRequests) { this.pendingRequests = pendingRequests; }

    public long getAcceptedRequests() { return acceptedRequests; }
    public void setAcceptedRequests(long acceptedRequests) { this.acceptedRequests = acceptedRequests; }

    public long getReadyForPickupRequests() { return readyForPickupRequests; }
    public void setReadyForPickupRequests(long readyForPickupRequests) { this.readyForPickupRequests = readyForPickupRequests; }

    public long getCompletedPurchases() { return completedPurchases; }
    public void setCompletedPurchases(long completedPurchases) { this.completedPurchases = completedPurchases; }

    public long getTotalAiPredictions() { return totalAiPredictions; }
    public void setTotalAiPredictions(long totalAiPredictions) { this.totalAiPredictions = totalAiPredictions; }

    public static DashboardStatsDtoBuilder builder() { return new DashboardStatsDtoBuilder(); }

    public static class DashboardStatsDtoBuilder {
        private long totalProducts;
        private long pendingRequests;
        private long acceptedRequests;
        private long readyForPickupRequests;
        private long completedPurchases;
        private long totalAiPredictions;

        public DashboardStatsDtoBuilder totalProducts(long totalProducts) { this.totalProducts = totalProducts; return this; }
        public DashboardStatsDtoBuilder pendingRequests(long pendingRequests) { this.pendingRequests = pendingRequests; return this; }
        public DashboardStatsDtoBuilder acceptedRequests(long acceptedRequests) { this.acceptedRequests = acceptedRequests; return this; }
        public DashboardStatsDtoBuilder readyForPickupRequests(long readyForPickupRequests) { this.readyForPickupRequests = readyForPickupRequests; return this; }
        public DashboardStatsDtoBuilder completedPurchases(long completedPurchases) { this.completedPurchases = completedPurchases; return this; }
        public DashboardStatsDtoBuilder totalAiPredictions(long totalAiPredictions) { this.totalAiPredictions = totalAiPredictions; return this; }

        public DashboardStatsDto build() {
            return new DashboardStatsDto(totalProducts, pendingRequests, acceptedRequests, readyForPickupRequests, completedPurchases, totalAiPredictions);
        }
    }
}
