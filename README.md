# Todo App - Full Stack Application

A modern todo application built with React, TypeScript, GraphQL, Django, and MongoDB.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Apollo Client + Styled Components
- **Backend**: Django 5.2 + GraphQL (Graphene-Django)
- **Database**: MongoDB
- **Styling**: Styled Components with modern UI design

## Features

- ✅ Create, read, update, and delete todos
- 📱 Responsive design
- 🎨 Modern, beautiful UI
- ⚡ Real-time updates with GraphQL
- 🔄 Optimistic UI updates
- 📊 Todo statistics (total, pending, completed)
- ✏️ Inline editing
- 🗑️ Delete confirmation

## Prerequisites

Before running this application, make sure you have the following installed:

- Python 3.8+
- Node.js 16+
- MongoDB (running locally on port 27017)

## Setup Instructions

### 1. Start MongoDB

Make sure MongoDB is running on your local machine:

```bash
# On macOS with Homebrew
brew services start mongodb/brew/mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# Or start manually
mongod
```

### 2. Backend Setup

Navigate to the backend directory and set up the Django application:

```bash
cd backend

# Create and activate virtual environment (if not already done)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run Django migrations (creates SQLite database for Django admin)
python manage.py migrate

# Create a superuser (optional, for Django admin)
python manage.py createsuperuser

# Start the Django development server
python manage.py runserver
```

The backend will be available at `http://localhost:8000`
- GraphQL Playground: `http://localhost:8000/graphql/`
- Django Admin: `http://localhost:8000/admin/`

### 3. Frontend Setup

In a new terminal, navigate to the frontend directory:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will be available at `http://localhost:3000`

## Usage

1. **Create a Todo**: Use the "Add New Todo" form at the top of the page
2. **Edit a Todo**: Click the edit icon (pencil) on any todo item
3. **Mark Complete**: Click the checkmark icon to toggle completion status
4. **Delete a Todo**: Click the trash icon and confirm deletion
5. **View Statistics**: See total, pending, and completed todo counts

## GraphQL API

The application uses GraphQL for all data operations. You can explore the API using the GraphQL Playground at `http://localhost:8000/graphql/`.

### Example Queries

```graphql
# Get all todos
query {
  todos {
    id
    title
    description
    completed
    created_at
    updated_at
  }
}

# Create a new todo
mutation {
  createTodo(title: "Learn GraphQL", description: "Study GraphQL fundamentals") {
    todo {
      id
      title
      description
      completed
    }
    success
    message
  }
}

# Update a todo
mutation {
  updateTodo(id: "todo_id", completed: true) {
    todo {
      id
      title
      completed
    }
    success
    message
  }
}

# Delete a todo
mutation {
  deleteTodo(id: "todo_id") {
    success
    message
  }
}
```

## Project Structure

```
todo-app/
├── backend/                 # Django backend
│   ├── todo_backend/        # Django project settings
│   ├── todos/               # Django app
│   │   ├── models.py        # Todo model for MongoDB
│   │   ├── schema.py        # GraphQL schema
│   │   └── mongodb.py       # MongoDB connection
│   ├── requirements.txt     # Python dependencies
│   └── manage.py           # Django management script
├── frontend/               # React frontend
│   ├── src/
│   │   ├── apollo/         # Apollo Client setup
│   │   ├── components/     # React components
│   │   ├── types/          # TypeScript type definitions
│   │   └── App.tsx         # Main app component
│   └── package.json        # Node.js dependencies
└── README.md              # This file
```

## Learning Objectives

This project demonstrates:

1. **Full-stack development** with modern technologies
2. **GraphQL** implementation with Django and React
3. **MongoDB** integration with Django
4. **TypeScript** usage in React applications
5. **Apollo Client** for GraphQL state management
6. **Styled Components** for CSS-in-JS styling
7. **Modern React patterns** (hooks, functional components)
8. **Error handling** and loading states
9. **Responsive design** principles

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**: Ensure MongoDB is running on port 27017
2. **CORS Issues**: Make sure the backend is running on port 8000
3. **GraphQL Errors**: Check the Django server logs for backend errors
4. **Port Conflicts**: Ensure ports 3000 (frontend) and 8000 (backend) are available

### Development Tips

- Use the GraphQL Playground to test queries and mutations
- Check browser developer tools for network errors
- Monitor Django server logs for backend issues
- Use React Developer Tools for component debugging

## Next Steps

To extend this application, consider adding:

- User authentication and authorization
- Todo categories and tags
- Due dates and reminders
- File attachments
- Search and filtering
- Real-time notifications
- Mobile app (React Native)
- Unit and integration tests
- Docker containerization
- CI/CD pipeline
- AI powered search on db to maybe notify you
  
