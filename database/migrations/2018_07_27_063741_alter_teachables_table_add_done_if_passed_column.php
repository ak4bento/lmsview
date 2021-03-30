<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTeachablesTableAddDoneIfPassedColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('teachables', function (Blueprint $table) {
            $table->float('pass_threshold')->default(0)->after('expires_at');
            $table->dropColumn('obligatory');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('teachables', function (Blueprint $table) {
            $table->dropColumn('done_if_passed');
            $table->boolean('obligatory')->default(false)->after('expires_at');
        });
    }
}
