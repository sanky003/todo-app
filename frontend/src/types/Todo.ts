export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
}

export interface UpdateTodoInput {
  id: string;
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface TodoMutationResponse {
  todo?: Todo;
  success: boolean;
  message: string;
}

export interface DeleteTodoResponse {
  success: boolean;
  message: string;
}
