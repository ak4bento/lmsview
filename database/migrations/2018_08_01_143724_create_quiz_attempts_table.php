<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQuizAttemptsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('quiz_attempts', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('teachable_user_id');
            $table->unsignedInteger('attempt')->default(1);
            $table->json('questions');
            $table->json('answers');
            $table->dateTime('completed_at')->nullable();
            $table->timestamps();
        });
        $grades = \App\Grade::all();
        Schema::table('grades', function (Blueprint $table) {
            $table->dropColumn('teachable_user_id');
            $table->string('gradeable_type')->after('id');
            $table->bigInteger('gradeable_id')->after('id');
        });
        $grades->each(function($grade) {
            $grade->gradeable_type = 'teachableUser';
            $grade->gradeable_id = $grade->teachable_user_id;
            unset( $grade->teachable_user_id );
            $grade->save();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $grades = \App\Grade::all();
        Schema::table('grades', function (Blueprint $table) {
            $table->unsignedInteger('teachable_user_id')->after('id');
            $table->dropColumn('gradeable_type');
            $table->dropColumn('gradeable_id');
        });
        $grades->each(function($grade) {
            $grade->teachable_user_id = $grade->gradeable_id;
            unset( $grade->gradeable_type );
            unset( $grade->gradeable_id );
            $grade->save();
        });
        Schema::dropIfExists('quiz_attempts');
    }
}
