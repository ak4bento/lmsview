<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSubjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subjects', function (Blueprint $table) {
            $table->increments('id');
            $table->string('slug')->unique();
            $table->string('code')->nullable()->unique();
            $table->string('title');
            $table->text('description');
            $table->unsignedInteger('created_by');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('classrooms', function (Blueprint $table) {
            $table->unsignedInteger('subject_id')->after('id');
            $table->string('code')->nullable()->change();
            $table->string('title')->nullable()->change();
            $table->text('description')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $classrooms = \App\Classroom::all();
        $classrooms->each(function ($classroom) {
            if ( !$classroom->subject )
                return;

            $classroom->code = $classroom->subject->code;
            $classroom->title = $classroom->subject->title;
            $classroom->description = $classroom->subject->description;
            $classroom->save();
        });
        Schema::table('classrooms', function (Blueprint $table) {
            $table->dropColumn('subject_id');
            $table->string('code')->nullable(false)->change();
            $table->string('title')->nullable(false)->change();
            $table->text('description')->nullable(false)->change();
        });

        Schema::dropIfExists('subjects');
    }
}
