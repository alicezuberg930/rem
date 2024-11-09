<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use function Laravel\Prompts\table;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->constrained('users');
            $table->text("address");
            $table->string("nickname");
            $table->string("phone", 10);
            $table->tinyInteger("is_default")->default(0);

            $table->string("province_code")->index();
            $table->foreign('province_code')->references('code')->on('provinces');

            $table->string("district_code")->index();
            $table->foreign('district_code')->references('code')->on('districts');

            $table->string("ward_code")->index();
            $table->foreign('ward_code')->references('code')->on('wards');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
