<?php

namespace App\GraphQL\Mutations\Task;

use App\Models\Task;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Mutation;

class CreateTaskMutation extends Mutation
{
    protected $attributes = [
        'name' => 'createTask',
    ];

    public function type(): Type
    {
        return GraphQL::type('Task');
    }

    public function args(): array
    {
        return [
            'title' => [
                'name' => 'title',
                'type' => Type::nonNull(Type::string()),
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
                'type' => Type::nonNull(Type::int()),
            ],
            'priority' => [
                'name' => 'priority',
                'type' => Type::nonNull(Type::string()),
            ],
            'status' => [
                'name' => 'status',
                'type' => Type::nonNull(Type::string()),
            ],
        ];
    }

    public function resolve($root, $args)
    {
        $task = new Task();
        $task->title = $args['title'];
        $task->description = $args['description'] ?? '';
        $task->due_date = $args['due_date'] ?? null;
        $task->user_id = $args['user_id'];
        $task->priority = $args['priority'];
        $task->status = $args['status'];
        $task->save();

        return $task;
    }
}
