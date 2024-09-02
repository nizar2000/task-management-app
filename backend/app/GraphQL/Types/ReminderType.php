<?php
declare(strict_types=1);

namespace App\GraphQL\Types;

use App\Models\Reminder;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class ReminderType extends GraphQLType
{
    protected $attributes = [
        'name' => 'Reminder',
        'description' => 'A reminder',
        'model' => Reminder::class,
    ];

    public function fields(): array
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::id()),
                'description' => 'The ID of the reminder',
            ],
            'task_id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The ID of the task',
            ],
            'message' => [
                'type' => Type::nonNull(Type::string()),
                'description' => 'The reminder message',
            ],
            'time' => [
                'type' => Type::nonNull(Type::string()),
                'description' => 'The reminder time',
            ],
            'user_id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The ID of the user',
            ],
            'task' => [
                'type' => GraphQL::type('Task'),
                'description' => 'The task associated with the reminder',
            ],
        ];
    }
}
