<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
            "email" => "required|email|unique:users",
            "password" => "required",
            "username" => "required",
            "phone" => "required|unique:users|regex:/(0)[0-9]{9}/",
            "gender" => "required",
            "role_id" => "required",
        ];
    }

    public function messages()
    {
        return [
            "email.required" => "Email is required",
            "email.email" => "Email is not in the correct format",
            "email.unique:users" => "Email is already used",
            "password.required" => "Password is required",
            "username.required" => "Username is required",
            "phone.required" => "Phone is requireed",
            "phone.regex:/(0)[0-9]{9}/" => "Phone is not in the correct format",
            "phone.unique:users" => "Phone is already used",
            "gender.required" => "Gender is required",
            "role_id.required" => "Role is required"
        ];
    }
}
