<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations\Auth;

use App\Models\User;
use Closure;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Mutation;
use Illuminate\Validation\ValidationException;
use Exception;

class RegisterUser extends Mutation
{
    protected $attributes = [
        'name' => 'registerUser',
        'description' => 'A mutation to register a user'
    ];

    public function type(): Type
    {
        return GraphQL::type('RegisterUser');
    }

    public function args(): array
    {
        return [
            'name' => [
                'name' => 'name',
                'type' => Type::string(),
                'rules' => ['required', 'string'],
            ],
            'email' => [
                'name' => 'email',
                'type' => Type::string(),
                'rules' => ['required', 'email', 'unique:users,email'],
            ],
            'password' => [
                'name' => 'password',
                'type' => Type::string(),
                'rules' => ['required', 'min:8'],
            ],
        ];
    }

    public function resolve($root, array $args, $context, ResolveInfo $resolveInfo, Closure $getSelectFields)
    {
        try {
            // Convert to UTF-8 encoding to prevent malformed UTF-8 characters
            $args['name'] = mb_convert_encoding($args['name'], 'UTF-8', 'UTF-8');
            $args['email'] = mb_convert_encoding($args['email'], 'UTF-8', 'UTF-8');

            // Validate the input data
            $validatedData = \Validator::make($args, [
                'name' => 'required|string',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:8',
            ])->validate();

            // Create the user in the database
            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => bcrypt($validatedData['password']),
            ]);

            return $user;
            if ($user) {
                return $user;
            } else {
                throw new \Exception('User could not be created');
            }

        } catch (ValidationException $e) {
            // Handle validation errors
            return [
                'status' => 'VALIDATION_ERROR',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ];

        } catch (\InvalidArgumentException $e) {
            // Handle JSON encoding errors
            \Log::error('JSON Encoding Error: ' . $e->getMessage());
            \Log::error('Data: ' . json_encode($args));

            return [
                'status' => 'ERROR',
                'message' => 'Data encoding issue. Please contact support.',
            ];

        } catch (Exception $e) {
            // Handle general errors
            return [
                'status' => 'ERROR',
                'message' => 'An error occurred while registering the user',
                'details' => $e->getMessage(),
            ];
        }
    }
}
