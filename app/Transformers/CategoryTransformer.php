<?php

namespace App\Transformers;

use App\Category;
use League\Fractal\TransformerAbstract;

class CategoryTransformer extends TransformerAbstract
{
    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform( Category $category )
    {
        return [
            'slug' => $category->slug,
            'name' => $category->name,
            'id' => $category->id ,
            'parent' => $category->parent ? (object) ["data" => $category->parent]: null
        ];
    }
}
