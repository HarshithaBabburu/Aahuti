import sqlite3
from typing import Generator
from app.config import settings

def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(settings.DATABASE_PATH, timeout=30.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA busy_timeout=5000;")
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Donors table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS donors (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        donor_type TEXT NOT NULL,
        contact_person TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        address TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        created_at TEXT NOT NULL
    )
    """)
    
    # 2. Recipients table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS recipients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        recipient_type TEXT NOT NULL,
        is_verified INTEGER NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        address TEXT NOT NULL,
        contact_person TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        max_daily_capacity_kg REAL NOT NULL,
        current_day_intake_kg REAL NOT NULL,
        has_cold_storage INTEGER NOT NULL,
        accepted_categories TEXT NOT NULL,
        operational_hours TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    """)
    
    # 3. Donations table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS donations (
        id TEXT PRIMARY KEY,
        donor_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        food_category TEXT NOT NULL,
        quantity_kg REAL NOT NULL,
        storage_requirement TEXT NOT NULL,
        prepared_at TEXT NOT NULL,
        pickup_deadline TEXT NOT NULL,
        pickup_address TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        special_instructions TEXT,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        matched_recipient_id TEXT,
        accepted_by_recipient_id TEXT,
        accepted_at TEXT,
        collected_at TEXT,
        collection_verification_code TEXT,
        authorized_collector_name TEXT,
        FOREIGN KEY (donor_id) REFERENCES donors(id)
    )
    """)
    
    # 4. Decision audit logs table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS decision_audit_logs (
        id TEXT PRIMARY KEY,
        donation_id TEXT NOT NULL,
        recipient_id TEXT NOT NULL,
        decision TEXT NOT NULL,
        confidence REAL NOT NULL,
        hard_safety_passed INTEGER NOT NULL,
        hard_safety_violations TEXT NOT NULL,
        policy_inputs TEXT NOT NULL,
        reasoning TEXT NOT NULL,
        bedrock_explanation TEXT,
        decider_latency_ms REAL NOT NULL,
        bedrock_latency_ms REAL NOT NULL,
        is_human_reviewed INTEGER NOT NULL,
        human_reviewer TEXT,
        human_override_decision TEXT,
        human_notes TEXT,
        timestamp TEXT NOT NULL,
        is_simulated_ai INTEGER NOT NULL,
        FOREIGN KEY (donation_id) REFERENCES donations(id),
        FOREIGN KEY (recipient_id) REFERENCES recipients(id)
    )
    """)
    
    # 5. Reviews table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        donation_id TEXT NOT NULL,
        reviewer_id TEXT NOT NULL,
        reviewer_name TEXT NOT NULL,
        reviewer_role TEXT NOT NULL,
        target_id TEXT NOT NULL,
        target_name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        feedback TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (donation_id) REFERENCES donations(id)
    )
    """)
    
    conn.commit()
    conn.close()

