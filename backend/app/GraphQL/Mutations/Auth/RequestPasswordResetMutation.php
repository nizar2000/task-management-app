<?php
namespace App\GraphQL\Mutations\Auth;

use App\Models\User;
use App\Mail\PasswordResetMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Rebing\GraphQL\Support\Mutation;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Illuminate\Support\Facades\Validator;

class RequestPasswordResetMutation extends Mutation
{
    protected $attributes = [
        'name' => 'requestPasswordReset',
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
        ];
    }

    public function resolve($root, $args)
    {
        $validator = Validator::make($args, [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return [
                'success' => false,
                'message' => $validator->errors()->first(),
            ];
        }

        $user = User::where('email', $args['email'])->first();

        // Generate a token and store it in the database
        $token = Str::random(60);
        \DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            ['token' => $token, 'created_at' => now()]
        );

        // Send password reset email
        Mail::to($user->email)->send(new PasswordResetMail($token));

        return [
            'success' => true,
            'message' => 'Password reset link sent to your email.',
        ];
    }
}
