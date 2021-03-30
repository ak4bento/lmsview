<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTeachableUserTableRenameUserIdColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('teachable_user', function (Blueprint $table) {
            $table->renameColumn( 'user_id', 'classroom_user_id' );
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('teachable_user', function (Blueprint $table) {
            $table->renameColumn( 'classroom_user_id', 'user_id' );
        });
    }
}
