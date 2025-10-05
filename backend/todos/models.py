from django.db import models
from datetime import datetime
from bson import ObjectId
import json

class Todo:
    """
    Todo model for MongoDB
    Since we're using MongoDB, we don't inherit from Django's Model class
    """
    
    def __init__(self, title, description="", completed=False, created_at=None, updated_at=None, _id=None):
        self._id = _id or ObjectId()
        self.title = title
        self.description = description
        self.completed = completed
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()
    
    def to_dict(self):
        """Convert Todo instance to dictionary for MongoDB storage"""
        return {
            '_id': self._id,
            'title': self.title,
            'description': self.description,
            'completed': self.completed,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    
    @classmethod
    def from_dict(cls, data):
        """Create Todo instance from MongoDB document"""
        return cls(
            _id=data.get('_id'),
            title=data.get('title', ''),
            description=data.get('description', ''),
            completed=data.get('completed', False),
            created_at=data.get('created_at'),
            updated_at=data.get('updated_at')
        )
    
    def save(self):
        """Save todo to MongoDB"""
        from .mongodb import mongodb
        self.updated_at = datetime.utcnow()
        
        try:
            # Check if this todo already exists in the database
            existing_todo = mongodb.todos.find_one({'_id': self._id})
            
            if existing_todo:
                # Update existing todo
                result = mongodb.todos.update_one(
                    {'_id': self._id},
                    {'$set': self.to_dict()}
                )
                return result.modified_count > 0
            else:
                # Create new todo
                result = mongodb.todos.insert_one(self.to_dict())
                self._id = result.inserted_id
                return True
        except Exception as e:
            print(f"Error saving todo: {e}")
            return False
    
    def delete(self):
        """Delete todo from MongoDB"""
        from .mongodb import mongodb
        if self._id:
            result = mongodb.todos.delete_one({'_id': self._id})
            return result.deleted_count > 0
        return False
    
    @classmethod
    def get_all(cls):
        """Get all todos from MongoDB"""
        from .mongodb import mongodb
        todos_data = mongodb.todos.find().sort('created_at', -1)
        return [cls.from_dict(todo) for todo in todos_data]
    
    @classmethod
    def get_by_id(cls, todo_id):
        """Get todo by ID from MongoDB"""
        from .mongodb import mongodb
        try:
            todo_data = mongodb.todos.find_one({'_id': ObjectId(todo_id)})
            if todo_data:
                return cls.from_dict(todo_data)
        except:
            pass
        return None
    
    def __str__(self):
        return self.title
