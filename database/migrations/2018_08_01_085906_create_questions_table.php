<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->increments('id');
            $table->string('question_type')->default('multiple-choice');
            $table->string('scoring_method')->default('default');
            $table->text('content');
            $table->unsignedInteger('created_by');
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::table('quizzes', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('quizzes', function (Blueprint $table) {
            $table->string('type')->after('id')->nullable();
        });
        Schema::dropIfExists('questions');
    }
}
