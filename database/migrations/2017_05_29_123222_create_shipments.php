<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateShipments extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->string('shipment_id');
            $table->string('dest_id');
            $table->string('label');
            $table->string('ship_to');
            $table->string('ship_to_city');
            $table->string('ship_to_address');
            $table->string('ship_to_state');
            $table->string('ship_to_postal_code');
            $table->string('status');
            $table->string('batch_id');
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
        Schema::dropIfExists('shipments');
    }
}
