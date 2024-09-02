<?php

declare(strict_types=1);

namespace App\GraphQL\Types;

use Rebing\GraphQL\Support\Type as GraphQLType;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL as FacadesGraphQL;


class RegisterUser extends GraphQLType
{
    protected $attributes = [
        'name' => 'RegisterUser',
        'description' => 'A type'
    ];

    public function fields(): array
    {
        return [
            "name" => [
                "type" => Type::string(),
                "description" => "Name of user",
            ],
            "email" => [
                "type" => Type::string(),
                "description" => "User email",
            ] ,
              "user" => [
                'type' => FacadesGraphQL::type('User'),
                'description' => "user"
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
        ];
    }
}