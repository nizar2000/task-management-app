<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations\Reminder;

use App\Models\Reminder;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Mutation;

class AddReminderMutation extends Mutation
{
    protected $attributes = [
        'name' => 'addReminder',
    ];

    public function type(): Type
    {
        return GraphQL::type('Reminder');
    }

    public function args(): array
    {
        return [
            'task_id' => [
                'type' => Type::nonNull(Type::int()),
            ],
            'message' => [
                'type' => Type::nonNull(Type::string()),
            ],
            'time' => [
                'type' => Type::nonNull(Type::string()),
            ],
            'user_id' => [
                'type' => Type::nonNull(Type::int()),
            ],
        ];
    }

    public function resolve($root, $args)
    {
        return Reminder::create($args);
    }
}
