<?php


namespace App\GraphQL\Types;

use App\Models\Task;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;

class TaskType extends GraphQLType
{
    protected $attributes = [
        'name' => 'Task',
        'description' => 'A task',
        'model' => Task::class,
    ];

    public function fields(): array
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::id()),
                'description' => 'The ID of the task',
            ],
            'title' => [
                'type' => Type::string(),
                'description' => 'The title of the task',
            ],
            'description' => [
                'type' => Type::string(),
                'description' => 'The description of the task',
            ],
            'due_date' => [
                'type' => Type::string(),
                'description' => 'The due date of the task',
            ],
            'user_id' => [
                'type' => Type::int(),
                'description' => 'The user ID associated with the task',
            ],
            'priority' => [
                'type' => Type::string(),
                'description' => 'The priority of the task',
            ],
            'status' => [
                'type' => Type::string(),
                'description' => 'The status of the task',
            ],
        ];
    }
}
