<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Start Modules for Admins</title>

  <link rel="stylesheet" href="{{ mix('css/start.css') }}" />
  <script>
    window.config = {
      baseURL: '{{ url("/") }}'
    }
  </script>
</head>
<body>

  <div class="container py-5">

    @yield('content')
  </div>

  <script src="{{ mix('js/start.js') }}"></script>
  @yield('scripts')
</body>
</html>