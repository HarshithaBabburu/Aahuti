import math
from typing import List, Tuple
from app.models.schemas import Donation, Recipient

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points on the earth in kilometers.
    """
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2.0) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

class MatchingEngine:
    @staticmethod
    def get_candidate_recipients(
        donation: Donation,
        all_recipients: List[Recipient],
        max_search_radius_km: float = 35.0
    ) -> List[Tuple[Recipient, float]]:
        """
        Retrieves candidate recipients with distance calculations.
        Sorts candidates by geographic proximity.
        """
        candidates: List[Tuple[Recipient, float]] = []
        for rec in all_recipients:
            dist = haversine_distance_km(
                donation.latitude, donation.longitude,
                rec.latitude, rec.longitude
            )
            if dist <= max_search_radius_km:
                candidates.append((rec, dist))
                
        # Sort ascending by distance (closest first)
        candidates.sort(key=lambda x: x[1])
        return candidates

matching_engine = MatchingEngine()
