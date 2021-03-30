<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Transformers\CategoryTransformer ;
use App\Category;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        if ($request->context == 'child') {
           return Category::where('parent_id', $request->parent_id)->get()->toJson();
        } elseif($request->context == 'parent') {
            return Category::whereNull('parent_id')->get()->toJson();
        } elseif($request->context == 'all') {

            $categories = Category::whereNotNull('parent_id')
                    ->where('name', 'LIKE', '%' . $request->q . '%')
                    ->get();
            
            return fractal()->collection($categories)   
                ->transformWith( new CategoryTransformer )
                ->respond();
            
        } else {
            return Category::get()->toJson();
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $category = new Category;
        $category->name = $request->name;
        $category->parent_id = $request->faculty; 

        if ($category->save()) {
            return[
                "category" => $category,
            ];
        } else {
            return[
                "category" => [], 
            ];
        }
    
    }

    /**
     * Display the specified resource.
     *
     * @param  \\App\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function show(Category $category)
    {
        return $category->toJSON();
        // return [
        //     "data" => $category,
        // ];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Category  $id
     * @return \Illuminate\Http\Response
     */
    public function update($id, Request $request)
    {
        $category = Category::find($id);
        $category->name = $request->name;
        $category->parent_id = $request->faculty;

        if ($category->save()) {
            return[
                "category" => $category,
            ];
        } else {
            return[
                "category" => [], 
            ];
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function destroy(category $category)
    {
        $catgeory = Category::where('id', $category)->delete();

        return [
            "isSuccess" => true
        ];
    }
}
