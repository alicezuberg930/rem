function filterClick(search, page) {
    let categories = []
    let countries = []
    let materials = [];
    let category = document.querySelectorAll('.input-category')
    let country = document.querySelectorAll('.input-country')
    let material = document.querySelectorAll('.material-input')
    let firstprice = $("#first-price").val()
    let lastprice = $("#last-price").val()
    let sort = $('#sort').val();
    if (category[0].checked) {
        for (let i = 1; i < category.length; i++) {
            categories.push(category[i].value)
        }
    } else {
        for (let i = 1; i < category.length; i++) {
            if (category[i].checked) {
                categories.push(category[i].value)
                break
            }
        }
    }
    if (country[0].checked) {
        for (let i = 1; i < country.length; i++) {
            countries.push(country[i].value)
        }
    } else {
        for (let i = 1; i < country.length; i++) {
            if (country[i].checked) {
                countries.push(country[i].value)
                break
            }
        }
    }
    if (material[0].checked) {
        for (let i = 1; i < material.length; i++) {
            materials.push(material[i].value)
        }
    } else {
        for (let i = 1; i < material.length; i++) {
            if (material[i].checked) {
                materials.push(material[i].value)
                break
            }
        }
    }
    $.ajax({
        url: "/filter/search",
        method: "GET",
        data: {
            "categories": categories,
            "countries": countries,
            "materials": materials,
            "firstprice": firstprice,
            "lastprice": lastprice,
            "sort": sort,
            "search": search,
            "page": page
        },
        success: function (result) {
            $("#show-product").html(result)
        }
    });
}

$('#filter-btn').click(function () {
    filterClick("", 1)
})

$(document).on('click', ".page-item", function () {
    filterClick($("#search_name").val(), $(this).text())
})

$('#search_name').keypress(function (e) {
    if (e.which == 13) {
        e.preventDefault();
        filterClick($(this).val(), 1)
    }
});