<?php

use App\Classroom;
use App\Teachable;
use Faker\Factory;
use App\Discussion;
use Illuminate\Database\Seeder;

class DiscussionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table( 'discussions' )->truncate();
        $faker = Factory::create();

        $discussables = collect([]);
        Classroom::with( 'classroomUsers.user' )->get()->each( function ( $classroom ) use ( $discussables ) { $discussables->push( $classroom ); });
        Teachable::with( 'classroom.classroomUsers.user' )->get()->each( function ( $teachable ) use ( $discussables ) { $discussables->push( $teachable ); });

        $discussions = factory( App\Discussion::class, Teachable::count() * 5 )->make();
        $discussions->each( function ( $discussion ) use ( $discussables, $faker ) {
            $discussable = $discussables->random();
            switch ( get_class( $discussable ) ) {
                case 'App\Classroom':
                    $eligibleUsersForDiscussions = $discussable->classroomUsers;
                    break;
                    case 'App\Teachable':
                    $eligibleUsersForDiscussions = $discussable->classroom->classroomUsers;
                    break;
                }

            $discussion->user_id = $eligibleUsersForDiscussions->random()->user->id;
            $createDate = $faker->dateTimeBetween( $discussable->created_at );
            $discussion->created_at = $createDate;
            $discussion->updated_at = $faker->boolean( 30 ) ? $faker->dateTimeBetween( $discussion->created_at ) : $createDate;

            $discussable->discussions()->save( $discussion );
        } );

        $discussions = Discussion::all();
        $discussions->groupBy( function( $item ) {
            return $item->discussable_type . '.' . $item->discussable_id;
        } )->each( function ( $thread )
        {
            $initialDiscussions = $thread->random( ceil( $thread->count() ) / 3 );
            $thread->filter( function ( $discussion ) use ( $initialDiscussions )
            {
                return !in_array( $discussion->id, $initialDiscussions->pluck( 'id' )->all() );
            } )->each( function ( $discussion ) use ( $initialDiscussions )
            {
                if ( $initialDiscussions->count() === 0 )
                    return;
                $discussion->reply_to = $initialDiscussions->random()->id;
                $discussion->save();
            } );
        } );

    }
}
