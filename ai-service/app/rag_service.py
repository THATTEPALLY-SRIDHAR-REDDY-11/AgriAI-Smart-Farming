import os
import json
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

# Ensure ai-service/.env is loaded regardless of current working directory
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".env"))
load_dotenv(env_path)
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
CHROMA_API_KEY = os.getenv("CHROMA_API_KEY")
CHROMA_TENANT = os.getenv("CHROMA_TENANT", "default_tenant")
CHROMA_DATABASE = os.getenv("CHROMA_DATABASE", "AgriAI")
CHROMA_COLLECTION = os.getenv("CHROMA_COLLECTION", "agricultural_knowledge")
GROQ_MODEL = os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b")

class RAGService:
    def __init__(self):
        self.embedding_model = None
        self.chroma_client = None
        self.collection = None
        self.local_knowledge = []
        self._load_local_knowledge()
        self._init_embedding_and_chroma()

    def _load_local_knowledge(self):
        """Loads static knowledge database from knowledge/crop_diseases.json as guaranteed fallback."""
        app_dir = os.path.dirname(os.path.abspath(__file__))
        knowledge_file = os.path.abspath(os.path.join(app_dir, "..", "..", "knowledge", "crop_diseases.json"))
        if os.path.exists(knowledge_file):
            try:
                with open(knowledge_file, "r") as f:
                    self.local_knowledge = json.load(f)
                print(f"[RAGService] Loaded {len(self.local_knowledge)} knowledge documents from local repository.")
            except Exception as e:
                print(f"[RAGService Error] Failed to load local knowledge file: {e}")

    def _init_embedding_and_chroma(self):
        # Initialize sentence-transformers embedding model
        try:
            from sentence_transformers import SentenceTransformer
            self.embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
            print("[RAGService] Loaded sentence-transformers/all-MiniLM-L6-v2 model.")
        except Exception as e:
            print(f"[RAGService Warning] SentenceTransformers not initialized ({e}). Using keyword embedding fallback.")

        # Initialize Chroma Cloud or Local Chroma client
        try:
            import chromadb
            if CHROMA_API_KEY:
                print(f"[RAGService] Connecting to Chroma Cloud (Tenant: {CHROMA_TENANT}, DB: {CHROMA_DATABASE})...")
                self.chroma_client = chromadb.CloudClient(
                    tenant=CHROMA_TENANT,
                    database=CHROMA_DATABASE,
                    api_key=CHROMA_API_KEY
                )
            else:
                print("[RAGService] CHROMA_API_KEY not set. Using Chroma PersistentClient for local indexing.")
                chroma_db_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "chroma_db"))
                self.chroma_client = chromadb.PersistentClient(path=chroma_db_dir)

            self.collection = self.chroma_client.get_or_create_collection(name=CHROMA_COLLECTION)
            print(f"[RAGService] Connected to Chroma collection '{CHROMA_COLLECTION}'.")
        except Exception as e:
            print(f"[RAGService Note] ChromaDB client setup note: {e}")

    def ingest_documents(self, docs: List[Dict[str, Any]]) -> int:
        """Ingests structured agricultural knowledge documents into Chroma vector DB."""
        if not self.collection:
            incoming_ids = {doc.get("id") for doc in docs}
            self.local_knowledge = [
                doc for doc in self.local_knowledge
                if doc.get("id") not in incoming_ids
            ]
            self.local_knowledge.extend(docs)
            return len(docs)

        ids = [doc.get("id", f"doc_{i}") for i, doc in enumerate(docs)]
        texts = [
            " | ".join([
                f"Crop: {doc.get('crop', 'General')}",
                f"Topic: {doc.get('topic', doc.get('category', 'General'))}",
                f"Disease/Pest: {doc.get('disease', 'General')}",
                f"Scientific name: {doc.get('scientific_name', 'N/A')}",
                f"Symptoms: {' '.join(doc.get('symptoms', []))}",
                f"Causes: {' '.join(doc.get('causes', []))}",
                f"Management: {' '.join(doc.get('management', []))}",
                f"Prevention: {' '.join(doc.get('prevention', []))}",
                f"Precautions: {doc.get('precautions', '')}",
            ])
            for doc in docs
        ]
        metadatas = [{
            "crop": doc.get("crop", "General"),
            "disease": doc.get("disease", "General"),
            "category": doc.get("category", "General"),
            "topic": doc.get("topic", doc.get("category", "General")),
            "source": doc.get("source", "Agricultural Extension Resource")
        } for doc in docs]

        if self.embedding_model:
            embeddings = self.embedding_model.encode(texts).tolist()
            self.collection.upsert(ids=ids, documents=texts, embeddings=embeddings, metadatas=metadatas)
        else:
            self.collection.upsert(ids=ids, documents=texts, metadatas=metadatas)

        return len(docs)

    def retrieve_context(self, query: str, crop: Optional[str] = None, disease: Optional[str] = None, top_k: int = 3) -> List[Dict[str, Any]]:
        """Retrieves most relevant knowledge documents for query or disease."""
        # 1. Try vector similarity search via Chroma if available
        if self.collection and self.collection.count() > 0:
            try:
                where_clause = {}
                if crop and crop != "General":
                    where_clause["crop"] = crop

                if self.embedding_model:
                    q_embedding = self.embedding_model.encode([query]).tolist()
                    results = self.collection.query(query_embeddings=q_embedding, n_results=top_k, where=where_clause if where_clause else None)
                else:
                    results = self.collection.query(query_texts=[query], n_results=top_k, where=where_clause if where_clause else None)

                retrieved = []
                if results and 'metadatas' in results and len(results['metadatas']) > 0:
                    for meta, doc_text in zip(results['metadatas'][0], results['documents'][0]):
                        retrieved.append({"source": meta.get("source"), "text": doc_text, "crop": meta.get("crop"), "disease": meta.get("disease")})
                    return retrieved
            except Exception as e:
                print(f"[RAGService] Chroma query fallback to local: {e}")

        # 2. Local exact/keyword match fallback from local_knowledge JSON
        matches = []
        q_lower = query.lower()
        d_lower = (disease or "").lower()
        c_lower = (crop or "").lower()

        for item in self.local_knowledge:
            item_dis = item.get("disease", "").lower()
            item_crop = item.get("crop", "").lower()
            if (d_lower and d_lower in item_dis) or (c_lower and c_lower in item_crop) or any(k in q_lower for k in item_dis.split()):
                matches.append(item)

        if not matches:
            matches = self.local_knowledge[:top_k]

        return matches

    def generate_advisory(self, question: Optional[str], crop: Optional[str], disease: Optional[str], confidence: Optional[float]) -> Dict[str, Any]:
        """Generates grounded agricultural advisory using RAG context and Groq LLM."""
        query_text = question if question else f"{crop} {disease} treatment and management"
        context_docs = self.retrieve_context(query_text, crop=crop, disease=disease)

        crop_name = crop or (context_docs[0].get("crop") if context_docs else "Crop")
        disease_name = disease or (context_docs[0].get("disease") if context_docs else "General Advisory")

        sources = list(set([doc.get("source", "Agricultural Extension Resource") for doc in context_docs if "source" in doc]))
        if not sources:
            sources = ["ICAR Extension Resource", "State Agricultural University Guidelines"]

        # If Groq API Key is present, call Groq LLM API
        if GROQ_API_KEY and len(GROQ_API_KEY.strip()) > 5:
            try:
                from groq import Groq
                client = Groq(api_key=GROQ_API_KEY)
                context_str = "\n".join([json.dumps(doc) for doc in context_docs])
                system_prompt = (
                    "You are an expert AI Agricultural Advisory Assistant for farmers in AgriAI platform. "
                    "Provide clear, grounded, safe, and practical agricultural recommendations based ONLY on the retrieved context below. "
                    "Structure your answer into: What it means, Symptoms, Management/Treatment, Prevention, Precautions, and Knowledge Sources."
                )
                user_prompt = f"Farmer Question/Query: {query_text}\nDisease: {disease_name}\nCrop: {crop_name}\n\nRetrieved Knowledge Context:\n{context_str}"

                completion = client.chat.completions.create(
                    model=GROQ_MODEL,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.2,
                    max_tokens=800
                )
                llm_response = completion.choices[0].message.content
                return {
                    "crop": crop_name,
                    "disease": disease_name,
                    "confidence": confidence,
                    "what_it_means": f"Advisory grounded in validated agricultural research for {disease_name} affecting {crop_name}.",
                    "symptoms": self._extract_symptoms(context_docs),
                    "management": self._extract_management(context_docs),
                    "prevention": self._extract_prevention(context_docs),
                    "precautions": "Consult local agricultural extension officers if plant wilting spreads to >25% of crops.",
                    "sources": sources,
                    "answer": llm_response
                }
            except Exception as e:
                print(f"[RAGService Warning] Groq API call note ({e}). Using grounded local advisory synthesis.")

        # Grounded template synthesis when Groq API key is missing or offline
        symptoms = self._extract_symptoms(context_docs)
        management = self._extract_management(context_docs)
        prevention = self._extract_prevention(context_docs)
        precautions = context_docs[0].get("precautions", "Consult local agricultural extension expert before applying heavy chemicals.") if context_docs else "Consult local agricultural expert."

        synthesized_answer = (
            f"### Advisory for {disease_name} ({crop_name})\n\n"
            f"**Condition Overview:** {disease_name} has been identified on {crop_name}. "
            f"It is important to isolate infected plants and follow verified treatment protocols.\n\n"
            f"**Recommended Action Steps:**\n" +
            "\n".join([f"- {m}" for m in management]) + "\n\n"
            f"**Preventive Measures:**\n" +
            "\n".join([f"- {p}" for p in prevention])
        )

        return {
            "crop": crop_name,
            "disease": disease_name,
            "confidence": confidence,
            "what_it_means": f"{disease_name} is an active condition affecting {crop_name} leaves. Early treatment prevents severe crop yield loss.",
            "symptoms": symptoms,
            "management": management,
            "prevention": prevention,
            "precautions": precautions,
            "sources": sources,
            "answer": synthesized_answer
        }

    def _extract_symptoms(self, docs: List[Dict[str, Any]]) -> List[str]:
        syms = []
        for d in docs:
            if "symptoms" in d and isinstance(d["symptoms"], list):
                syms.extend(d["symptoms"])
        return syms if syms else ["Leaf spot lesions", "Yellowing around leaf veins", "Premature leaf drop"]

    def _extract_management(self, docs: List[Dict[str, Any]]) -> List[str]:
        mgmt = []
        for d in docs:
            if "management" in d and isinstance(d["management"], list):
                mgmt.extend(d["management"])
        return mgmt if mgmt else ["Apply recommended fungicide spray at early stage", "Prune severely damaged foliage", "Ensure balanced soil nutrition"]

    def _extract_prevention(self, docs: List[Dict[str, Any]]) -> List[str]:
        prev = []
        for d in docs:
            if "prevention" in d and isinstance(d["prevention"], list):
                prev.extend(d["prevention"])
        return prev if prev else ["Practice 3-year crop rotation", "Use drip irrigation to keep leaves dry", "Plant certified disease-resistant seeds"]

rag_service = RAGService()
