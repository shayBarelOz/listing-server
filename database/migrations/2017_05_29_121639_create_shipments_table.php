<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateShipmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shipments_items', function (Blueprint $table) {
            $table->string('shipmentid');
            $table->string('sellersku');
            $table->string('asin');
            $table->int('shipmentid');
            $table->string('fsku');
            $table->string('upc');
            $table->string('batchid');
            $table->string('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('shipments_items');
    }
}
