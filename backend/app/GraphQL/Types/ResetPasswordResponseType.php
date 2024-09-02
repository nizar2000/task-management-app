<?php
namespace App\GraphQL\Types;

use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;

class ResetPasswordResponseType extends GraphQLType
{
    protected $attributes = [
        'name' => 'ResetPasswordResponse',
        'description' => 'A type for reset password response'
    ];

    public function fields(): array
    {
        return [
            'success' => [
                'type' => Type::nonNull(Type::boolean()),
            ],
            'message' => [
                'type' => Type::string(),
                'description' => 'The response message'
            ],
        ];
    }
}
