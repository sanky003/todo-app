from pymongo import MongoClient
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class MongoDBConnection:
    _instance = None
    _client = None
    _db = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MongoDBConnection, cls).__new__(cls)
            cls._instance._connect()
        return cls._instance
    
    def _connect(self):
        try:
            mongodb_config = settings.MONGODB_SETTINGS
            connection_string = f"mongodb://{mongodb_config['HOST']}:{mongodb_config['PORT']}"
            self._client = MongoClient(connection_string)
            self._db = self._client[mongodb_config['NAME']]
            logger.info("Connected to MongoDB successfully")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise
    
    @property
    def db(self):
        return self._db
    
    @property
    def todos(self):
        return self._db.todos
    
    def close(self):
        if self._client:
            self._client.close()

# Global instance
mongodb = MongoDBConnection()
