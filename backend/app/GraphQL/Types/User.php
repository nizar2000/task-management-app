<?php

declare(strict_types=1);

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;

class User extends GraphQLType
{
    protected $attributes = [
        'name' => 'User',
        'description' => 'User type definition'
    ];

    public function fields(): array
    {
        return [
            'id' => [
                'type' => Type::id(),
                'description' => 'id of the user',
            ],
            'name' => [
                'type' => Type::string(),
                'description' => 'Name of the user',
            ],
            'email' => [
                'type' => Type::string(),
                'description' => 'Email of the user',
            ],
            'token' => [
                'type' => Type::string(),
                'description' => 'Authentication token of the user',
                // If 'token' is a field that needs to be resolved dynamically,
                // you would typically define a 'resolve' method for it.
                // Example:
                // 'resolve' => function ($root, $args) {
                //     return $root->token; // Assuming 'token' is a property on your User model
                // },
            ],
            'provider' => [
                'type' => Type::string(),
                'description' => 'The OAuth provider',
            ],
            'provider_id' => [
                'type' => Type::string(),
                'description' => 'The OAuth provider ID',
            ],
        ];
    }
}
