<?php

namespace App;

class Thread
{

    public $type;
    protected $discussable;

    public function __construct( $discussable ) {

        $this->discussable = $discussable;

    }

    public function getDiscussable()
    {
        return $this->discussable;
    }

    public function getLastDiscussion()
    {
        return $this->discussable->discussions->sortByDesc( 'updated_at' )->values()->first();
    }

    public function getMessagesCount()
    {
        return $this->discussable->discussions->count();
    }

    public function getUsersCount()
    {
        return $this->discussable->discussions->unique( 'user_id' )->count();
    }

}
