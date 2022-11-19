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
        Schema::create('import_slip_details', function (Blueprint $table) {
            $table->unsignedBigInteger('import_slip_id');
            $table->unsignedBigInteger('product_id');
            $table->primary(['import_slip_id', 'product_id']);
            $table->integer('import_quantity');
            $table->integer('import_price');
            $table->index('import_slip_id');
            $table->index('product_id');
            $table->foreign('import_slip_id')->references('id')->on('import_slips')->restrictOnDelete();
            $table->foreign('product_id')->references('id')->on('products')->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('import_slip_details');
    }
};
