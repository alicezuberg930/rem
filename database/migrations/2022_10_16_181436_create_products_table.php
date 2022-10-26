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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('image', 255);
            $table->string('name', 255);
            $table->integer('amount');
            $table->bigInteger('price');
            $table->string('category', 100);
            $table->string('material', 40);
            $table->string('origin', 40);
            $table->text('description');
            $table->unsignedBigInteger('discount')->nullable();
            $table->index('discount');
            $table->foreign('discount')->references('id')->on('sales')->nullOnDelete()->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
};
