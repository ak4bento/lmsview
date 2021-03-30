@extends('layouts.start')

@section('content')
  <a href="{{ route('start.quizzes.index') }}">Back to Quizzes List</a>
  <h1>Create New Quiz</h1>

  <form action="{{ route('start.quizzes.store') }}" method="POST" class="mt-5">
    @csrf

    <div class="mb-5">
      <div class="form-group row">
        <label for="title" class="col-form-label col-3">Title</label>
        <div class="col-9">
          <input type="text" name="title" id="title" class="form-control{{ $errors->has('title') ? ' is-invalid' : '' }}" value="{{ old('title') }}" />
          <div class="invalid-feedback">
            {{ $errors->has('title') ? $errors->first('title') : '' }}
          </div>
        </div>
      </div>
      <div class="form-group row">
        <label for="description" class="col-form-label col-3">Description</label>
        <div class="col-9">
          <textarea name="description" id="description" class="form-control{{ $errors->has('description') ? ' is-invalid' : '' }}" rows="3">{{ old('description') }}</textarea>
          <div class="invalid-feedback">
            {{ $errors->has('description') ? $errors->first('description') : '' }}
          </div>
        </div>
      </div>
    </div>

    <div class="mb-5">
      <div class="d-flex justify-content-between align-items-center mb-3 py-3 border-bottom">
        <div class="h5 m-0">Map to Classrooms</div>
        <div>
          <a href="#" data-toggle="collapse" data-target="#classrooms"><i class="fas fa-angle-down"></i></a>
        </div>
      </div>
      <div id="classrooms" class="collapse">
        <div class="mb-5">
          <div class="form-group row">
            <label for="map_to_pass_threshold" class="col-form-label col-3">Pass Threshold</label>
            <div class="col-3">
              <input type="text" name="map_to_pass_threshold" id="map_to_pass_threshold" class="form-control text-right{{ $errors->has('map_to_pass_threshold') ? ' is-invalid' : '' }}" value="{{ old('map_to_pass_threshold') ?: 0 }}" />
              <div class="invalid-feedback">
                {{ $errors->has('map_to_pass_threshold') ? $errors->first('map_to_pass_threshold') : '' }}
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label for="map_to_max_attempts" class="col-form-label col-3">Attempt Limit</label>
            <div class="col-3">
              <input type="text" name="map_to_max_attempts" id="map_to_max_attempts" class="form-control text-right{{ $errors->has('map_to_max_attempts') ? ' is-invalid' : '' }}" value="{{ old('map_to_max_attempts') ?: 0 }}" />
              <div class="invalid-feedback">
                {{ $errors->has('map_to_max_attempts') ? $errors->first('map_to_max_attempts') : '' }}
              </div>
            </div>
          </div>
        </div>
        <div class="border p-3" style="max-height: 500px; overflow-y: auto;">
          <table class="table table-sm">
            <thead><tr><th></th><th>Classroom</th><th>Created</th><th class="text-right">Teachables</th></tr></thead>
            <tbody>
              @foreach ($classrooms as $classroom)
                <tr>
                  <td>
                    <input type="checkbox" name="map_to[]"{{ request()->map_to == $classroom->id || collect(old( 'map_to' ))->contains( $classroom->id ) ? ' checked' : '' }} value="{{ $classroom->id }}" />
                  </td>
                  <td>{{ $classroom->title }}</td>
                  <td>{{ $classroom->created_at->diffForHumans() }}, {{ $classroom->createdBy->name }}</td>
                  <td class="text-right">{{ $classroom->teachables_count }}</td>
                </tr>
              @endforeach
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="text-right mt-5">
      <button type="submit" name="action" value="add_questions" class="btn btn-outline-primary">Save and Add Questions</button>
      <button type="submit" name="action" value="list" class="btn btn-primary">Save</button>
    </div>
  </form>
@endsection