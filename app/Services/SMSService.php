<?php

namespace App\Services;

// use App\Models\OtpConfiguration;
// use App\Utility\MimoUtility;
// use Twilio\Rest\Client;

// class SMSService
// {
//     public static function sendSMS($to, $from, $text, $template_id)
//     {
//         if (OtpConfiguration::where('type', 'nexmo')->first()->value == 1) {
//             $api_key = env("NEXMO_KEY"); //put ssl provided api_token here
//             $api_secret = env("NEXMO_SECRET"); // put ssl provided sid here
//             $params = [
//                 "api_key" => $api_key,
//                 "api_secret" => $api_secret,
//                 "from" => $from,
//                 "text" => $text,
//                 "to" => $to
//             ];
//             $url = "https://rest.nexmo.com/sms/json";
//             $params = json_encode($params);
//             $ch = curl_init(); // Initialize cURL
//             curl_setopt($ch, CURLOPT_URL, $url);
//             curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
//             curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
//             curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//             curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
//             curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
//             curl_setopt($ch, CURLOPT_HTTPHEADER, array(
//                 'Content-Type: application/json',
//                 'Content-Length: ' . strlen($params),
//                 'accept:application/json'
//             ));
//             $response = curl_exec($ch);
//             curl_close($ch);
//             return $response;
//         } elseif (OtpConfiguration::where('type', 'twillo')->first()->value == 1) {
//             $sid = env("TWILIO_SID"); // Your Account SID from www.twilio.com/console
//             $token = env("TWILIO_AUTH_TOKEN"); // Your Auth Token from www.twilio.com/console
//             $client = new Client($sid, $token);
//             try {
//                 $client->messages->create(
//                     $to, // Text this number
//                     array(
//                         'from' => env('VALID_TWILLO_NUMBER'), // From a valid Twilio number
//                         'body' => $text
//                     )
//                 );
//             } catch (\Exception $e) {
//             }
//         } elseif (OtpConfiguration::where('type', 'ssl_wireless')->first()->value == 1) {
//             $token = env("SSL_SMS_API_TOKEN"); //put ssl provided api_token here
//             $sid = env("SSL_SMS_SID"); // put ssl provided sid here
//             $params = [
//                 "api_token" => $token,
//                 "sid" => $sid,
//                 "msisdn" => $to,
//                 "sms" => $text,
//                 "csms_id" => date('dmYhhmi') . rand(10000, 99999)
//             ];
//             $url = env("SSL_SMS_URL");
//             $params = json_encode($params);
//             $ch = curl_init(); // Initialize cURL
//             curl_setopt($ch, CURLOPT_URL, $url);
//             curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
//             curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
//             curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//             curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
//             curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
//             curl_setopt($ch, CURLOPT_HTTPHEADER, array(
//                 'Content-Type: application/json',
//                 'Content-Length: ' . strlen($params),
//                 'accept:application/json'
//             ));
//             $response = curl_exec($ch);
//             curl_close($ch);
//             return $response;
//         } elseif (OtpConfiguration::where('type', 'fast2sms')->first()->value == 1) {
//             if (strpos($to, '+91') !== false) {
//                 $to = substr($to, 3);
//             }
//             if (env("ROUTE") == 'dlt_manual') {
//                 $fields = array(
//                     "sender_id" => env("SENDER_ID"),
//                     "message" => $text,
//                     "template_id" => $template_id,
//                     "entity_id" => env("ENTITY_ID"),
//                     "language" => env("LANGUAGE"),
//                     "route" => env("ROUTE"),
//                     "numbers" => $to,
//                 );
//             } else {
//                 $fields = array(
//                     "sender_id" => env("SENDER_ID"),
//                     "message" => $text,
//                     "language" => env("LANGUAGE"),
//                     "route" => env("ROUTE"),
//                     "numbers" => $to,
//                 );
//             }
//             $auth_key = env('AUTH_KEY');
//             $curl = curl_init();
//             curl_setopt_array($curl, array(
//                 CURLOPT_URL => "https://www.fast2sms.com/dev/bulkV2",
//                 CURLOPT_RETURNTRANSFER => true,
//                 CURLOPT_ENCODING => "",
//                 CURLOPT_MAXREDIRS => 10,
//                 CURLOPT_TIMEOUT => 30,
//                 CURLOPT_SSL_VERIFYHOST => 0,
//                 CURLOPT_SSL_VERIFYPEER => 0,
//                 CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
//                 CURLOPT_CUSTOMREQUEST => "POST",
//                 CURLOPT_POSTFIELDS => json_encode($fields),
//                 CURLOPT_HTTPHEADER => array(
//                     "authorization: $auth_key",
//                     "accept: */*",
//                     "cache-control: no-cache",
//                     "content-type: application/json"
//                 ),
//             ));
//             $response = curl_exec($curl);
//             $err = curl_error($curl);
//             curl_close($curl);
//             return $response;
//         } elseif (OtpConfiguration::where('type', 'mimo')->first()->value == 1) {
//             $token = MimoUtility::getToken();
//             MimoUtility::sendMessage($text, $to, $token);
//             MimoUtility::logout($token);
//         } elseif (OtpConfiguration::where('type', 'mimsms')->first()->value == 1) {
//             $url = env('MIM_BASE_URL') . "/smsapi";
//             $data = [
//                 "api_key" => env('MIM_API_KEY'),
//                 "type" => "text",
//                 "contacts" => $to,
//                 "senderid" => env('MIM_SENDER_ID'),
//                 "msg" => $text,
//             ];
//             $ch = curl_init();
//             curl_setopt($ch, CURLOPT_URL, $url);
//             curl_setopt($ch, CURLOPT_POST, 1);
//             curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
//             curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//             curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
//             $response = curl_exec($ch);
//             curl_close($ch);
//             return $response;
//         } elseif (OtpConfiguration::where('type', 'msegat')->first()->value == 1) {
//             $url = "https://www.msegat.com/gw/sendsms.php";
//             $data = [
//                 "apiKey" => env('MSEGAT_API_KEY'),
//                 "numbers" => $to,
//                 "userName" => env('MSEGAT_USERNAME'),
//                 "userSender" => env('MSEGAT_USER_SENDER'),
//                 "msg" => $text
//             ];
//             $ch = curl_init();
//             curl_setopt($ch, CURLOPT_URL, $url);
//             curl_setopt($ch, CURLOPT_POST, 1);
//             curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
//             curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//             curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
//             $response = curl_exec($ch);
//             curl_close($ch);
//             return $response;
//         } elseif (OtpConfiguration::where('type', 'sparrow')->first()->value == 1) {
//             $url = "http://api.sparrowsms.com/v2/sms/";
//             $args = http_build_query(array(
//                 "token" => env('SPARROW_TOKEN'),
//                 "from" => env('MESSGAE_FROM'),
//                 "to" => $to,
//                 "text" => $text
//             ));
//             # Make the call using API.
//             $ch = curl_init();
//             curl_setopt($ch, CURLOPT_URL, $url);
//             curl_setopt($ch, CURLOPT_POST, 1);
//             curl_setopt($ch, CURLOPT_POSTFIELDS, $args);
//             curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
//             // Response
//             $response = curl_exec($ch);
//             curl_close($ch);
//             return $response;
//         } elseif (OtpConfiguration::where('type', 'zender')->first()->value == 1) {
//             $args = [
//                 "secret" => env('ZENDER_API_SECRET'),
//                 "phone" => $to,
//                 "message" => $text,
//                 "mode" => env('ZENDER_MODE'),
//                 "sim" => env('ZENDER_SIM'),
//                 env('ZENDER_MODE_TYPE') => env('ZENDER_DEVICE_ID'),
//             ];
//             $cURL = curl_init("https://sms.dzshopee.com/api/send/sms");
//             curl_setopt($cURL, CURLOPT_RETURNTRANSFER, true);
//             curl_setopt($cURL, CURLOPT_POSTFIELDS, $args);
//             $response = curl_exec($cURL);
//             curl_close($cURL);
//             return $response;
//         }
//         return true;
//     }
// }
