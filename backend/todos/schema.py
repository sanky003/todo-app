import graphene
from graphene import ObjectType, String, Boolean, List, Field, ID, DateTime
from .models import Todo
from datetime import datetime

class TodoType(ObjectType):
    """GraphQL type for Todo"""
    id = ID()
    title = String()
    description = String()
    completed = Boolean()
    created_at = DateTime()
    updated_at = DateTime()
    
    def resolve_id(self, info):
        return str(self._id)

class CreateTodo(graphene.Mutation):
    """Mutation to create a new todo"""
    class Arguments:
        title = String(required=True)
        description = String()
    
    todo = Field(TodoType)
    success = Boolean()
    message = String()
    
    def mutate(self, info, title, description=""):
        try:
            todo = Todo(title=title, description=description)
            todo.save()
            return CreateTodo(todo=todo, success=True, message="Todo created successfully")
        except Exception as e:
            return CreateTodo(todo=None, success=False, message=f"Error creating todo: {str(e)}")

class UpdateTodo(graphene.Mutation):
    """Mutation to update an existing todo"""
    class Arguments:
        id = ID(required=True)
        title = String()
        description = String()
        completed = Boolean()
    
    todo = Field(TodoType)
    success = Boolean()
    message = String()
    
    def mutate(self, info, id, **kwargs):
        try:
            todo = Todo.get_by_id(id)
            if not todo:
                return UpdateTodo(todo=None, success=False, message="Todo not found")
            
            # Update fields if provided
            if 'title' in kwargs:
                todo.title = kwargs['title']
            if 'description' in kwargs:
                todo.description = kwargs['description']
            if 'completed' in kwargs:
                todo.completed = kwargs['completed']
            
            todo.save()
            return UpdateTodo(todo=todo, success=True, message="Todo updated successfully")
        except Exception as e:
            return UpdateTodo(todo=None, success=False, message=f"Error updating todo: {str(e)}")

class DeleteTodo(graphene.Mutation):
    """Mutation to delete a todo"""
    class Arguments:
        id = ID(required=True)
    
    success = Boolean()
    message = String()
    
    def mutate(self, info, id):
        try:
            todo = Todo.get_by_id(id)
            if not todo:
                return DeleteTodo(success=False, message="Todo not found")
            
            todo.delete()
            return DeleteTodo(success=True, message="Todo deleted successfully")
        except Exception as e:
            return DeleteTodo(success=False, message=f"Error deleting todo: {str(e)}")

class Query(ObjectType):
    """GraphQL queries"""
    todos = List(TodoType)
    todo = Field(TodoType, id=ID(required=True))
    
    def resolve_todos(self, info):
        """Get all todos"""
        try:
            return Todo.get_all()
        except Exception as e:
            return []
    
    def resolve_todo(self, info, id):
        """Get a specific todo by ID"""
        try:
            return Todo.get_by_id(id)
        except Exception as e:
            return None

class Mutation(ObjectType):
    """GraphQL mutations"""
    create_todo = CreateTodo.Field()
    update_todo = UpdateTodo.Field()
    delete_todo = DeleteTodo.Field()
