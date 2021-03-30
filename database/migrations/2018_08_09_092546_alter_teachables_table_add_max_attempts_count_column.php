<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTeachablesTableAddMaxAttemptsCountColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table( 'teachables', function ( Blueprint $table ) {
            $table->unsignedInteger( 'max_attempts_count' )->default( 0 )->after( 'final_grade_weight' );
        } );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table( 'teachables', function ( Blueprint $table ) {
            $table->dropColumn( 'max_attempts_count' );
        } );
    }
}
