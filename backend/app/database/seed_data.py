from datetime import datetime, timedelta
from app.database.connection import init_db
from app.database.repository import repo
from app.models.schemas import (
    DonorCreate, RecipientCreate, DonationCreate,
    FoodCategory, StorageRequirement, DonationStatus,
    DecisionAuditLog, DecisionType, PolicyInputState,
    ReviewCreate, ReviewRole
)

def seed_database():
    init_db()
    
    # Check if already seeded
    if repo.donors.get_by_id("donor_001") and repo.recipients.get_by_id("rec_001"):
        seed_active_donations()
        return

    print("Seeding FoodBridge AI database with fictional demo data...")

    # 1. Seed Donors
    donors_data = [
        DonorCreate(
            name="[Fictional] Grand Palace Banquet & Convention",
            donor_type="event_venue",
            contact_person="Rajesh Sharma",
            phone="+91 98765 43210",
            email="banquets@grandpalace-fictional.org",
            address="Road No 12, Banjara Hills, Hyderabad",
            latitude=17.4156,
            longitude=78.4357
        ),
        DonorCreate(
            name="[Fictional] Central University Dining Hall",
            donor_type="hostel",
            contact_person="Kavita Rao",
            phone="+91 98765 43211",
            email="mess@university-fictional.edu",
            address="Gachibowli Main Campus, Hyderabad",
            latitude=17.4589,
            longitude=78.3498
        ),
        DonorCreate(
            name="[Fictional] Spice Symphony Fine Dining",
            donor_type="restaurant",
            contact_person="Chef Amit Saxena",
            phone="+91 98765 43212",
            email="chef@spicesymphony-fictional.com",
            address="Road No 36, Jubilee Hills, Hyderabad",
            latitude=17.4325,
            longitude=78.4071
        ),
        DonorCreate(
            name="[Fictional] TechNova Campus Corporate Cafeteria",
            donor_type="cafeteria",
            contact_person="Sunita Nair",
            phone="+91 98765 43213",
            email="cafeteria@technova-fictional.com",
            address="HITEC City Phase 2, Hyderabad",
            latitude=17.4478,
            longitude=78.3762
        )
    ]

    donor_ids = ["donor_001", "donor_002", "donor_003", "donor_004"]
    created_donors = []
    for d_id, d_data in zip(donor_ids, donors_data):
        created_donors.append(repo.donors.create(d_data, d_id))

    # 2. Seed Recipients
    recipients_data = [
        RecipientCreate(
            name="[Fictional] Asha Community Kitchen",
            recipient_type="community_kitchen",
            is_verified=True,
            latitude=17.4289,
            longitude=78.4482,
            address="Secunderabad Clock Tower Enclave, Hyderabad",
            contact_person="Sister Mary & Team",
            phone="+91 98220 12345",
            email="meals@ashakitchen-fictional.org",
            max_daily_capacity_kg=300.0,
            current_day_intake_kg=85.0,
            has_cold_storage=True,
            accepted_categories=[
                FoodCategory.COOKED_MEALS.value,
                FoodCategory.BAKERY_BREADS.value,
                FoodCategory.FRESH_PRODUCE.value,
                FoodCategory.DAIRY_PACKAGED.value
            ],
            operational_hours="07:00 - 22:30"
        ),
        RecipientCreate(
            name="[Fictional] Hope Care Food Bank & Relief",
            recipient_type="ngo",
            is_verified=True,
            latitude=17.4112,
            longitude=78.4230,
            address="Masab Tank Road, Hyderabad",
            contact_person="Dr. Farooq Khan",
            phone="+91 98220 54321",
            email="help@hopecare-fictional.org",
            max_daily_capacity_kg=150.0,
            current_day_intake_kg=40.0,
            has_cold_storage=False,  # Cannot accept refrigerated/dairy items requiring cold chain
            accepted_categories=[
                FoodCategory.COOKED_MEALS.value,
                FoodCategory.BAKERY_BREADS.value,
                FoodCategory.RAW_INGREDIENTS.value
            ],
            operational_hours="08:00 - 20:00"
        ),
        RecipientCreate(
            name="[Fictional] Anand Seva Children's Shelter",
            recipient_type="shelter",
            is_verified=True,
            latitude=17.4398,
            longitude=78.3912,
            address="Madhapur Metro Lane, Hyderabad",
            contact_person="Priya Deshmukh",
            phone="+91 98220 67890",
            email="support@anandseva-fictional.org",
            max_daily_capacity_kg=80.0,
            current_day_intake_kg=20.0,
            has_cold_storage=True,
            accepted_categories=[
                FoodCategory.COOKED_MEALS.value,
                FoodCategory.BAKERY_BREADS.value,
                FoodCategory.DESSERTS_BEVERAGES.value
            ],
            operational_hours="08:00 - 21:00"
        ),
        RecipientCreate(
            name="[Fictional] Unverified Local Outreach Initiative",
            recipient_type="community_kitchen",
            is_verified=False,  # Unverified for testing hard safety rejection!
            latitude=17.4200,
            longitude=78.4300,
            address="Old City Bazaar Lane, Hyderabad",
            contact_person="Imran Qureshi",
            phone="+91 98220 99999",
            email="info@unverified-fictional.org",
            max_daily_capacity_kg=200.0,
            current_day_intake_kg=10.0,
            has_cold_storage=False,
            accepted_categories=[FoodCategory.COOKED_MEALS.value],
            operational_hours="09:00 - 18:00"
        )
    ]

    recipient_ids = ["rec_001", "rec_002", "rec_003", "rec_004"]
    created_recipients = []
    for r_id, r_data in zip(recipient_ids, recipients_data):
        created_recipients.append(repo.recipients.create(r_data, r_id))

    # 3. Seed Realistic Lifecycle Donations
    now = datetime.now()
    
    # Donation 1: COLLECTED (contributes to actual impact metrics)
    d1 = repo.donations.create(
        DonationCreate(
            donor_id="donor_001",
            title="[Fictional] 60 Portions Veg Pulao & Dal Makhani",
            description="Banquet luncheon surplus, vacuum-sealed hot containers.",
            food_category=FoodCategory.COOKED_MEALS,
            quantity_kg=48.0,
            storage_requirement=StorageRequirement.AMBIENT,
            prepared_at=now - timedelta(hours=6),
            pickup_deadline=now - timedelta(hours=2),
            pickup_address="Road No 12, Banjara Hills, Hyderabad",
            latitude=17.4156,
            longitude=78.4357,
            special_instructions="Loading bay #3 at banquet hall rear."
        ),
        donation_id="don_001_collected",
        verification_code="FB-8942"
    )
    repo.donations.update_status(
        donation_id="don_001_collected",
        status=DonationStatus.COLLECTED,
        matched_recipient_id="rec_001",
        accepted_by_recipient_id="rec_001",
        authorized_collector_name="Volunteer Vikram (Asha Kitchen)"
    )

    # Donation 2: ACCEPTED & SCHEDULED FOR PICKUP (pending pickup, excluded from impact!)
    d2 = repo.donations.create(
        DonationCreate(
            donor_id="donor_003",
            title="[Fictional] 40 Artisanal Loaves & Multigrain Buns",
            description="End-of-day freshly baked artisanal breads from oven batches.",
            food_category=FoodCategory.BAKERY_BREADS,
            quantity_kg=22.0,
            storage_requirement=StorageRequirement.AMBIENT,
            prepared_at=now - timedelta(hours=3),
            pickup_deadline=now + timedelta(hours=4),
            pickup_address="Road No 36, Jubilee Hills, Hyderabad",
            latitude=17.4325,
            longitude=78.4071,
            special_instructions="Cartons packed and ready at service counter."
        ),
        donation_id="don_002_accepted",
        verification_code="FB-3129"
    )
    repo.donations.update_status(
        donation_id="don_002_accepted",
        status=DonationStatus.PICKUP_SCHEDULED,
        matched_recipient_id="rec_003",
        accepted_by_recipient_id="rec_003"
    )

    # Donation 3: PROPOSED (Active, awaiting decision model matching)
    d3 = repo.donations.create(
        DonationCreate(
            donor_id="donor_002",
            title="[Fictional] 80 Portions Rice, Sambar & Fresh Curd",
            description="Hostel mess lunch surplus. Hygienically stored in insulated containers.",
            food_category=FoodCategory.COOKED_MEALS,
            quantity_kg=35.0,
            storage_requirement=StorageRequirement.AMBIENT,
            prepared_at=now - timedelta(hours=1, minutes=30),
            pickup_deadline=now + timedelta(hours=3),
            pickup_address="Gachibowli Main Campus, Hyderabad",
            latitude=17.4589,
            longitude=78.3498,
            special_instructions="Hostel gate security will escort to kitchen."
        ),
        donation_id="don_003_proposed",
        verification_code="FB-5571"
    )

    # Seed an Audit Log for Don 1
    repo.audits.record_decision(
        DecisionAuditLog(
            id="audit_001",
            donation_id="don_001_collected",
            recipient_id="rec_001",
            decision=DecisionType.APPROVE,
            confidence=0.96,
            hard_safety_passed=True,
            hard_safety_violations=[],
            policy_inputs={
                "distance_km": 2.1,
                "quantity_kg": 48.0,
                "recipient_remaining_cap_kg": 215.0,
                "storage_match": True,
                "category_match": True,
                "verified": True
            },
            reasoning="Candidate satisfies all distance (2.1km), capacity, and food handling constraints with ample buffer.",
            bedrock_explanation="[Fictional Simulated AI] Asha Community Kitchen is located 2.1 km away with verified cold storage and capacity for 48kg. The food was safely prepared and well within the pickup window.",
            decider_latency_ms=14.2,
            bedrock_latency_ms=182.5,
            is_human_reviewed=False,
            timestamp=now - timedelta(hours=5),
            is_simulated_ai=True
        )
    )

def seed_active_donations():
    now = datetime.now()
    # Donation 4: Active Restaurant Biryani & Curries
    if not repo.donations.get_by_id("don_004_biryani"):
        repo.donations.create(
            DonationCreate(
                donor_id="donor_001",
                title="[Fictional] 50 Portions Royal Hyderabadi Veg Dum Biryani & Mirchi Ka Salan",
                description="Fresh pure vegetarian banquet surplus from afternoon reception. Made with basmati rice, peas, and paneer. Stored hot in food-grade thermal containers.",
                food_category=FoodCategory.COOKED_MEALS,
                quantity_kg=38.0,
                storage_requirement=StorageRequirement.AMBIENT,
                prepared_at=now - timedelta(hours=1),
                pickup_deadline=now + timedelta(hours=5),
                pickup_address="Road No 12, Banjara Hills, Hyderabad",
                latitude=17.4156,
                longitude=78.4357,
                special_instructions="Contact banquet loading gate #2."
            ),
            donation_id="don_004_biryani",
            verification_code="FB-7821"
        )

    # Donation 5: Active Artisanal Bakery Bread & Multigrain Loaves
    if not repo.donations.get_by_id("don_005_bakery"):
        repo.donations.create(
            DonationCreate(
                donor_id="donor_003",
                title="[Fictional] 60 Artisanal Sourdough Loaves & Croissants",
                description="Evening oven surplus from gourmet bistro bakery. Cleanly packaged in brown paper crates.",
                food_category=FoodCategory.BAKERY_BREADS,
                quantity_kg=24.0,
                storage_requirement=StorageRequirement.AMBIENT,
                prepared_at=now - timedelta(hours=2),
                pickup_deadline=now + timedelta(hours=8),
                pickup_address="Road No 36, Jubilee Hills, Hyderabad",
                latitude=17.4325,
                longitude=78.4071,
                special_instructions="Pickup at front bakery counter."
            ),
            donation_id="don_005_bakery",
            verification_code="FB-6190"
        )

    # Donation 6: Active Hostel Mess Dal Tadka & Fresh Rotis
    if not repo.donations.get_by_id("don_006_hostel"):
        repo.donations.create(
            DonationCreate(
                donor_id="donor_002",
                title="[Fictional] 80 Portions Dal Tadka, Steamed Rice & Fresh Rotis",
                description="Wholesome dinner mess batch prepared with zero preservatives. Sealed in stainless steel cans.",
                food_category=FoodCategory.COOKED_MEALS,
                quantity_kg=42.0,
                storage_requirement=StorageRequirement.AMBIENT,
                prepared_at=now - timedelta(hours=1, minutes=15),
                pickup_deadline=now + timedelta(hours=4, minutes=30),
                pickup_address="Gachibowli Main Campus, Hyderabad",
                latitude=17.4589,
                longitude=78.3498,
                special_instructions="Hostel mess supervisor will assist with loading."
            ),
            donation_id="don_006_hostel",
            verification_code="FB-4412"
        )

    # Donation 7: Fresh Farm Produce Crate
    if not repo.donations.get_by_id("don_007_produce"):
        repo.donations.create(
            DonationCreate(
                donor_id="donor_004",
                title="[Fictional] 35 kg Farm-Fresh Organic Spinach, Tomatoes & Gourds",
                description="Surplus procurement crates from corporate cafeteria kitchen. Crisp and unblemished.",
                food_category=FoodCategory.FRESH_PRODUCE,
                quantity_kg=35.0,
                storage_requirement=StorageRequirement.AMBIENT,
                prepared_at=now - timedelta(hours=3),
                pickup_deadline=now + timedelta(hours=12),
                pickup_address="HITEC City Phase 2, Hyderabad",
                latitude=17.4478,
                longitude=78.3762,
                special_instructions="Cafeteria dock B loading bay."
            ),
            donation_id="don_007_produce",
            verification_code="FB-9923"
        )

    # Donation 8: Dairy Chilled Desserts & Paneer
    if not repo.donations.get_by_id("don_008_dairy"):
        repo.donations.create(
            DonationCreate(
                donor_id="donor_001",
                title="[Fictional] 25 kg Chilled Paneer Blocks & Sweet Fruit Custard",
                description="Cold chain maintained at 4°C. Requires refrigerated transport or immediate consumption.",
                food_category=FoodCategory.DAIRY_PACKAGED,
                quantity_kg=25.0,
                storage_requirement=StorageRequirement.REFRIGERATED,
                prepared_at=now - timedelta(hours=2),
                pickup_deadline=now + timedelta(hours=6),
                pickup_address="Road No 12, Banjara Hills, Hyderabad",
                latitude=17.4156,
                longitude=78.4357,
                special_instructions="Direct pickup from banquet walk-in chiller #1."
            ),
            donation_id="don_008_dairy",
            verification_code="FB-1588"
        )

    seed_initial_reviews()
    print("Veyora seed data initialized successfully.")

def seed_initial_reviews():
    if not repo.reviews.list_all():
        repo.reviews.create(
            ReviewCreate(
                donation_id="don_001_collected",
                reviewer_id="rec_001",
                reviewer_name="Sister Mary (Asha Community Kitchen)",
                reviewer_role=ReviewRole.NGO_TO_DONOR,
                target_id="donor_001",
                target_name="Grand Palace Banquet Hall",
                rating=5,
                feedback="The 48 kg of veg pulao and dal makhani was packaged impeccably in food-grade insulated steel containers. Our team was able to distribute hot, nutritious meals to over 120 individuals at our clock tower shelter within 45 minutes of collection."
            ),
            review_id="rev_001"
        )
        repo.reviews.create(
            ReviewCreate(
                donation_id="don_001_collected",
                reviewer_id="donor_001",
                reviewer_name="Rajesh Sharma (Grand Palace Banquet)",
                reviewer_role=ReviewRole.DONOR_TO_NGO,
                target_id="rec_001",
                target_name="Asha Community Kitchen",
                rating=5,
                feedback="Volunteer Vikram arrived promptly within 20 minutes with valid OTP credentials and thermal transport crates. Smooth custody handover with zero delay. Excellent coordination."
            ),
            review_id="rev_002"
        )
        repo.reviews.create(
            ReviewCreate(
                donation_id="don_001_collected",
                reviewer_id="rec_003",
                reviewer_name="Priya Deshmukh (Anand Seva Children's Shelter)",
                reviewer_role=ReviewRole.NGO_TO_DONOR,
                target_id="donor_003",
                target_name="Spice Symphony Fine Dining",
                rating=5,
                feedback="The artisanal multigrain breads and buns were fresh and hygienically packed in brown paper crates. Provided an evening wholesome snack for all 80 children at our facility."
            ),
            review_id="rev_003"
        )

if __name__ == "__main__":
    seed_database()

