<?php

namespace App\GraphQL\Mutations\Task;

use App\Models\Task;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Mutation;

class UpdateTaskMutation extends Mutation
{
    protected $attributes = [
        'name' => 'updateTask',
    ];

    public function type(): Type
    {
        return GraphQL::type('Task');
    }

    public function args(): array
    {
        return [
            'id' => [
                'name' => 'id',
                'type' => Type::nonNull(Type::id()),
            ],
            'title' => [
                'name' => 'title',
                'type' => Type::string(),
            ],
            'description' => [
                'name' => 'description',
                'type' => Type::string(),
            ],
            'due_date' => [
                'name' => 'due_date',
                'type' => Type::string(),
            ],
            'user_id' => [
                'name' => 'user_id',
                'type' => Type::int(),
            ],
            'priority' => [
                'name' => 'priority',
                'type' => Type::string(),
            ],
            'status' => [
                'name' => 'status',
                'type' => Type::string(),
            ],
        ];
    }

    public function resolve($root, $args)
    {
        $task = Task::find($args['id']);
        if (!$task) {
            return null;
        }

        if (isset($args['title'])) {
            $task->title = $args['title'];
        }

        if (isset($args['description'])) {
            $task->description = $args['description'];
        }

        if (isset($args['due_date'])) {
            $task->due_date = $args['due_date'];
        }

        if (isset($args['user_id'])) {
            $task->user_id = $args['user_id'];
        }

        if (isset($args['priority'])) {
            $task->priority = $args['priority'];
        }

        if (isset($args['status'])) {
            $task->status = $args['status'];
        }

        $task->save();

        return $task;
    }
}
