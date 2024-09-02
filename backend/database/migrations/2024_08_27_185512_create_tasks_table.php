<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->unsignedBigInteger('user_id'); // Foreign key to users table
            $table->string('title'); // Title of the task
            $table->string('priority'); // Title of the task
            $table->string('status'); // Title of the task

            $table->text('description')->nullable(); // Description of the task (optional)
            $table->date('due_date')->nullable(); // Due date of the task (optional)
            $table->timestamps(); // Created at and updated at timestamps

            // Foreign key constraint

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
