<?php
declare(strict_types=1);

namespace App\GraphQL\Mutations\Auth;

use App\Models\User;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Mutation;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UpdateUserMutation extends Mutation
{
    protected $attributes = [
        'name' => 'updateUser',
    ];

    public function type(): Type
    {
        return GraphQL::type('User');
    }

    public function args(): array
    {
        return [
            'id' => [
                'name' => 'id',
                'type' => Type::nonNull(Type::id()),
            ],
            'name' => [
                'name' => 'name',
                'type' => Type::string(),
            ],
            'email' => [
                'name' => 'email',
                'type' => Type::string(),
            ],
            'old_password' => [
                'name' => 'old_password',
                'type' => Type::string(),
            ],
            'new_password' => [
                'name' => 'new_password',
                'type' => Type::string(),
            ],
        ];
    }

    public function resolve($root, $args)
    {
        $user = User::find($args['id']);
        if (!$user) {
            throw new ValidationException('User not found.');
        }
    
        // Validate the old password if new password is provided
        if (isset($args['old_password']) && isset($args['new_password'])) {
            if (!Hash::check($args['old_password'], $user->password)) {
                throw ValidationException::withMessages([
                    'old_password' => ['The old password is incorrect.'],
                ]);
            }
            $user->password = bcrypt($args['new_password']);
        }
    
        // Update user fields
        $user->name = $args['name'] ?? $user->name;
        $user->email = $args['email'] ?? $user->email;
        $user->save();
    
        return $user;
    }
    
}
