<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTeachingPeriodsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('teaching_periods', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->unique();
            $table->dateTime('starts_at');
            $table->dateTime('ends_at');
            $table->unsignedInteger('created_by');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('classrooms', function (Blueprint $table) {
            $table->unsignedInteger('teaching_period_id')->after('subject_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('classrooms', function (Blueprint $table) {
            $table->dropColumn('teaching_period_id');
        });
        Schema::dropIfExists('teaching_periods');
    }
}
