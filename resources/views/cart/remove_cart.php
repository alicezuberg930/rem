<?php
defined('LOCAL_PATH_ROOT') or define("LOCAL_PATH_ROOT", $_SERVER["DOCUMENT_ROOT"]);
defined('HTTP_PATH_ROOT') or define("HTTP_PATH_ROOT", isset($_SERVER["HTTP_HOST"]) ? $_SERVER["HTTP_HOST"] : (isset($_SERVER["SERVER_NAME"]) ? $_SERVER["SERVER_NAME"] : '_UNKNOWN_'));

include_once(LOCAL_PATH_ROOT.'/game/include.php');

session_start();

if (isset($_POST['name'])) {
    if (isset($_SESSION['cart']) && isset($_SESSION['cart'][$_POST['name']])) {
        unset($_SESSION['cart'][$_POST['name']]);
    }
}
?>