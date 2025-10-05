import React, { useState } from 'react';
import { ApolloProvider, useQuery, useMutation } from '@apollo/client';
import styled, { createGlobalStyle } from 'styled-components';
import client from './apollo/client';
import { GET_TODOS, CREATE_TODO } from './apollo/queries';
import { CheckSquare, Plus } from 'lucide-react';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: #1f2937;
  }
  
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  padding: 40px 20px;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
`;

const HeaderTitle = styled.h1`
  color: white;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const HeaderSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  font-weight: 300;
`;

const MainContent = styled.main`
  max-width: 800px;
  margin: 0 auto;
`;

const WelcomeCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const WelcomeTitle = styled.h2`
  color: #1f2937;
  font-size: 2rem;
  margin-bottom: 16px;
`;

const WelcomeText = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 24px;
`;

const StatusBadge = styled.div`
  background: #10b981;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
  display: inline-block;
  margin: 8px;
`;

const TodoCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #3b82f6;
`;

const TodoTitle = styled.h3`
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 18px;
`;

const TodoDescription = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 14px;
`;

const AddTodoForm = styled.form`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #1f2937;
  font-size: 20px;
  font-weight: 600;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const Button = styled.button<{ disabled?: boolean }>`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const TodoList = () => {
  const { loading, error, data } = useQuery(GET_TODOS);

  if (loading) return <div>Loading todos...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const todos = data?.todos || [];

  return (
    <div>
      <h3 style={{ color: 'white', marginBottom: '20px' }}>Your Todos ({todos.length})</h3>
      {todos.length === 0 ? (
        <TodoCard>
          <TodoTitle>No todos yet</TodoTitle>
          <TodoDescription>Create your first todo using the GraphQL API!</TodoDescription>
        </TodoCard>
      ) : (
        todos.map((todo: any) => (
          <TodoCard key={todo.id}>
            <TodoTitle>{todo.title}</TodoTitle>
            <TodoDescription>{todo.description}</TodoDescription>
          </TodoCard>
        ))
      )}
    </div>
  );
};

const AddTodo = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [createTodo, { loading }] = useMutation(CREATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
    onCompleted: () => {
      setTitle('');
      setDescription('');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }

    try {
      await createTodo({
        variables: {
          title: title.trim(),
          description: description.trim() || null,
        },
      });
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  return (
    <AddTodoForm onSubmit={handleSubmit}>
      <FormTitle>Add New Todo</FormTitle>
      <FormGroup>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          required
          disabled={loading}
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="description">Description</Label>
        <TextArea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details (optional)"
          disabled={loading}
        />
      </FormGroup>
      
      <Button type="submit" disabled={loading || !title.trim()}>
        <Plus size={20} />
        {loading ? 'Adding...' : 'Add Todo'}
      </Button>
    </AddTodoForm>
  );
};

function App() {
  return (
    <ApolloProvider client={client}>
      <GlobalStyle />
      <AppContainer>
        <Header>
          <HeaderTitle>
            <CheckSquare size={48} />
            Todo App
          </HeaderTitle>
          <HeaderSubtitle>
            Manage your tasks with ease
          </HeaderSubtitle>
        </Header>
        
        <MainContent>
          
          
          <AddTodo />
          <TodoList />
        </MainContent>
      </AppContainer>
    </ApolloProvider>
  );
}

export default App;