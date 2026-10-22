import os
import shutil
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

def get_default_database_path() -> str:
    custom = os.getenv("FOODBRIDGE_DB_PATH")
    if custom:
        return custom
    
    # In Vercel or AWS Lambda environments, root filesystem is read-only
    if os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME") or os.getenv("LAMBDA_TASK_ROOT"):
        tmp_db = "/tmp/foodbridge.db"
        if not os.path.exists(tmp_db):
            # Look for existing pre-seeded foodbridge.db
            candidates = [
                Path(__file__).resolve().parent.parent / "foodbridge.db",
                Path(os.getcwd()) / "backend" / "foodbridge.db",
                Path(os.getcwd()) / "foodbridge.db",
            ]
            for cand in candidates:
                if cand.exists():
                    try:
                        shutil.copy2(str(cand), tmp_db)
                        break
                    except Exception:
                        pass
        return tmp_db
        
    return "foodbridge.db"

class Settings(BaseSettings):
    PROJECT_NAME: str = "Aahuti"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"
    
    # Storage and Database
    DATABASE_PATH: str = get_default_database_path()
    
    # Impact Metric Constants
    MEAL_SERVING_SIZE_KG: float = float(os.getenv("MEAL_SERVING_SIZE_KG", "0.40"))  # 400g per meal estimate
    CO2_KG_PER_KG_FOOD: float = 2.5  # Standard EPA/WRAP conversion: 2.5 kg CO2e saved per kg food rescued
    
    # Strands Decider 2B Configuration
    DECIDER_CONFIDENCE_THRESHOLD: float = float(os.getenv("DECIDER_CONFIDENCE_THRESHOLD", "0.75"))
    DECIDER_MAX_DISTANCE_KM: float = float(os.getenv("DECIDER_MAX_DISTANCE_KM", "25.0"))
    DECIDER_URGENT_HOURS_THRESHOLD: float = 3.0  # Under 3 hours is urgent
    
    # Amazon Bedrock Configuration
    AWS_REGION: str = os.getenv("AWS_DEFAULT_REGION", os.getenv("AWS_REGION", "us-east-1"))
    BEDROCK_MODEL_ID: str = os.getenv("BEDROCK_MODEL_ID", "anthropic.claude-3-haiku-20240307-v1:0")
    USE_BEDROCK_FALLBACK_IF_UNAVAILABLE: bool = True

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
