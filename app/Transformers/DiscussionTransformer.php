<?php

namespace App\Transformers;

use App\Discussion;
use League\Fractal\TransformerAbstract;

class DiscussionTransformer extends TransformerAbstract
{

    protected $availableIncludes = [
        'user',
        'replies',
    ];

    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform( Discussion $discussion )
    {
        return [
            'id' => $discussion->id,
            'isOwn' => $discussion->user == auth()->user(),
            'message' => $discussion->message,
            'createdAt' => $discussion->created_at->toIso8601String(),
            'createdAtForHumans' => $discussion->created_at->diffForHumans(),
            'updatedAt' => $discussion->updated_at->toIso8601String(),
            'updatedAtForHumans' => $discussion->updated_at->diffForHumans(),
        ];
    }

    public function includeReplies( Discussion $discussion )
    {
        return $this->collection( $discussion->replies, new DiscussionTransformer );
    }

    public function includeUser( Discussion $discussion )
    {
        return $this->item( $discussion->user, new UserTransformer );
    }
}
