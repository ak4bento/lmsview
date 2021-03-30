@extends('layouts.start')

@section('content')
  <div class="d-flex justify-content-between align-items-center mb-5">
    <h1>All Quizzes</h1>
    <a class="btn btn-primary" href="{{ route('start.quizzes.create') }}">New Quiz</a>
  </div>

  <table class="table table-hover">
    <thead>
      <tr><th>Title</th><th class="text-right">Questions</th><th>Created</th><th>Actions</th></tr>
    </thead>

    <tbody>
      @foreach ($quizzes as $quiz)
        <tr>
          <td>
            <div class="text-truncate">{{ $quiz->title }}</div>
            <div class="text-muted text-truncate small">
              @if ( $quiz->teachables->count() > 0 )
                {{ $quiz->teachables->count() }} classrooms
              @else
                Not mapped
              @endif
            </div>
          </td>
          <td class="text-right">{{ $quiz->questions_count }}</td>
          <td>
            <div class="text-truncate">{{ $quiz->createdBy->name }}</div>
            <div class="small text-truncate">{{ $quiz->created_at->diffForHumans() }}</div>
          </td>
          <td>
            <div><a href="{{ route( 'start.quizzes.edit', [ 'quiz' => $quiz ] ) }}">Edit</a></div>
            <div class="small"><a href="{{ route( 'start.questions.create' ) . '?map_to=' . $quiz->id }}">Add Questions</a></div>
          </td>
        </tr>
      @endforeach
    </tbody>
  </table>

  {!! $quizzes->render() !!}
@endsection