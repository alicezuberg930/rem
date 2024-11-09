<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "email" => "exists:users,email|required|email",
            "password" => "required",
        ];
    }

    public function messages()
    {
        return [
            "email.required" => "Email is required",
            "email.email" => "Email is not in the correct format",
            "password.required" => "Password is required",
        ];
    }
}
