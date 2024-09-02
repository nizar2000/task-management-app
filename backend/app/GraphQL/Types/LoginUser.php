<?php

declare(strict_types=1);

namespace App\GraphQL\Types;

use GraphQL\GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL as FacadesGraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;


class LoginUser extends GraphQLType
{
    protected $attributes = [
        'name' => 'LoginUser',
        'description' => 'A type'
    ];

    public function fields(): array
    {
        return [
            "user" => [
                'type' => FacadesGraphQL::type('User'),
                'description' => "user"
            ],
            "token" => [
                "type" => Type::string(),
                "description" => "Name of user",
            ]
        ];
    }
}