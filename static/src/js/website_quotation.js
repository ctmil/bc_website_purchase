(function () {
'use strict';
var website = openerp.website;

website.if_dom_contains('div.o_bc_website_purchase', function () {

    $('a.js_update_line_json').on('click', function (ev) {
        ev.preventDefault();
        var $link = $(ev.currentTarget);
        var href = $link.attr("href");
        var order_id = href.match(/order_id=([0-9]+)/);
        var line_id = href.match(/update_line\/([0-9]+)/);
        var token = href.match(/token=(.*)/);
        openerp.jsonRpc("/purchase/update_line", 'call', {
                'line_id': line_id[1],
                'order_id': parseInt(order_id[1]),
                'token': token[1],
                'remove': $link.is('[href*="remove"]'),
                'unlink': $link.is('[href*="unlink"]')
                })
                .then(function (data) {
                    if(!data){
                        location.reload();
                    }
                    $link.parents('.input-group:first').find('.js_quantity').val(data[0]);
                    $('[data-id="total_amount"]>span').html(data[1]);
                });
        return false;
    });



    $( ".update_line" ).change(function (ev) {
        //alert("Hei og hopp");
                ev.preventDefault();
        //alert("Hei og hopp2");
        var $link = $(ev.currentTarget);
        //alert(ev.currentTarget);
        var href = $link.attr("data");
        //alert('href');
        //alert(href);

        var order_id = href.match(/order_id=([0-9]+)/);
        //alert('order id');
        //alert(order_id);
        var line_id = href.match(/update_line\/([0-9]+)/);
        var token = href.match(/token=(.*)/);
          //  alert("Hei og hopp3");
        var new_price_elem = $link.parents('.input-group:first').find('.js_unitprice');
        var new_price = new_price_elem[0].value;
        var new_leadtime_elem = $link.parents('.input-group:first').find('.js_leadtime');
        var new_leadtime = new_leadtime_elem[0].value;
        //alert('new price');
        //alert(new_price);

        openerp.jsonRpc("/purchase/update_leadtime", 'call', {
                'line_id': line_id[1],
                'order_id': parseInt(order_id[1]),
                'token': token[1],
                'new_leadtime': new_leadtime
        })
                .then(function (data) {
                if(!data){
                    location.reload();
                    }
                $link.parents('.input-group:first').find('.js_leadtime').val(data[0]);

                }


        openerp.jsonRpc("/purchase/update_unitprice", 'call', {
                'line_id': line_id[1],
                'order_id': parseInt(order_id[1]),
                'token': token[1],
                'new_price' : new_price
            /*    'remove': $link.is('[href*="remove"]'),
                'unlink': $link.is('[href*="unlink"]') */
                })
                .then(function (data) {
                //alert('data');
                //alert(data);
                    if(!data){
                        location.reload();
                    }
                    $link.parents('.input-group:first').find('.js_unitprice').val(data[0]);
                    //alert($('.js_line_subtotal>span'))
                    //alert('lets');
                    $('*').find('.js_line_subtotal').each(function() {
                        //alert('this');
                        //alert($(this));
                        var line_here = parseInt($( this).attr('data'));
                        //alert( 'here');
                        //alert( line_here );
                        //alert( parseInt(line_id[1]) );
                        //alert( line_here == parseInt(line_id[1]));
                        if (line_here == parseInt(line_id[1])) {
                            //$( this )('span').html(data[1]);
                            //alert($(this).children('span'));
                            $(this).children('span').html(data[1]);
                            //alert('DID IT');
                        }
                    })

                    //alert($(ev.target).closest('.js_line_subtotal')('span').value);
                    //$( ev.target ).closest('.js_line_subtotal')('span').html(data[1]);
                    //$link.closest(".js_line_subtotal").val(data[1]);
                    //$('.js_line_subtotal>span').html(data[1]);
                    $('[data-id="sub_total_amount"]>span').html(data[2]);
                    $('[data-id="tax_amount"]>span').html(data[3]);
                    $('[data-id="total_amount"]>span').html(data[4]);
                });
        //alert( "Handler for .change() called." );
        return false;
    });


    // Torvald TBRI
        $('.js_update_line_json3').on('change', function (ev) {
        ev.preventDefault();
        var $link = $(ev.currentTarget);
        var href = $link.attr("href");
        var order_id = href.match(/order_id=([0-9]+)/);
        var line_id = href.match(/update_line\/([0-9]+)/);
        var token = href.match(/token=(.*)/);
            alert("Hei og hopp");
        openerp.jsonRpc("/purchase/update_line", 'call', {
                'line_id': line_id[1],
                'order_id': parseInt(order_id[1]),
                'token': token[1],
                'remove': $link.is('[href*="remove"]'),
                'unlink': $link.is('[href*="unlink"]')
                })
                .then(function (data) {
                    if(!data){
                        location.reload();
                    }
                    $link.parents('.input-group:first').find('.js_quantity').val(data[0]);
                    $('[data-id="total_amount"]>span').html(data[1]);
                });
        return false;
    });



    var empty_sign = false;
    $('#modelaccept').on('shown.bs.modal', function (e) {
        $("#signature").empty().jSignature({'decor-color' : '#D1D0CE'});
        empty_sign = $("#signature").jSignature("getData",'image');
    });

    $('#sign_clean').on('click', function (e) {
        $("#signature").jSignature('reset');
    });


    $('form.js_accept_json').submit(function(ev){
        ev.preventDefault();
        var $link = $(ev.currentTarget);
        var href = $link.attr("action");
        var order_id = href.match(/accept\/([0-9]+)/);
        var token = href.match(/token=(.*)/);
        if (token)
            token = token[1];

        var signer_name = $("#name").val();
        var sign = $("#signature").jSignature("getData",'image');
        var is_empty = sign?empty_sign[1]==sign[1]:false;
        $('#signer').toggleClass('has-error', ! signer_name);
        $('#drawsign').toggleClass('panel-danger', is_empty).toggleClass('panel-default', ! is_empty);

        if (is_empty || ! signer_name)
            return false;

        openerp.jsonRpc("/purchase/accept", 'call', {
            'order_id': parseInt(order_id[1]),
            'token': token,
            'signer': signer_name,
            'sign': sign?JSON.stringify(sign[1]):false,
        }).then(function (data) {
            $('#modelaccept').modal('hide');
            window.location.href = '/purchase/'+order_id[1]+'/'+token+'?message=3';
        });
        return false;
    });

    // automatically generate a menu from h1 and h2 tag in content
    var $container = $('body[data-target=".navspy"]');
    var ul = $('[data-id="quote_sidebar"]', $container);
    var sub_li = null;
    var sub_ul = null;
    $("[id^=quote_header_], [id^=quote_]", $container).attr("id", "");
    $("h1, h2", $container).each(function() {
        var id;
        switch (this.tagName.toLowerCase()) {
            case "h1":
                id = _.uniqueId('quote_header_');
                $(this.parentNode).attr('id',id);
                sub_li = $("<li>").html('<a href="#'+id+'">'+$(this).text()+'</a>').appendTo(ul);
                sub_ul = null;
                break;
            case "h2":
                id = _.uniqueId('quote_');
                if (sub_li) {
                    if (!sub_ul) {
                        sub_ul = $("<ul class='nav'>").appendTo(sub_li);
                    }
                    $(this.parentNode).attr('id',id);
                    $("<li>").html('<a href="#'+id+'">'+$(this).text()+'</a>').appendTo(sub_ul);
                }
                break;
            }
    });
});

}());
