<?php
// backend/utils/JwtHelper.php

class JwtHelper {
    private static $secret_key;
    private static $algo = "HS256";

    private static function init() {
        if (!self::$secret_key) {
            self::$secret_key = getenv('JWT_SECRET') ?: "HUZA_HUB_SECRET_KEY_2026";
        }
    }

    private static function base64UrlEncode($data) {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
    }

    private static function base64UrlDecode($data) {
        $url = str_replace(['-', '_'], ['+', '/'], $data);
        $padding = strlen($url) % 4;
        if ($padding) {
            $url .= str_repeat('=', 4 - $padding);
        }
        return base64_decode($url);
    }

    public static function generateToken($payload) {
        self::init();
        $header = json_encode(['typ' => 'JWT', 'alg' => self::$algo]);
        $payload['iat'] = time();
        $payload['exp'] = time() + (60 * 60 * 24); // 24 hours
        
        $base64UrlHeader = self::base64UrlEncode($header);
        $base64UrlPayload = self::base64UrlEncode(json_encode($payload));
        
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, self::$secret_key, true);
        $base64UrlSignature = self::base64UrlEncode($signature);
        
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    public static function validateToken($token) {
        self::init();
        $part = explode(".", $token);
        if (count($part) !== 3) return false;
        
        $header = $part[0];
        $payload = $part[1];
        $signature = $part[2];
        
        $validSignature = self::base64UrlEncode(hash_hmac('sha256', $header . "." . $payload, self::$secret_key, true));
        
        if ($signature !== $validSignature) return false;
        
        $payloadData = json_decode(self::base64UrlDecode($payload), true);
        if ($payloadData['exp'] < time()) return false;
        
        return $payloadData;
    }

    public static function getBearerToken() {
        $headers = getallheaders();
        $auth_header = null;
        
        if (isset($headers['Authorization'])) {
            $auth_header = $headers['Authorization'];
        } elseif (isset($headers['authorization'])) {
            $auth_header = $headers['authorization'];
        } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $auth_header = $_SERVER['HTTP_AUTHORIZATION'];
        } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $auth_header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        }

        if ($auth_header) {
            if (preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
                return $matches[1];
            }
        }
        return null;
    }
}
?>
