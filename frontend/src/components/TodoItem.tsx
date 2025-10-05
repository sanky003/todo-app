import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import { UPDATE_TODO, DELETE_TODO, GET_TODOS } from '../apollo/queries';
import { Todo } from '../types/Todo';
import { Edit, Trash2, Check, X } from 'lucide-react';

const TodoItemContainer = styled.div<{ completed: boolean }>`
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.completed ? '#10b981' : '#3b82f6'};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

const TodoHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
`;

const TodoContent = styled.div`
  flex: 1;
`;

const TodoTitle = styled.h3<{ completed: boolean }>`
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  opacity: ${props => props.completed ? 0.7 : 1};
`;

const TodoDescription = styled.p<{ completed: boolean }>`
  margin: 0;
  color: #6b7280;
  font-size: 14px;
  opacity: ${props => props.completed ? 0.7 : 1};
`;

const TodoActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'danger' | 'success' }>`
  background: ${props => {
    switch (props.variant) {
      case 'danger': return '#ef4444';
      case 'success': return '#10b981';
      default: return '#3b82f6';
    }
  }};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  min-height: 60px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);

  const [updateTodo, { loading: updateLoading }] = useMutation(UPDATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  const [deleteTodo, { loading: deleteLoading }] = useMutation(DELETE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  const handleToggleComplete = async () => {
    try {
      await updateTodo({
        variables: {
          id: todo.id,
          completed: !todo.completed,
        },
      });
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTodo({
        variables: {
          id: todo.id,
          title: editTitle,
          description: editDescription,
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodo({
          variables: { id: todo.id },
        });
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <TodoItemContainer completed={todo.completed}>
        <EditForm onSubmit={handleEdit}>
          <Input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Todo title"
            required
          />
          <TextArea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Todo description (optional)"
          />
          <FormActions>
            <ActionButton type="submit" disabled={updateLoading}>
              <Check size={16} />
            </ActionButton>
            <ActionButton type="button" onClick={handleCancelEdit}>
              <X size={16} />
            </ActionButton>
          </FormActions>
        </EditForm>
      </TodoItemContainer>
    );
  }

  return (
    <TodoItemContainer completed={todo.completed}>
      <TodoHeader>
        <TodoContent>
          <TodoTitle completed={todo.completed}>{todo.title}</TodoTitle>
          {todo.description && (
            <TodoDescription completed={todo.completed}>
              {todo.description}
            </TodoDescription>
          )}
        </TodoContent>
        <TodoActions>
          <ActionButton
            variant="success"
            onClick={handleToggleComplete}
            disabled={updateLoading}
            title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            <Check size={16} />
          </ActionButton>
          <ActionButton
            onClick={() => setIsEditing(true)}
            disabled={updateLoading}
            title="Edit todo"
          >
            <Edit size={16} />
          </ActionButton>
          <ActionButton
            variant="danger"
            onClick={handleDelete}
            disabled={deleteLoading}
            title="Delete todo"
          >
            <Trash2 size={16} />
          </ActionButton>
        </TodoActions>
      </TodoHeader>
    </TodoItemContainer>
  );
};

export default TodoItem;
