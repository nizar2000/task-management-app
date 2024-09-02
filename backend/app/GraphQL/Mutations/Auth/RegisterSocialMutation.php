<?php

namespace App\GraphQL\Mutations\Auth;

use Rebing\GraphQL\Support\Mutation;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use GraphQL\Error\UserError;
use Exception;
use Illuminate\Support\Facades\Hash;

class RegisterSocialMutation extends Mutation
{
    protected $attributes = [
        'name' => 'RegisterSocial',
    ];

    public function type(): Type
    {
        return GraphQL::type('OAuthToken'); // Ensure OAuthToken is correctly defined
    }

    public function args(): array
    {
        return [
            'provider' => ['name' => 'provider', 'type' => Type::nonNull(Type::string())],
            'token' => ['name' => 'token', 'type' => Type::nonNull(Type::string())],
        ];
    }

    public function resolve($root, $args)
    {
        try {
            // Validate provider and token
            if (empty($args['provider']) || empty($args['token'])) {
                throw new UserError('Provider or token is missing.');
            }

            // Check if the provider is valid
            $validProviders = ['google', 'facebook']; // List all supported providers here
            if (!in_array($args['provider'], $validProviders)) {
                throw new UserError('Invalid provider.');
            }

            // Authenticate with the specified provider
            $provider = $args['provider'];
            $socialiteUser = Socialite::driver($provider)->userFromToken($args['token']);

            if (!$socialiteUser) {
                throw new UserError('Unable to authenticate with the provider.');
            }

            // Check if user exists
            $user = User::where('email', $socialiteUser->email)->first();

            if (!$user) {
                // Create new user if not exists
                $user = User::create([
                    'name' => $socialiteUser->name,
                    'email' => $socialiteUser->email,
                    'password' => Hash::make(rand(100000,999999)),
                    'provider' => $provider,
                    'provider_id' => $socialiteUser->id,
                ]);
            }

            // Generate tokens
            $accessToken = $user->createToken('Personal Access Token')->plainTextToken;
            $refreshToken = ''; // Replace with your logic for refresh tokens

            return [
                'access_token' => $accessToken,
                'token_type' => 'Bearer',
                'expires_in' => 3600,
                'refresh_token' => $refreshToken,
                'user' => $user,
            ];
        } catch (Exception $e) {
            Log::error('Error in RegisterSocialMutation: ' . $e->getMessage());

            // Provide detailed error messages based on exception type
            if ($e instanceof \Laravel\Socialite\Exceptions\InvalidStateException) {
                throw new UserError('Authentication state is invalid. Please try again.');
            } elseif ($e instanceof \Illuminate\Database\QueryException) {
                throw new UserError('Database error occurred while registering the user.');
            } else {
                throw new UserError('An unexpected error occurred. Please try again later.');
            }
        }
    }
}
