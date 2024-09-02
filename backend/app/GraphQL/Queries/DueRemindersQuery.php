<?php
declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Reminder;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Query;

class DueRemindersQuery extends Query
{
    protected $attributes = [
        'name' => 'dueReminders',
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
        // Use 'Africa/Lagos' or 'Europe/Brussels' for UTC+1
        $now = now('Africa/Lagos'); // or 'Europe/Brussels'
    
        \Log::info("Current local (UTC+1): $now");
    
        return Reminder::where('user_id', $args['user_id'])
            ->where('time', '<=', $now)
            ->with('task')
            ->get();
    }
    
    
}
