<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->tinyInteger("active")->default(1);
            $table->string("secret_key")->nullable();
            $table->string("public_key")->nullable();
            $table->string("hash_key")->nullable();
            $table->string("merchant_key")->nullable();
            $table->string("merchant_name")->nullable();
            $table->string("access_token")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_methods');
    }
};
