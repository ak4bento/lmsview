<?php

use App\TeachableUser;
use Illuminate\Database\Seeder;

class GradesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table( 'grades' )->truncate();

        TeachableUser::whereHas( 'teachable', function ( $query )
        {
            $query->whereIn( 'teachable_type', [ 'quiz', 'assignment' ] );
        } )
        ->get()
        ->each( function ( $teachableUser )
        {
            if ( $teachableUser->completed_at == null || !rand( 0, 1 ) )
                return;

            $grade = factory( App\Grade::class )->make();
            $grade->graded_by = in_array( $grade->grading_method, [ 'manual', 'auto-pending' ] ) ? $teachableUser->teachable->classroom->teachers()->first()->id : null;

            $teachableUser->grades()->save( $grade );
        } );
    }
}
