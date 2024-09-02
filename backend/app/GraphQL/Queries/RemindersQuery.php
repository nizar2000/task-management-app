<?php

namespace App\GraphQL\Queries;

use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Query;
use App\Models\Reminder;

class RemindersQuery extends Query
{
    protected $attributes = [
        'name' => 'reminders',
    ];

    public function type(): Type
    {
        return Type::listOf(GraphQL::type('Reminder'));
    }
    public function args(): array
    {
        return [
            'user_id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The ID of the user',
            ],
        ];
    }

    public function resolve($root, $args)
    {
        return Reminder::where('user_id', $args['user_id'])->with('task')->get();
    }
}
