<?php
defined('LOCAL_PATH_ROOT') or define("LOCAL_PATH_ROOT", $_SERVER["DOCUMENT_ROOT"]);
defined('HTTP_PATH_ROOT') or define("HTTP_PATH_ROOT", isset($_SERVER["HTTP_HOST"]) ? $_SERVER["HTTP_HOST"] : (isset($_SERVER["SERVER_NAME"]) ? $_SERVER["SERVER_NAME"] : '_UNKNOWN_'));

include_once(LOCAL_PATH_ROOT . '/game/include.php');

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if (isset($_POST['name']) && isset($_POST['quantity'])) {
    $product = ProductUtil::getProductByName($_POST['name']);
    $name = $_POST['name'];

    if (isset($product)) {
        $_SESSION['cart'][$name] = $_POST['quantity'];

        $inStock = ProductUtil::getCountProductCodeByNameAndStatus($name, 0);
        if ($inStock < $_SESSION['cart'][$name]) {
            $_SESSION['cart'][$name] = $inStock;
            echo $inStock;
            exit();
        }
        echo '-1';
        exit();
    }
}
echo 'not_found';
