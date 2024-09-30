from .database import user_collection, user_helper
from .auth import get_password_hash
from bson import ObjectId

async def create_user(user_data: dict) -> dict:
    user_data["hashed_password"] = get_password_hash(user_data["password"])
    del user_data["password"]  # Remove plain password
    user = await user_collection.insert_one(user_data)
    new_user = await user_collection.find_one({"_id": user.inserted_id})
    return user_helper(new_user)

async def get_user_by_email(email: str) -> dict:
    user = await user_collection.find_one({"email": email})
    if user:
        return user_helper(user)
    return None
