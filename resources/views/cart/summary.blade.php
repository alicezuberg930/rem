<style>
    .cart-text {
        font-size: 1.0rem;
        font-weight: 600;
    }

    .cart-checkout {
        color: white;
        background-color: var(--primary);
        border: 1px solid var(--primary);
        margin-top: 1rem;
    }

    .cart-not-checkout {
        border: 1px solid var(--primary);
        margin-top: 1rem;
    }

    .cart-checkout:focus {
        color: var(--sub-color);
        background-color: #fff;
        border-color: #80bdff;
        outline: 0;
        box-shadow: 0 0 0 0.2rem rgb(0 123 255 / 25%);
    }

    .cart-checkout-lock {
        color: white;
        background-color: var(--danger);
        height: unset;
    }

    .cart-checkout-lock.form-control:focus {
        color: white;
        background-color: var(--danger);
        border-color: #80bdff;
        outline: 0;
        box-shadow: 0 0 0 0.2rem rgb(0 123 255 / 25%);
    }
</style>

<?php $total_price = $total_discount = $total_final = 0;
if (session()->has('cart') && count(session('cart')) > 0) {
    $cartArray = session()->get('cart');
    foreach ($cartArray as $cart) {
        $discount_price = $cart['price'] * (1 - doubleval($cart['percent'] / 100));
        $total_price += $cart['price'];
        $total_discount += $cart['price'] - $discount_price;
        $total_final += $total_discount;
    }
    if ($total_discount > 0) {
        $total_discount = '-' . $total_discount;
    }
} ?>
<div>
    <div class="float-left cart-text">Total Price</div>
    <div class="float-right cart-text">{{ number_format($total_price, 0, '.') }}</div>
    <div class="clearfix"></div>
</div>
<div>
    <div class="float-left cart-text">Total Discount</div>
    <div class="float-right cart-text">{{ number_format($total_discount, 0, '.') }}</div>
    <div class="clearfix"></div>
</div>
<hr />
<div>
    <div class="float-left cart-text">Final Price</div>
    <div class="float-right cart-text">{{ number_format($total_final, 0, '.') }}</div>
    <div class="clearfix"></div>
    @if (session()->has('cart'))
        {
        @if (!session()->has('UserID'))
            <a href="/loginregister">
                <button class="cart-not-checkout form-control font-weight-bold">Login to check out</button>
            </a>
            {{-- @elseif(!UserUtil::checkFullInformationUser($_SESSION['username']))
            <button id="cart-edit-information" class="cart-not-checkout form-control font-weight-bold"> Full fill your
                information </button>
        @elseif (UserUtil::hasPermission($_SESSION['username'], 'user.checkout.lock'))
            <button id="cart-checkout-lock"
                class="cart-not-checkout form-control font-weight-bold cart-checkout-lock">Your account has been locked in payment </button> --}}
        @else
            <button class="cart-checkout form-control bg-primary font-weight-bold">Check out</button>
        @endif
        }
    @endif
</div>

<script>
    function updateSummary() {
        $.ajax({
            url: "summary.php",
            success: function(result) {
                $(".cart-summary").html(result);
            }
        });
    }

    $('.cart-checkout-lock').click(function() {
        window.alert("Maybe you have violated our purchase rules so we're locked your account on checkout!");
    })

    $('.cart-checkout').click(function() {
        $.ajax({
            url: "order_information.php",
            success: function(result) {
                $("#modal-content").html(result);
                showModal();
            }
        });
    });

    <?php if (isset($_SESSION['username'])) : ?>
    $("#cart-edit-information").click(function() {
        $.ajax({
            url: "/game/header/login/edit_information_form.php",
            method: "POST",
            data: {
                "username": "<?= $_SESSION['username'] ?>",
                "reload": 1
            },
            success: function(result) {
                $("#modal-content").html(result);
                showModal();
            }
        });
    });
    <?php endif; ?>
</script>
