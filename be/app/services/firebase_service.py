import base64
import json
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
from firebase_admin import exceptions as fb_exceptions


class FirebaseService:
    def __init__(self, base64_service_account_key_env: str):
        """Initialize Firebase Admin SDK with the given service account key."""
        try:
            # Check if app is already initialized
            if not firebase_admin._apps:
                # Read base64 encoded key string from environment
                b64_key = os.getenv(base64_service_account_key_env)
                if not b64_key:
                    raise ValueError(
                        f"Environment variable '{base64_service_account_key_env}' not found or empty."
                    )

                # Decode base64 to JSON string
                json_str = base64.b64decode(b64_key).decode("utf-8")

                # Load JSON into dict
                service_account_info = json.loads(json_str)

                # Create credentials object from dict
                cred = credentials.Certificate(service_account_info)

                # Initialize Firebase app
                firebase_admin.initialize_app(cred)
            self.db = firestore.client()
            print("Firebase initialized successfully.")
        except Exception as e:
            print(f"Error initializing Firebase: {e}")
            raise

    def insert_document(
        self, collection_name: str, data: dict, doc_id: str = None
    ) -> str:
        """
        Insert data into Firestore collection.

        :param collection_name: Firestore collection name.
        :param data: Dictionary data to insert.
        :param doc_id: Optional document ID; if None, Firestore auto-generates one.
        :return: Document ID of inserted document.
        """
        try:
            collection_ref = self.db.collection(collection_name)
            if doc_id:
                doc_ref = collection_ref.document(doc_id)
                doc_ref.set(data)
                return doc_ref.id
            else:
                doc_ref = collection_ref.add(data)[1]
                return doc_ref.id
        except fb_exceptions.FirebaseError as fe:
            print(f"Firebase error while inserting document: {fe}")
            raise
        except Exception as e:
            print(f"General error while inserting document: {e}")
            raise


# Load environment variables
load_dotenv()
service_account_key = os.getenv("SERVICE_ACCOUNT_KEY", "")
firebase_service = FirebaseService("SERVICE_ACCOUNT_KEY")


def get_firebase_service():
    return firebase_service
