# MYAI Node Setup – Full Intelligence, Monetization, NFT, and Networking Stack

from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from cryptography.fernet import Fernet
import uuid
import datetime
import random

app = FastAPI()

# Node Identity and Encryption Setup
NODE_ID = str(uuid.uuid4())
CREATED_AT = datetime.datetime.now().isoformat()
PRIVATE_KEY = Fernet.generate_key()
CIPHER = Fernet(PRIVATE_KEY)

# Simulated Ledgers and Systems
wallets = {}
content_vault = {}
verified_users = {}
follower_network = {}
nft_keys = {}
creator_storefronts = {}
music_library = {}

# Schemas
class Intent(BaseModel):
    user_id: str
    intent: str
    payload: dict

class Creator(BaseModel):
    creator_id: str
    name: str
    verified: bool
    tier: str

class Tip(BaseModel):
    creator_id: str
    from_user: str
    amount: float

class Content(BaseModel):
    creator_id: str
    title: str
    data: str
    access_level: str
    nft_required: bool = False

class Follow(BaseModel):
    creator_id: str
    user_id: str

class NFTAccess(BaseModel):
    content_id: str
    user_id: str
    nft_key: str

class Product(BaseModel):
    creator_id: str
    product_name: str
    description: str
    price: float

class Track(BaseModel):
    creator_id: str
    track_title: str
    audio_url: str
    access_level: str

# Root
@app.get("/")
def root():
    return {
        "message": "MYAI Node Fully Operational",
        "node_id": NODE_ID,
        "created_at": CREATED_AT
    }

# System Info
@app.get("/system")
def system_info():
    return {
        "cpu": "Intel i9 / AMD Ryzen (Auto-detect)",
        "gpu": "NVIDIA RTX 4090 or higher",
        "ram": "64GB+ DDR5",
        "storage": "NVMe SSD",
        "status": "MYAI Web Intelligence Stack Ready"
    }

# Intent Handling
@app.post("/intent")
def process_intent(intent: Intent):
    encrypted_payload = CIPHER.encrypt(str(intent.payload).encode())
    return {
        "intent": intent.intent,
        "encrypted_payload": encrypted_payload.decode(),
        "status": "Intent securely processed"
    }

# Creator Registration
@app.post("/creator/register")
def register_creator(name: str = Query(...), tier: str = Query("free")):
    creator_id = str(uuid.uuid4())
    wallets[creator_id] = round(random.uniform(10, 100), 2)
    verified_users[creator_id] = True
    follower_network[creator_id] = []
    creator_storefronts[creator_id] = []
    music_library[creator_id] = []
    return {
        "creator_id": creator_id,
        "name": name,
        "verified": True,
        "tier": tier,
        "starting_balance": wallets[creator_id]
    }

# Tipping
@app.post("/creator/tip")
def tip_creator(tip: Tip):
    if tip.creator_id not in wallets:
        raise HTTPException(status_code=404, detail="Creator not found")
    wallets[tip.creator_id] += tip.amount
    return {
        "message": f"{tip.amount} $AIC sent to creator {tip.creator_id}",
        "new_balance": wallets[tip.creator_id]
    }

# Wallet Check
@app.get("/creator/balance/{creator_id}")
def get_balance(creator_id: str):
    if creator_id not in wallets:
        raise HTTPException(status_code=404, detail="Creator not found")
    return {
        "creator_id": creator_id,
        "balance": wallets[creator_id]
    }

# Content Upload
@app.post("/creator/upload")
def upload_content(content: Content):
    content_id = str(uuid.uuid4())
    nft_key = str(uuid.uuid4()) if content.nft_required else None
    content_vault[content_id] = {
        "creator_id": content.creator_id,
        "title": content.title,
        "data": content.data,
        "access_level": content.access_level,
        "nft_required": content.nft_required,
        "timestamp": datetime.datetime.now().isoformat()
    }
    if nft_key:
        nft_keys[content_id] = nft_key
    return {
        "content_id": content_id,
        "status": "Uploaded",
        "access": content.access_level,
        "nft_required": content.nft_required,
        "nft_key": nft_key
    }

# Content Access
@app.get("/creator/content/{content_id}")
def access_content(content_id: str, user_id: str = Query(...), nft_key: str = Query(None)):
    if content_id not in content_vault:
        raise HTTPException(status_code=404, detail="Content not found")
    content = content_vault[content_id]
    if content['access_level'] == 'private' and content['creator_id'] != user_id:
        raise HTTPException(status_code=403, detail="Access denied (private)")
    if content['access_level'] == 'followers' and user_id not in follower_network[content['creator_id']]:
        raise HTTPException(status_code=403, detail="Access denied (followers only)")
    if content['nft_required'] and nft_keys.get(content_id) != nft_key:
        raise HTTPException(status_code=403, detail="NFT key required or invalid")
    return content

# Follow a Creator
@app.post("/creator/follow")
def follow_creator(follow: Follow):
    if follow.creator_id not in follower_network:
        raise HTTPException(status_code=404, detail="Creator not found")
    if follow.user_id not in follower_network[follow.creator_id]:
        follower_network[follow.creator_id].append(follow.user_id)
    return {"message": f"{follow.user_id} is now following {follow.creator_id}"}

# Check Follower List
@app.get("/creator/followers/{creator_id}")
def get_followers(creator_id: str):
    if creator_id not in follower_network:
        raise HTTPException(status_code=404, detail="Creator not found")
    return {"creator_id": creator_id, "followers": follower_network[creator_id]}

# NFT Key Check
@app.get("/creator/nftkey/{content_id}")
def get_nft_key(content_id: str):
    if content_id not in nft_keys:
        raise HTTPException(status_code=404, detail="NFT key not found")
    return {"content_id": content_id, "nft_key": nft_keys[content_id]}

# Add Product to Creator Storefront
@app.post("/creator/storefront/add")
def add_product(product: Product):
    if product.creator_id not in creator_storefronts:
        raise HTTPException(status_code=404, detail="Creator not found")
    creator_storefronts[product.creator_id].append({
        "product_name": product.product_name,
        "description": product.description,
        "price": product.price
    })
    return {"message": f"Product '{product.product_name}' added to storefront"}

# View Storefront
@app.get("/creator/storefront/{creator_id}")
def view_storefront(creator_id: str):
    if creator_id not in creator_storefronts:
        raise HTTPException(status_code=404, detail="Creator not found")
    return {"creator_id": creator_id, "storefront": creator_storefronts[creator_id]}

# Upload Music Track
@app.post("/creator/music/upload")
def upload_track(track: Track):
    if track.creator_id not in music_library:
        raise HTTPException(status_code=404, detail="Creator not found")
    music_library[track.creator_id].append({
        "track_title": track.track_title,
        "audio_url": track.audio_url,
        "access_level": track.access_level,
        "timestamp": datetime.datetime.now().isoformat()
    })
    return {"message": f"Track '{track.track_title}' uploaded successfully"}

# Stream Music Library
@app.get("/creator/music/{creator_id}")
def stream_music(creator_id: str):
    if creator_id not in music_library:
        raise HTTPException(status_code=404, detail="Creator not found")
    return {"creator_id": creator_id, "tracks": music_library[creator_id]}
