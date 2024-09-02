import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;
export const REGISTER_USER = gql`
  mutation RegisterUser($name: String!, $email: String!, $password: String!) {
    registerUser(name: $name, email: $email, password: $password)
     {
     
    
      
        name
        email
     
    }
  }
`;
export const CREATE_TASK = gql`
  mutation CreateTask($user_id: Int!,$title: String!, $description: String!, $due_date: String!, $priority: String!, $status: String!) {
    createTask(user_id: $user_id,title: $title, description: $description, due_date: $due_date, priority: $priority, status: $status) {
      id
      title
      description
      due_date
      priority
      status
    }
  }
`;
export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!,$user_id:Int! ,$title: String!, $description: String!, $due_date: String!, $priority: String!, $status: String!) {
    updateTask(id: $id, title: $title,user_id:$user_id, description: $description, due_date: $due_date, priority: $priority, status: $status) {
      id
      title
      description
      due_date
      priority
      status
      user_id
    }
  }
`;
export const DELETE_TASK = gql`
mutation deleteTask($id: ID!) {
  deleteTask(id: $id) {
    id
    title
    description
    due_date
    user_id
    priority
    status
  }
}
`;
export const ADD_REMINDER = gql`
  mutation AddReminder($task_id:Int!, $message: String!, $time: String!, $user_id: Int!) {
    addReminder(task_id: $task_id, message: $message, time: $time, user_id: $user_id) {
      id
      task_id
      message
      time
      user_id
      task {
        id
        title
        description
        due_date
        priority
        status
      }
    }
  }
`;
export const DELETE_REMINDER = gql`
mutation DeleteReminder($id: ID!) {
  deleteReminder(id: $id)
}
`;

export const REGISTER_SOCIAL_MUTATION = gql`
    mutation RegisterSocial($provider: String!, $token: String!) {
        RegisterSocial(provider: $provider, token: $token) {
          access_token
            token_type
            expires_in
           refresh_token
            user {
                id
                name
                email
                provider
            }
        }
    }
`;
export const UPDATE_USER = gql`
mutation UpdateUser($id: ID!, $name: String, $email: String, $old_password: String, $new_password: String) {
  updateUser(id: $id, name: $name, email: $email, old_password: $old_password, new_password: $new_password) {
    id
    name
    email
  }
}
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($email: String!, $password: String!, $password_confirmation: String!, $token: String!) {
    resetPassword(email: $email, password: $password, password_confirmation: $password_confirmation, token: $token) {
      success
      message
    }
  }
`;
export const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email) {
      success
      message
    }
  }
`;
export const MARK_TASK_AS_COMPLETE = gql`
  mutation MarkTaskAsComplete($id: ID!) {
    markTaskAsComplete(id: $id) {
      id
      status
    }
  }
`;