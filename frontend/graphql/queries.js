// src/graphql/queries.js
import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  query GetTasks($user_id: Int!) {
    tasks (user_id: $user_id){
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
export const GET_REMINDERS = gql`
  query GetReminders($user_id: Int!) {
    reminders (user_id: $user_id){
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
export const GET_DUE_REMINDERS = gql`
  query GetDueReminders($user_id: Int!) {
    dueReminders(user_id: $user_id) {
      id
      task {
        id
        title
      }
      message
      time
    }
  }
`;

