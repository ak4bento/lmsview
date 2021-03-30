<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTeachablesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('teachables', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('classroom_id');
            $table->morphs('teachable');
            $table->unsignedInteger('order');
            $table->unsignedInteger('created_by');
            $table->dateTime('available_at')->nullable();
            $table->dateTime('expires_at')->nullable();
            $table->boolean('obligatory')->default(false);
            $table->float('final_grade_weight')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('assignments', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title');
            $table->text('description');
            $table->unsignedInteger('created_by');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('quizzes', function (Blueprint $table) {
            $table->increments('id');
            $table->string('type');
            $table->string('grading_method');
            $table->string('title');
            $table->text('description');
            $table->unsignedInteger('created_by');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('resources', function (Blueprint $table) {
            $table->increments('id');
            $table->string('type');
            $table->string('title');
            $table->text('description');
            $table->text('data');
            $table->unsignedInteger('created_by');
            $table->timestamps();
            $table->softDeletes();
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('resources');
        Schema::dropIfExists('quizzes');
        Schema::dropIfExists('assignments');
        Schema::dropIfExists('teachables');
    }
}
