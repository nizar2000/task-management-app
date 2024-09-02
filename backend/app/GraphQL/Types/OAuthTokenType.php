<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;

class OAuthTokenType extends GraphQLType
{
    protected $attributes = [
        'name' => 'OAuthToken',
        'description' => 'A type representing an OAuth token',
    ];

    public function fields(): array
    {
        return [
            'access_token' => [
                'type' => Type::nonNull(Type::string()),
                'description' => 'The access token',
            ],
            'token_type' => [
                'type' => Type::nonNull(Type::string()),
                'description' => 'The type of the token',
            ],
            'expires_in' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The expiration time of the token in seconds',
            ],
            'refresh_token' => [
                'type' => Type::string(),
                'description' => 'The refresh token, if available',
            ],
            'user' => [
                'type' => \GraphQL::type('User'),
                'description' => 'The authenticated user',
            ],
        ];
    }
}
