@extends('layouts.start')

@section('content')
  <a href="{{ route('start.quizzes.index') }}">Back to Quizzes List</a>
  <h1>Create New Question</h1>

  <form action="{{ route('start.questions.store') }}" method="POST" class="mt-5">
    @csrf
    <input type="hidden" name="continue_id" value="{{ request()->map_to }}" />

    <div class="mb-5">
      <div class="form-group row">
        <label for="question_type" class="col-form-label col-3">Question Type</label>
        <div class="col-9">
          <select name="question_type" id="question-type" class="form-control">
          <option value="multiple-choice"{{ old('question_type') == 'multiple-choice' ? ' selected' : '' }}>Multiple Choice</option>
            <option value="boolean"{{ old('question_type') == 'boolean' ? ' selected' : '' }}>Boolean</option>
            <option value="multiple-response"{{ old('question_type') == 'multiple-response' ? ' selected' : '' }}>Multiple Response</option>
            <option value="fill-in"{{ old('question_type') == 'fill-in' ? ' selected' : '' }}>Fill-In</option>
            <option value="essay"{{ old('question_type') == 'essay' ? ' selected' : '' }}>Essay</option>
          </select>
          <div class="invalid-feedback">
            {{ $errors->has('question_type') ? $errors->first('question_type') : '' }}
          </div>
        </div>
      </div>
      <div class="form-group row">
        <label for="content" class="col-form-label col-3">Question</label>
        <div class="col-9">
          <textarea name="content" id="content" class="form-control{{ $errors->has('content') ? ' is-invalid' : '' }}" rows="3"></textarea>
          <div class="invalid-feedback">
            {{ $errors->has('content') ? $errors->first('content') : '' }}
          </div>
        </div>
      </div>
      <div class="form-group row">
        <label for="answers" class="col-form-label col-3">Answers<br /><small class="text-muted">(required if Question Type is Fill-In)</small></label>
        <div class="col-9">
          <textarea name="answers" id="answers" class="form-control{{ $errors->has('answers') ? ' is-invalid' : '' }}" rows="3"></textarea>
          <div class="invalid-feedback">
            {{ $errors->has('answers') ? $errors->first('answers') : '' }}
          </div>
        </div>
      </div>
    </div>

    <div class="mb-5">
      <div class="d-flex justify-content-between align-items-center mb-3 py-3 border-bottom">
        <div class="h5 m-0">Choices <small class="text-muted">required if Question Type is not Fill-In</small></div>
        <div>
          <a href="#" data-toggle="collapse" data-target="#choice-items"><i class="fas fa-angle-down"></i></a>
        </div>
      </div>
      <div id="choice-items">
        <div id="choice-items-choices">
          @if (old('choices'))
            @foreach (old('choices') as $index => $choice)
              <div class="mb-3 form-row align-items-center choice-items-choice">
                <div class="col-9">
                  <input type="text" name="choices[{{ $index }}][text]" class="form-control" placeholder="Choice text" />
                </div>
                <div class="col-3">
                  <div class="form-check">
                    <input type="checkbox" class="form-check-input" name="choices[{{ $index }}][is_correct]" value="1" /><label class="form-check-label">Correct Answer</label>
                  </div>
                </div>
              </div>
            @endforeach
          @endif
        </div>
        <button type="button" id="add-choice-btn" class="btn btn-primary btn-sm">Add Choice</button>
      </div>
    </div>

    <div class="mb-5">
      <div class="d-flex justify-content-between align-items-center mb-3 py-3 border-bottom">
        <div class="h5 m-0">Map to Quizzes</div>
        <div>
          <a href="#" data-toggle="collapse" data-target="#quizzes"><i class="fas fa-angle-down"></i></a>
        </div>
      </div>
      <div id="quizzes" class="collapse border p-3" style="max-height: 500px; overflow-y: auto;">
        <table class="table table-sm">
          <thead><tr><th></th><th>Quiz</th><th>Created</th><th class="text-right">Questions</th></tr></thead>
          <tbody>
            @foreach ($quizzes as $quiz)
              <tr>
                <td>
                  <input type="checkbox" name="map_to[]"{{ request()->map_to == $quiz->id || collect(old( 'map_to' ))->contains( $quiz->id ) ? ' checked' : '' }} value="{{ $quiz->id }}" />
                </td>
                <td>{{ $quiz->title }}</td>
                <td>{{ $quiz->created_at->diffForHumans() }}, {{ $quiz->createdBy->name }}</td>
                <td class="text-right">{{ $quiz->questions_count }}</td>
              </tr>
            @endforeach
          </tbody>
        </table>
      </div>
    </div>

    <div class="text-right mt-5">
      <button type="submit" name="action" value="continue" class="btn btn-outline-primary">Save and Add Another</button>
      <button type="submit" name="action" value="list" class="btn btn-primary">Save</button>
    </div>
  </form>
@endsection

@section('scripts')
  <script>
    $( document ).ready( function documentReady() {

      $( "#add-choice-btn" ).on( 'click', function addChoiceButtonClicked() {
        var choicesCount = $(".choice-items-choice").length;
        $( "#choice-items-choices" ).append(
          '<div class="mb-3 form-row align-items-center choice-items-choice">' +
            '<div class="col-9">' +
              '<input type="text" name="choices[' + choicesCount + '][text]" class="form-control" placeholder="Choice text" />' +
            '</div>' +
            '<div class="col-3">' +
              '<div class="form-check">' +
                '<input type="checkbox" class="form-check-input" name="choices[' + choicesCount + '][is_correct]" value="1" /><label class="form-check-label">Correct Answer</label>' +
              '</div>' +
            '</div>' +
          '</div>'
        );
      } );

    } );
  </script>
@endsection