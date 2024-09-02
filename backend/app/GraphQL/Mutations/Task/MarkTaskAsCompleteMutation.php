<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations\Task;

use App\Models\Task;
use Closure;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Mutation;
use Rebing\GraphQL\Support\SelectFields;

class MarkTaskAsCompleteMutation extends Mutation
{
    protected $attributes = [
        'name' => 'markTaskAsComplete',
        'description' => 'Marks a task as complete'
    ];

    public function type(): Type
    {
        return \GraphQL::type('Task');
    }

    public function args(): array
    {
        return [
            'id' => [
                'name' => 'id',
                'type' => Type::nonNull(Type::id()),
            ],
        ];
    }

    public function resolve($root, array $args, $context, ResolveInfo $resolveInfo, Closure $getSelectFields)
    {
        $task = Task::findOrFail($args['id']);
        $task->status = 'completed';
        $task->save();

        return $task;
    }
}
