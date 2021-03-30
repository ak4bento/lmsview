<?php

namespace App\Transformers;

use App\Resource;
use League\Fractal\TransformerAbstract;

class ResourceTransformer extends TransformerAbstract
{

    protected $availableIncludes = [
        'media'
    ];

    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform( Resource $resource )
    {
        return [
            'id' => $resource->id,
            'type' => $resource->type,
            'title' => strlen( $resource->title ) > 0 ? $resource->title : null,
            'description' => $resource->description,
            'data' => strlen( $resource->data ) > 0 ? $resource->data : null,
        ];
    }

    public function includeMedia( Resource $resource )
    {
        return $this->collection( $resource->media, new MediaTransformer );
    }
}
