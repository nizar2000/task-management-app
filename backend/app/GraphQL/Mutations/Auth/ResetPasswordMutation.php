<?php
namespace App\GraphQL\Mutations\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Rebing\GraphQL\Support\Mutation;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Illuminate\Support\Facades\Validator;

class ResetPasswordMutation extends Mutation
{
    protected $attributes = [
        'name' => 'resetPassword',
    ];

    public function type(): Type
    {
        return GraphQL::type('ResetPasswordResponse');
    }

    public function args(): array
    {
        return [
            'email' => [
                'name' => 'email',
                'type' => Type::nonNull(Type::string()),
            ],
            'token' => [
                'name' => 'token',
                'type' => Type::nonNull(Type::string()),
            ],
            'password' => [
                'name' => 'password',
                'type' => Type::nonNull(Type::string()),
            ],
            'password_confirmation' => [
                'name' => 'password_confirmation',
                'type' => Type::nonNull(Type::string()),
            ],
        ];
    }

    public function resolve($root, $args)
    {
        $validator = Validator::make($args, [
            'email' => 'required|email|exists:users,email',
            'token' => 'required',
            'password' => 'required|min:8|confirmed',
            'password_confirmation' => 'required',
        ]);

        if ($validator->fails()) {
            return [
                'success' => false,
                'message' => $validator->errors()->first(),
            ];
        }

        $record = \DB::table('password_reset_tokens')
            ->where('email', $args['email'])
            ->where('token', $args['token'])
            ->first();

        if (!$record || now()->diffInMinutes($record->created_at) > 60) {
            return [
                'success' => false,
                'message' => 'Invalid or expired token.',
            ];
        }

        $user = User::where('email', $args['email'])->first();
        $user->password = Hash::make($args['password']);
        $user->save();

        \DB::table('password_reset_tokens')->where('email', $args['email'])->delete();

        return [
            'success' => true,
            'message' => 'Password has been reset.',
        ];
    }
}
