<?php

namespace App\Transformers;

use App\Thread;
use League\Fractal\TransformerAbstract;

class ThreadTransformer extends TransformerAbstract
{

    protected $availableIncludes = [
        'lastDiscussion',
        'teachable',
    ];

    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform( Thread $thread )
    {
        $lastDiscussion = $thread->getLastDiscussion();

        return [
            'title' => optional( $thread->getDiscussable()->teachable )->title ?: null,
            'lastActiveAt' => $lastDiscussion ? $lastDiscussion->created_at->toIso8601String() : null,
            'lastActiveAtForHumans' => $lastDiscussion ? $lastDiscussion->created_at->diffForHumans() : null,
            'messagesCount' => $thread->getMessagesCount(),
            'usersCount' => $thread->getUsersCount(),
        ];
    }

    public function includeLastDiscussion( Thread $thread )
    {
        if ( $thread->getLastDiscussion() == null )
            return null;

        return $this->item( $thread->getLastDiscussion(), new DiscussionTransformer );
    }

    public function includeTeachable( Thread $thread )
    {
        return $this->item( $thread->getDiscussable(), new TeachableTransformer );
    }
}
