import React from 'react';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { GET_TODOS } from '../apollo/queries';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';
import { Loader2 } from 'lucide-react';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: #6b7280;
`;

const ErrorContainer = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const EmptyContainer = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const StatsContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-around;
  text-align: center;
`;

const StatItem = styled.div`
  flex: 1;
`;

const StatNumber = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const TodoList: React.FC = () => {
  const { loading, error, data } = useQuery(GET_TODOS);

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <Loader2 size={32} className="animate-spin" />
          <span style={{ marginLeft: '12px' }}>Loading todos...</span>
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <strong>Error loading todos:</strong> {error.message}
        </ErrorContainer>
      </Container>
    );
  }

  const todos: Todo[] = data?.todos || [];
  const completedTodos = todos.filter(todo => todo.completed);
  const pendingTodos = todos.filter(todo => !todo.completed);

  return (
    <Container>
      <StatsContainer>
        <StatItem>
          <StatNumber>{todos.length}</StatNumber>
          <StatLabel>Total</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>{pendingTodos.length}</StatNumber>
          <StatLabel>Pending</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>{completedTodos.length}</StatNumber>
          <StatLabel>Completed</StatLabel>
        </StatItem>
      </StatsContainer>

      {todos.length === 0 ? (
        <EmptyContainer>
          <EmptyIcon>📝</EmptyIcon>
          <h3>No todos yet</h3>
          <p>Create your first todo to get started!</p>
        </EmptyContainer>
      ) : (
        <div>
          {pendingTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
          {completedTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      )}
    </Container>
  );
};

export default TodoList;
