<?php
include ($_SERVER['DOCUMENT_ROOT'].'/game/include.php');

if(session_status() == PHP_SESSION_NONE){
    session_start();
}

$user = UserUtil::getUserByUsername($_SESSION['username']);
?>

<style>
.cart-button {
    width: unset;
}

hr.cart-hr {
    margin-top: 1rem;
    margin-bottom: 1rem;
    border: 0;
    border-top: 1px solid white;
}
</style>

<div id="modal-header"> Order Information </div>

<div id="modal-body"> 
    <form id="add-group-form" onsubmit="return false;">
        <div class="container p-0">
            <div class="row">
                <div class="col-12">
                    <span class="modal-text"> Full Name: </span>
                    <span> <?php echo $user->getLastname().' '.$user->getFirstname()?> </span>
                </div>
                <div class="col-12">
                    <span class="modal-text"> Email: </span>
                    <span> <?php echo $user->getEmail()?> </span>
                </div>
                <div class="col-12">
                    <span class="modal-text"> Phone: </span>
                    <span> <?php echo $user->getPhone()?> </span>
                </div>

                <div class="col-12">
                    <span class="modal-text"> Order Detail: </span>
                </div>

                <div class="col-12">
                    <div class="cart-detail-header w-100">
                        <div class="float-left font-weight-bold"> Game </div>
                        <div class="float-right font-weight-bold"> Price ($) </div>
                        <div class="clearfix"> </div>
                    </div>

                    <div class="cart-detail-body w-100">
                        <div class="container pl-0 pr-0">
                        <?php
                            $totalPrice = 0;
                            $totalDiscount = 0;
                            $totalFinal = 0;

                            foreach ($_SESSION['cart'] as $key => $value) :
                                $product = ProductUtil::getProductByName($key);
                                $display = $product->getDisplay();
                                $discount = doubleval($product->getDiscount()) * 100;
                                $price = round($product->getPrice() * $value, 2);
                                $price2 = round(doubleval($product->getPrice()) * (1 - doubleval($product->getDiscount())), 2) * $value;    
                                
                                $totalPrice += $price; 
                                $totalDiscount += $price - $price2;
                                $totalFinal += $price2; 
                        ?>
                                <div class="row">
                                    <div class="col-8"> x<?=$value?> <?=$display?>  </div>
                                    <div class="col-4 d-flex justify-content-end"> <?=number_format($price, 2, '.', '');?> </div>
                               </div>
                                <?php endforeach; 
                                    if ($totalDiscount > 0) {
                                        $totalDiscount = '-'.$totalDiscount;
                                    }
                                ?>
                        </div>
                    </div>

                    <div class="cart-detail-footer w-100">
                        <hr class="cart-hr" />

                        <div class="cart-detail-total-price">
                            <div class="float-left font-weight-bold"> Total Price </div>
                            <div class="float-right"> <?=number_format($totalPrice, 2, '.', '');?> </div>
                            <div class="clearfix"> </div>
                        </div>

                        <div class="cart-detail-total-discount">
                            <div class="float-left font-weight-bold"> Total Discount </div>
                            <div class="float-right"> <?=number_format($totalDiscount, 2, '.', '');?> </div>
                            <div class="clearfix"> </div>
                        </div>

                        <hr class="cart-hr" />

                        <div class="cart-detail-total-price">
                            <div class="float-left font-weight-bold"> Final Price </div>
                            <div class="float-right"> <?=number_format($totalFinal, 2, '.', '');?> </div>
                            <div class="clearfix"> </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>

<div id="modal-footer" class="mt-3"> 
    <button id="cart-detail-cancel" type="submit" class="form-control cart-button float-right font-weight-bold ml-3" id="group-confirm" form="add-group-form">
        Cancel
    </button>

    <button id="cart-detail-submit" type="submit" class="form-control cart-button float-right bg-primary text-white font-weight-bold" id="group-confirm" form="add-group-form">
        Check out
    </button>
</div>

<script>
    $("#cart-detail-cancel").click(function (e) {
        closeModal();
    });

    $('#cart-detail-submit').click(function() {
        showLoading();
        $.ajax({
            url: "checkout.php", 
            success: function(result){
                if (result == 0) {
                    callNotice("Successful purchase!");
                    $.ajax({
                        url: "list_cart.php", 
                        success: function(result){
                            $('.cart-products').html(result);
                        }
                    });

                    updateSummary();
                }else if (result == 1) {
                    window.alert("Your cart is empty");
                }else {
                    let productAlerts = JSON.parse(result);

                    productAlerts.forEach(function(e) {
                        if (e.left == 0) {
                            window.alert('"' + e.display + '" remove from cart because of out of stock!');
                            
                            $.ajax({
                                url: "remove_cart.php", 
                                method: "POST",
                                data: {
                                    "name": e.name,
                                },
                                success: function(result){
                                }
                            });

                            $.ajax({
                                url: "list_cart.php", 
                                success: function(result){
                                    $('.cart-products').html(result);
                                }
                            });
                            updateSummary();
                        }else {
                            $quantity = $(".cart-quantity[data-name='" + e.name + "']>.cart-quantity-number");
                            
                            $.ajax({
                                url: "update_cart.php", 
                                method: "POST",
                                data: {
                                    "name": e.name,
                                    "quantity": $quantity.val()
                                },
                                success: function(result){
                                    if (result >= 0) {
                                        window.alert('"' + e.display + '" has only ' + result + ' code left in stock!');
                                        $quantity.val(result);
                                    }
                                }
                            });
                            updateSummary();
                        }
                    });
                }

                closeModal();
                closeLoading();
            }
        });
    });
</script>