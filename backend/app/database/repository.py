from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
import json
from datetime import datetime
from app.database.connection import get_db_connection
from app.models.schemas import (
    Donor, DonorCreate,
    Recipient, RecipientCreate,
    Donation, DonationCreate, DonationStatus,
    DecisionAuditLog, DecisionType,
    Review, ReviewCreate
)

class IDonorRepository(ABC):
    @abstractmethod
    def create(self, donor: DonorCreate, donor_id: str) -> Donor: pass
    @abstractmethod
    def get_by_id(self, donor_id: str) -> Optional[Donor]: pass
    @abstractmethod
    def list_all(self) -> List[Donor]: pass

class IRecipientRepository(ABC):
    @abstractmethod
    def create(self, recipient: RecipientCreate, recipient_id: str) -> Recipient: pass
    @abstractmethod
    def get_by_id(self, recipient_id: str) -> Optional[Recipient]: pass
    @abstractmethod
    def list_all(self) -> List[Recipient]: pass
    @abstractmethod
    def update_intake(self, recipient_id: str, additional_kg: float) -> Optional[Recipient]: pass

class IDonationRepository(ABC):
    @abstractmethod
    def create(self, donation: DonationCreate, donation_id: str, verification_code: str) -> Donation: pass
    @abstractmethod
    def get_by_id(self, donation_id: str) -> Optional[Donation]: pass
    @abstractmethod
    def list_all(self, status: Optional[DonationStatus] = None) -> List[Donation]: pass
    @abstractmethod
    def update_status(
        self,
        donation_id: str,
        status: DonationStatus,
        matched_recipient_id: Optional[str] = None,
        accepted_by_recipient_id: Optional[str] = None,
        authorized_collector_name: Optional[str] = None
    ) -> Optional[Donation]: pass

class IAuditRepository(ABC):
    @abstractmethod
    def record_decision(self, log: DecisionAuditLog) -> DecisionAuditLog: pass
    @abstractmethod
    def get_by_id(self, log_id: str) -> Optional[DecisionAuditLog]: pass
    @abstractmethod
    def list_all(self, decision: Optional[DecisionType] = None, pending_human_review: bool = False) -> List[DecisionAuditLog]: pass
    @abstractmethod
    def update_human_review(
        self,
        log_id: str,
        override_decision: DecisionType,
        reviewer_name: str,
        notes: str
    ) -> Optional[DecisionAuditLog]: pass

class IReviewRepository(ABC):
    @abstractmethod
    def create(self, review: ReviewCreate, review_id: str) -> Review: pass
    @abstractmethod
    def list_all(
        self,
        donation_id: Optional[str] = None,
        reviewer_id: Optional[str] = None,
        target_id: Optional[str] = None
    ) -> List[Review]: pass

# --- SQLite Implementations (Swap-ready for DynamoDB) ---

class SQLiteDonorRepository(IDonorRepository):
    def create(self, donor: DonorCreate, donor_id: str) -> Donor:
        now = datetime.now()
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO donors (id, name, donor_type, contact_person, phone, email, address, latitude, longitude, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (donor_id, donor.name, donor.donor_type, donor.contact_person, donor.phone, donor.email, donor.address, donor.latitude, donor.longitude, now.isoformat())
        )
        conn.commit()
        conn.close()
        return Donor(id=donor_id, created_at=now, **donor.model_dump())

    def get_by_id(self, donor_id: str) -> Optional[Donor]:
        conn = get_db_connection()
        row = conn.execute("SELECT * FROM donors WHERE id = ?", (donor_id,)).fetchone()
        conn.close()
        if not row:
            return None
        return Donor(
            id=row["id"],
            name=row["name"],
            donor_type=row["donor_type"],
            contact_person=row["contact_person"],
            phone=row["phone"],
            email=row["email"],
            address=row["address"],
            latitude=row["latitude"],
            longitude=row["longitude"],
            created_at=datetime.fromisoformat(row["created_at"])
        )

    def list_all(self) -> List[Donor]:
        conn = get_db_connection()
        rows = conn.execute("SELECT * FROM donors ORDER BY name ASC").fetchall()
        conn.close()
        return [
            Donor(
                id=r["id"],
                name=r["name"],
                donor_type=r["donor_type"],
                contact_person=r["contact_person"],
                phone=r["phone"],
                email=r["email"],
                address=r["address"],
                latitude=r["latitude"],
                longitude=r["longitude"],
                created_at=datetime.fromisoformat(r["created_at"])
            ) for r in rows
        ]


class SQLiteRecipientRepository(IRecipientRepository):
    def _row_to_recipient(self, row) -> Recipient:
        rem_cap = max(0.0, row["max_daily_capacity_kg"] - row["current_day_intake_kg"])
        return Recipient(
            id=row["id"],
            name=row["name"],
            recipient_type=row["recipient_type"],
            is_verified=bool(row["is_verified"]),
            latitude=row["latitude"],
            longitude=row["longitude"],
            address=row["address"],
            contact_person=row["contact_person"],
            phone=row["phone"],
            email=row["email"],
            max_daily_capacity_kg=row["max_daily_capacity_kg"],
            current_day_intake_kg=row["current_day_intake_kg"],
            remaining_capacity_kg=rem_cap,
            has_cold_storage=bool(row["has_cold_storage"]),
            accepted_categories=json.loads(row["accepted_categories"]),
            operational_hours=row["operational_hours"],
            created_at=datetime.fromisoformat(row["created_at"])
        )

    def create(self, recipient: RecipientCreate, recipient_id: str) -> Recipient:
        now = datetime.now()
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO recipients (id, name, recipient_type, is_verified, latitude, longitude, address, contact_person, phone, email, max_daily_capacity_kg, current_day_intake_kg, has_cold_storage, accepted_categories, operational_hours, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                recipient_id, recipient.name, recipient.recipient_type, int(recipient.is_verified),
                recipient.latitude, recipient.longitude, recipient.address, recipient.contact_person,
                recipient.phone, recipient.email, recipient.max_daily_capacity_kg, recipient.current_day_intake_kg,
                int(recipient.has_cold_storage), json.dumps(recipient.accepted_categories), recipient.operational_hours,
                now.isoformat()
            )
        )
        conn.commit()
        conn.close()
        return self.get_by_id(recipient_id)

    def get_by_id(self, recipient_id: str) -> Optional[Recipient]:
        conn = get_db_connection()
        row = conn.execute("SELECT * FROM recipients WHERE id = ?", (recipient_id,)).fetchone()
        conn.close()
        if not row:
            return None
        return self._row_to_recipient(row)

    def list_all(self) -> List[Recipient]:
        conn = get_db_connection()
        rows = conn.execute("SELECT * FROM recipients ORDER BY name ASC").fetchall()
        conn.close()
        return [self._row_to_recipient(r) for r in rows]

    def update_intake(self, recipient_id: str, additional_kg: float) -> Optional[Recipient]:
        conn = get_db_connection()
        conn.execute(
            "UPDATE recipients SET current_day_intake_kg = current_day_intake_kg + ? WHERE id = ?",
            (additional_kg, recipient_id)
        )
        conn.commit()
        conn.close()
        return self.get_by_id(recipient_id)


def _parse_dt(dt_val) -> Optional[datetime]:
    if not dt_val:
        return None
    if isinstance(dt_val, datetime):
        dt = dt_val
    else:
        dt = datetime.fromisoformat(str(dt_val).replace("Z", "+00:00"))
    if dt.tzinfo is not None:
        dt = dt.replace(tzinfo=None)
    return dt


class SQLiteDonationRepository(IDonationRepository):
    def _row_to_donation(self, r) -> Donation:
        return Donation(
            id=r["id"],
            donor_id=r["donor_id"],
            title=r["title"],
            description=r["description"],
            food_category=r["food_category"],
            quantity_kg=r["quantity_kg"],
            storage_requirement=r["storage_requirement"],
            prepared_at=_parse_dt(r["prepared_at"]),
            pickup_deadline=_parse_dt(r["pickup_deadline"]),
            pickup_address=r["pickup_address"],
            latitude=r["latitude"],
            longitude=r["longitude"],
            special_instructions=r["special_instructions"],
            status=DonationStatus(r["status"]),
            created_at=_parse_dt(r["created_at"]),
            matched_recipient_id=r["matched_recipient_id"],
            accepted_by_recipient_id=r["accepted_by_recipient_id"],
            accepted_at=_parse_dt(r["accepted_at"]),
            collected_at=_parse_dt(r["collected_at"]),
            collection_verification_code=r["collection_verification_code"],
            authorized_collector_name=r["authorized_collector_name"]
        )

    def create(self, donation: DonationCreate, donation_id: str, verification_code: str) -> Donation:
        now = datetime.now()
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO donations (
                id, donor_id, title, description, food_category, quantity_kg, storage_requirement,
                prepared_at, pickup_deadline, pickup_address, latitude, longitude, special_instructions,
                status, created_at, collection_verification_code
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                donation_id, donation.donor_id, donation.title, donation.description,
                donation.food_category.value, donation.quantity_kg, donation.storage_requirement.value,
                donation.prepared_at.isoformat(), donation.pickup_deadline.isoformat(),
                donation.pickup_address, donation.latitude, donation.longitude, donation.special_instructions,
                DonationStatus.PROPOSED.value, now.isoformat(), verification_code
            )
        )
        conn.commit()
        conn.close()
        return self.get_by_id(donation_id)

    def get_by_id(self, donation_id: str) -> Optional[Donation]:
        conn = get_db_connection()
        row = conn.execute("SELECT * FROM donations WHERE id = ?", (donation_id,)).fetchone()
        conn.close()
        if not row:
            return None
        return self._row_to_donation(row)

    def list_all(self, status: Optional[DonationStatus] = None) -> List[Donation]:
        conn = get_db_connection()
        if status:
            rows = conn.execute("SELECT * FROM donations WHERE status = ? ORDER BY created_at DESC", (status.value,)).fetchall()
        else:
            rows = conn.execute("SELECT * FROM donations ORDER BY created_at DESC").fetchall()
        conn.close()
        return [self._row_to_donation(r) for r in rows]

    def update_status(
        self,
        donation_id: str,
        status: DonationStatus,
        matched_recipient_id: Optional[str] = None,
        accepted_by_recipient_id: Optional[str] = None,
        authorized_collector_name: Optional[str] = None
    ) -> Optional[Donation]:
        conn = get_db_connection()
        now_str = datetime.now().isoformat()
        
        updates = ["status = ?"]
        params = [status.value]
        
        if matched_recipient_id is not None:
            updates.append("matched_recipient_id = ?")
            params.append(matched_recipient_id)
        if accepted_by_recipient_id is not None:
            updates.append("accepted_by_recipient_id = ?")
            updates.append("accepted_at = ?")
            params.extend([accepted_by_recipient_id, now_str])
        if authorized_collector_name is not None:
            updates.append("authorized_collector_name = ?")
            updates.append("collected_at = ?")
            params.extend([authorized_collector_name, now_str])
            
        params.append(donation_id)
        sql = f"UPDATE donations SET {', '.join(updates)} WHERE id = ?"
        conn.execute(sql, tuple(params))
        conn.commit()
        conn.close()
        return self.get_by_id(donation_id)


class SQLiteAuditRepository(IAuditRepository):
    def _row_to_log(self, r) -> DecisionAuditLog:
        return DecisionAuditLog(
            id=r["id"],
            donation_id=r["donation_id"],
            recipient_id=r["recipient_id"],
            decision=DecisionType(r["decision"]),
            confidence=r["confidence"],
            hard_safety_passed=bool(r["hard_safety_passed"]),
            hard_safety_violations=json.loads(r["hard_safety_violations"]),
            policy_inputs=json.loads(r["policy_inputs"]),
            reasoning=r["reasoning"],
            bedrock_explanation=r["bedrock_explanation"],
            decider_latency_ms=r["decider_latency_ms"],
            bedrock_latency_ms=r["bedrock_latency_ms"],
            is_human_reviewed=bool(r["is_human_reviewed"]),
            human_reviewer=r["human_reviewer"],
            human_override_decision=DecisionType(r["human_override_decision"]) if r["human_override_decision"] else None,
            human_notes=r["human_notes"],
            timestamp=datetime.fromisoformat(r["timestamp"]),
            is_simulated_ai=bool(r["is_simulated_ai"])
        )

    def record_decision(self, log: DecisionAuditLog) -> DecisionAuditLog:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO decision_audit_logs (
                id, donation_id, recipient_id, decision, confidence, hard_safety_passed,
                hard_safety_violations, policy_inputs, reasoning, bedrock_explanation,
                decider_latency_ms, bedrock_latency_ms, is_human_reviewed, human_reviewer,
                human_override_decision, human_notes, timestamp, is_simulated_ai
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                log.id, log.donation_id, log.recipient_id, log.decision.value, log.confidence,
                int(log.hard_safety_passed), json.dumps(log.hard_safety_violations),
                json.dumps(log.policy_inputs), log.reasoning, log.bedrock_explanation,
                log.decider_latency_ms, log.bedrock_latency_ms, int(log.is_human_reviewed),
                log.human_reviewer, log.human_override_decision.value if log.human_override_decision else None,
                log.human_notes, log.timestamp.isoformat(), int(log.is_simulated_ai)
            )
        )
        conn.commit()
        conn.close()
        return log

    def get_by_id(self, log_id: str) -> Optional[DecisionAuditLog]:
        conn = get_db_connection()
        row = conn.execute("SELECT * FROM decision_audit_logs WHERE id = ?", (log_id,)).fetchone()
        conn.close()
        if not row:
            return None
        return self._row_to_log(row)

    def list_all(self, decision: Optional[DecisionType] = None, pending_human_review: bool = False) -> List[DecisionAuditLog]:
        conn = get_db_connection()
        if pending_human_review:
            rows = conn.execute(
                "SELECT * FROM decision_audit_logs WHERE decision = ? AND is_human_reviewed = 0 ORDER BY timestamp DESC",
                (DecisionType.HUMAN_REVIEW.value,)
            ).fetchall()
        elif decision:
            rows = conn.execute(
                "SELECT * FROM decision_audit_logs WHERE decision = ? ORDER BY timestamp DESC",
                (decision.value,)
            ).fetchall()
        else:
            rows = conn.execute("SELECT * FROM decision_audit_logs ORDER BY timestamp DESC").fetchall()
        conn.close()
        return [self._row_to_log(r) for r in rows]

    def update_human_review(
        self,
        log_id: str,
        override_decision: DecisionType,
        reviewer_name: str,
        notes: str
    ) -> Optional[DecisionAuditLog]:
        conn = get_db_connection()
        conn.execute(
            """
            UPDATE decision_audit_logs
            SET is_human_reviewed = 1,
                human_reviewer = ?,
                human_override_decision = ?,
                human_notes = ?
            WHERE id = ?
            """,
            (reviewer_name, override_decision.value, notes, log_id)
        )
        conn.commit()
        conn.close()
        return self.get_by_id(log_id)

class SQLiteReviewRepository(IReviewRepository):
    def create(self, review: ReviewCreate, review_id: str) -> Review:
        now = datetime.now()
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO reviews (id, donation_id, reviewer_id, reviewer_name, reviewer_role, target_id, target_name, rating, feedback, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                review_id,
                review.donation_id,
                review.reviewer_id,
                review.reviewer_name,
                review.reviewer_role.value if hasattr(review.reviewer_role, 'value') else str(review.reviewer_role),
                review.target_id,
                review.target_name,
                review.rating,
                review.feedback,
                now.isoformat()
            )
        )
        conn.commit()
        conn.close()
        return Review(
            id=review_id,
            donation_id=review.donation_id,
            reviewer_id=review.reviewer_id,
            reviewer_name=review.reviewer_name,
            reviewer_role=review.reviewer_role,
            target_id=review.target_id,
            target_name=review.target_name,
            rating=review.rating,
            feedback=review.feedback,
            created_at=now
        )

    def list_all(
        self,
        donation_id: Optional[str] = None,
        reviewer_id: Optional[str] = None,
        target_id: Optional[str] = None
    ) -> List[Review]:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "SELECT * FROM reviews WHERE 1=1"
        params = []
        if donation_id:
            query += " AND donation_id = ?"
            params.append(donation_id)
        if reviewer_id:
            query += " AND reviewer_id = ?"
            params.append(reviewer_id)
        if target_id:
            query += " AND target_id = ?"
            params.append(target_id)
        query += " ORDER BY created_at DESC"
        cursor.execute(query, tuple(params))
        rows = cursor.fetchall()
        conn.close()

        res = []
        for r in rows:
            res.append(Review(
                id=r["id"],
                donation_id=r["donation_id"],
                reviewer_id=r["reviewer_id"],
                reviewer_name=r["reviewer_name"],
                reviewer_role=r["reviewer_role"],
                target_id=r["target_id"],
                target_name=r["target_name"],
                rating=r["rating"],
                feedback=r["feedback"],
                created_at=_parse_dt(r["created_at"]) or datetime.now()
            ))
        return res

# Singleton Repository Container
class RepositoryContainer:
    def __init__(self):
        self.donors: IDonorRepository = SQLiteDonorRepository()
        self.recipients: IRecipientRepository = SQLiteRecipientRepository()
        self.donations: IDonationRepository = SQLiteDonationRepository()
        self.audits: IAuditRepository = SQLiteAuditRepository()
        self.reviews: IReviewRepository = SQLiteReviewRepository()

repo = RepositoryContainer()

