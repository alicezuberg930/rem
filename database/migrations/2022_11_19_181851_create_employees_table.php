<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('username', 255);
            $table->string('phonenumber', 10);
            $table->string('email', 255);
            $table->string('gender', 10);
            $table->string('password', 255);
            $table->unsignedBigInteger('role_as');
            $table->index('role_as');
            $table->foreign('role_as')->references('id')->on('groups');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employees');
    }
};
