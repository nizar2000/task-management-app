<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations\Reminder;

use App\Models\Reminder;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Mutation;

class DeleteReminderMutation extends Mutation
{
    protected $attributes = [
        'name' => 'deleteReminder',
    ];

    public function type(): Type
    {
        return Type::id();
    }

    public function args(): array
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::id()),
            ],
        ];
    }

    public function resolve($root, $args)
    {
        $reminder = Reminder::findOrFail($args['id']);
        $reminder->delete();

        return $args['id'];
    }
}
