@extends('layouts.minimal')

@section('content')
<div class="d-flex align-items-stretch" style="min-height: 100vh;">
  <div class="login-bg d-lg-block d-none">
    <img src="{{ asset( 'images/logo.svg' ) }}" alt="Gakken Indonesia" height="60" class="my-3 mx-4" />
  </div>
  <div class="d-flex flex-column justify-content-center align-items-center py-5" style="flex: 4;">
    <div class="mb-5 text-center">
      <div class="h2">Start Learning</div>
      <p>Tidak memiliki akun? <a href="#"> Kontak administrator.</a></p>
    </div>

    <div class="row justify-content-center w-100">
      <div class="col-xl-6 col-md-8">
        <form method="POST" action="{{ route('login') }}" aria-label="{{ __('Login') }}">
          @csrf

          <div class="form-group">
            <label for="username" class="lead">{{ __('Username') }}</label>

            <div>
              <input id="username" type="text" class="form-control py-2{{ $errors->has('username') ? ' is-invalid' : '' }}" name="username" value="{{ old('username') }}" required autofocus>

              @if ($errors->has('username'))
                <span class="invalid-feedback" role="alert">
                  <strong>{{ $errors->first('username') }}</strong>
                </span>
              @endif
            </div>
          </div>

          <div class="form-group">
            <label for="password" class="lead">{{ __('Password') }}</label>

            <div>
              <input id="password" type="password" class="form-control py-2{{ $errors->has('password') ? ' is-invalid' : '' }}" name="password" required>

              @if ($errors->has('password'))
                <span class="invalid-feedback" role="alert">
                  <strong>{{ $errors->first('password') }}</strong>
                </span>
              @endif
            </div>
          </div>

          <div class="form-group row align-items-center mb-5">
            <div class="col-6">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" name="remember" {{ old('remember') ? 'checked' : '' }} id="rememberCheck">
                <label class="custom-control-label" for="rememberCheck">{{ __('Ingat akun saya') }}</label>
              </div>
            </div>
            <div class="col-6 text-right">
              <a class="text-link" href="{{ route('password.request') }}">
                {{ __('Lupa akun?') }}
              </a>
            </div>
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-primary text-uppercase px-4 py-2">
              {{ __('Log In') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
@endsection
