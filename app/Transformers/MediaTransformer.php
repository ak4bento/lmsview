<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use Spatie\MediaLibrary\Models\Media;

class MediaTransformer extends TransformerAbstract
{

    protected $availableIncludes = [
        'model',
    ];

    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform( Media $media )
    {
        return [
            'id' => $media->id,
            'name' => $media->name,
            'fileName' => $media->file_name,
            'mimeType' => $media->mime_type,
            'size' => $media->size,
            'collection' => $media->collection_name,
            'downloadUrl' => '/download/' . $media->id,
            'modelType' => $media->model_type,

            'createdAt' => $media->created_at->toIso8601String(),
            'createdAtForHumans' => $media->created_at->diffForHumans(),
        ];
    }

    public function includeModel( Media $media )
    {
        return $this->item( $media->model, app( 'App\\Transformers\\' . studly_case( $media->model_type ) . 'Transformer' ) );
    }

}
