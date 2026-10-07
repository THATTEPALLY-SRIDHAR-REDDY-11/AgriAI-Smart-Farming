import requests
import json

BASE_URL = "http://localhost:8085/api"

def run_marketplace_tests():
    print("=== STARTING FARMER <-> BUYER MARKETPLACE END-TO-END VERIFICATION ===\n")
    
    # ---------------------------------------------------------
    # PHASE 1: FARMER LOGIN & PRODUCT CREATION
    # ---------------------------------------------------------
    print("--- Phase 1: Farmer Login & Product Creation ---")
    farmer_login = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "farmer@agriai.com",
        "password": "farmer123"
    })
    print("Farmer Login Status Code:", farmer_login.status_code)
    assert farmer_login.status_code == 200
    farmer_data = farmer_login.json()
    farmer_token = farmer_data["token"]
    farmer_id = farmer_data["profileId"]
    farmer_headers = {"Authorization": f"Bearer {farmer_token}"}
    print(f"Farmer Logged In successfully. Farmer Profile ID: {farmer_id}")
    
    # Create product
    new_product_payload = {
        "name": "Fresh Organic Tomatoes",
        "category": "Vegetables",
        "description": "Fresh organically grown tomatoes harvested from Hyderabad farm",
        "price": 45.0,
        "quantity": 100.0,
        "unit": "kg",
        "location": "Hyderabad",
        "contact": "+91 98765 43210"
    }
    prod_resp = requests.post(f"{BASE_URL}/products/farmer/{farmer_id}", headers=farmer_headers, json=new_product_payload)
    print("Product Creation Status Code:", prod_resp.status_code)
    assert prod_resp.status_code == 200
    prod_data = prod_resp.json()
    product_id = prod_data["id"]
    print("Product Created Response:\n", json.dumps(prod_data, indent=2))
    assert prod_data["farmerId"] == farmer_id
    assert prod_data["name"] == "Fresh Organic Tomatoes"
    assert prod_data["status"] == "AVAILABLE"
    
    # Verify Marketplace listing
    mkt_resp = requests.get(f"{BASE_URL}/products/marketplace", headers=farmer_headers)
    assert mkt_resp.status_code == 200
    mkt_items = mkt_resp.json()
    print(f"Marketplace Product Listing (Count: {len(mkt_items)})")
    assert any(p["id"] == product_id for p in mkt_items)
    
    # ---------------------------------------------------------
    # PHASE 2: BUYER LOGIN & PURCHASE REQUEST
    # ---------------------------------------------------------
    print("\n--- Phase 2: Buyer Login & Purchase Request Creation ---")
    buyer_login = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "buyer@agriai.com",
        "password": "buyer123"
    })
    print("Buyer Login Status Code:", buyer_login.status_code)
    assert buyer_login.status_code == 200
    buyer_data = buyer_login.json()
    buyer_token = buyer_data["token"]
    buyer_id = buyer_data["profileId"]
    buyer_headers = {"Authorization": f"Bearer {buyer_token}"}
    print(f"Buyer Logged In successfully. Buyer Profile ID: {buyer_id}")
    
    # Search / filter marketplace
    search_resp = requests.get(f"{BASE_URL}/products/marketplace?query=Tomatoes", headers=buyer_headers)
    assert search_resp.status_code == 200
    search_items = search_resp.json()
    print("Marketplace Search 'Tomatoes' Result Count:", len(search_items))
    assert len(search_items) > 0
    
    # Product details
    det_resp = requests.get(f"{BASE_URL}/products/{product_id}", headers=buyer_headers)
    assert det_resp.status_code == 200
    print("Product Details Retrieved:\n", json.dumps(det_resp.json(), indent=2))
    
    # Create Purchase Request
    req_url = f"{BASE_URL}/requests?buyerId={buyer_id}&productId={product_id}&requestedQuantity=25.0&message=Need+25kg+fresh+tomatoes"
    req_resp = requests.post(req_url, headers=buyer_headers)
    print("Purchase Request Creation Status Code:", req_resp.status_code)
    assert req_resp.status_code == 200
    req_data = req_resp.json()
    request_id = req_data["id"]
    print("Purchase Request Response:\n", json.dumps(req_data, indent=2))
    assert req_data["buyerId"] == buyer_id
    assert req_data["productId"] == product_id
    assert req_data["requestedQuantity"] == 25.0
    assert req_data["status"] == "PENDING"
    
    # ---------------------------------------------------------
    # PHASE 3: FARMER REQUEST MANAGEMENT (PENDING -> ACCEPTED -> READY_FOR_PICKUP)
    # ---------------------------------------------------------
    print("\n--- Phase 3: Farmer Request Management ---")
    farmer_reqs_resp = requests.get(f"{BASE_URL}/requests/farmer/{farmer_id}", headers=farmer_headers)
    assert farmer_reqs_resp.status_code == 200
    farmer_reqs = farmer_reqs_resp.json()
    print(f"Farmer Purchase Requests (Count: {len(farmer_reqs)})")
    target_req = next(r for r in farmer_reqs if r["id"] == request_id)
    assert target_req["status"] == "PENDING"
    
    # Accept Request (PENDING -> ACCEPTED)
    accept_resp = requests.patch(f"{BASE_URL}/requests/{request_id}/status?status=ACCEPTED", headers=farmer_headers)
    print("Accept Request Status Code:", accept_resp.status_code)
    assert accept_resp.status_code == 200
    assert accept_resp.json()["status"] == "ACCEPTED"
    print("Request Status updated to ACCEPTED.")
    
    # Mark Ready for Pickup (ACCEPTED -> READY_FOR_PICKUP)
    pickup_resp = requests.patch(f"{BASE_URL}/requests/{request_id}/status?status=READY_FOR_PICKUP", headers=farmer_headers)
    print("Ready for Pickup Status Code:", pickup_resp.status_code)
    assert pickup_resp.status_code == 200
    assert pickup_resp.json()["status"] == "READY_FOR_PICKUP"
    print("Request Status updated to READY_FOR_PICKUP.")
    
    # Verify Farmer Requests persistence in Neon DB
    f_check = requests.get(f"{BASE_URL}/requests/farmer/{farmer_id}", headers=farmer_headers).json()
    t_check = next(r for r in f_check if r["id"] == request_id)
    assert t_check["status"] == "READY_FOR_PICKUP"
    print("Persisted Status in Neon DB verified as READY_FOR_PICKUP.")

    # ---------------------------------------------------------
    # PHASE 4: BUYER COMPLETION (READY_FOR_PICKUP -> COMPLETED)
    # ---------------------------------------------------------
    print("\n--- Phase 4: Buyer Completion ---")
    buyer_reqs_resp = requests.get(f"{BASE_URL}/requests/buyer/{buyer_id}", headers=buyer_headers)
    assert buyer_reqs_resp.status_code == 200
    buyer_reqs = buyer_reqs_resp.json()
    b_target = next(r for r in buyer_reqs if r["id"] == request_id)
    print("Buyer View of Request:\n", json.dumps(b_target, indent=2))
    assert b_target["status"] == "READY_FOR_PICKUP"
    assert b_target["farmerPhone"] != ""
    assert b_target["farmerLocation"] != ""
    
    # Mark Transaction Completed (READY_FOR_PICKUP -> COMPLETED)
    complete_resp = requests.patch(f"{BASE_URL}/requests/{request_id}/status?status=COMPLETED", headers=buyer_headers)
    print("Complete Transaction Status Code:", complete_resp.status_code)
    assert complete_resp.status_code == 200
    assert complete_resp.json()["status"] == "COMPLETED"
    print("Request Status updated to COMPLETED.")
    
    # Verify COMPLETED persistence in Neon DB
    b_final = requests.get(f"{BASE_URL}/requests/buyer/{buyer_id}", headers=buyer_headers).json()
    b_final_item = next(r for r in b_final if r["id"] == request_id)
    assert b_final_item["status"] == "COMPLETED"
    print("Persisted Status in Neon DB verified as COMPLETED.")
    
    # ---------------------------------------------------------
    # PHASE 5: SECURITY AND VALIDATION
    # ---------------------------------------------------------
    print("\n--- Phase 5: Security & Input Validation Checks ---")
    
    # 1. Unauthenticated Request -> 401
    unauth_resp = requests.get(f"{BASE_URL}/products/marketplace")
    print("Unauthenticated Request Status Code:", unauth_resp.status_code)
    assert unauth_resp.status_code in [401, 403]
    
    # 2. Role Authorization: Buyer attempting Farmer endpoint -> 403
    buyer_farmer_endpoint = requests.post(f"{BASE_URL}/products/farmer/{farmer_id}", headers=buyer_headers, json=new_product_payload)
    print("Buyer Accessing Farmer Endpoint Status Code:", buyer_farmer_endpoint.status_code)
    assert buyer_farmer_endpoint.status_code == 403
    
    # 3. Role Authorization: Farmer attempting Buyer endpoint -> 403
    farmer_buyer_endpoint = requests.get(f"{BASE_URL}/requests/buyer/{buyer_id}", headers=farmer_headers)
    print("Farmer Accessing Buyer Endpoint Status Code:", farmer_buyer_endpoint.status_code)
    assert farmer_buyer_endpoint.status_code == 403
    
    # 4. Invalid Product Data (Price <= 0) -> 400 Bad Request
    invalid_prod_payload = new_product_payload.copy()
    invalid_prod_payload["price"] = -10.0
    bad_prod_resp = requests.post(f"{BASE_URL}/products/farmer/{farmer_id}", headers=farmer_headers, json=invalid_prod_payload)
    print("Invalid Product Data (Price <= 0) Status Code:", bad_prod_resp.status_code)
    assert bad_prod_resp.status_code == 400
    
    # 5. Invalid Purchase Request Quantity (Exceeding Stock) -> 400 Bad Request
    bad_qty_url = f"{BASE_URL}/requests?buyerId={buyer_id}&productId={product_id}&requestedQuantity=99999.0&message=Excessive"
    bad_qty_resp = requests.post(bad_qty_url, headers=buyer_headers)
    print("Invalid Purchase Quantity (> Available Stock) Status Code:", bad_qty_resp.status_code)
    assert bad_qty_resp.status_code == 400

    print("\n=== ALL 35 MARKETPLACE INTEGRATION & SECURITY TESTS PASSED 100%! ===")

if __name__ == "__main__":
    run_marketplace_tests()
