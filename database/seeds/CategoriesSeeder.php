<?php

use App\Subject;
use App\Category;
use App\Classroom;
use Illuminate\Database\Seeder;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table( 'categorizables' )->truncate();
        DB::table( 'subjects' )->update([ 'default_category_id' => null ]);
        DB::table( 'categories' )->truncate();

        $categories = collect( json_decode( Storage::disk( 'database' )->get( 'data/ExampleCategories.json' ) ) );
        $rootCategory = Category::create([ 'name' => 'Fakultas Kedokteran' ]);

        $categories = $categories->map( function ( $category ) use ( $rootCategory )
        {
            $category = Category::create([ 'name' => $category->name, 'parent_id' => $rootCategory->id ]);
            return $category;
        } );

        Subject::all()->each( function ( $subject ) use ( $categories )
        {
            if ( rand( 0, 5 ) )
                $subject->default_category_id = $categories->random()->id;
            $subject->save();
        } );

        Classroom::all()->each( function ( $classroom ) use ( $categories )
        {
            $classroom->categories()->attach( $categories->random() );
        } );
    }
}
