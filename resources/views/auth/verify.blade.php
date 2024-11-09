@extends('components.common')

@section('body')
    <div class="shadow-md mx-auto my-12 bg-white p-3 rounded-md max-w-md">
        <form action="{{ route('verification.send') }}" method="POST">
            @csrf
            <p class="font-semibold text-lg">Xác thực email</p>
            <p class="opacity-60 text-sm mt-3 mb-4">Trước khi tiếp tục, hãy kiểm tra link xác thực trong hòm thư
                của
                bạn. Nhấn gửi lại link nếu bạn chưa nhận được email
            </p>
            <button class="py-2 px-4 bg-blue-300 text-white rounded-sm">
                Gửi lại link
            </button>
            <div>
                @if (Session::has('message'))
                    <span class="text-xs text-green-500">{{ Session::get('message') }}</span>
                @endif
            </div>
        </form>
    </div>
@endsection
