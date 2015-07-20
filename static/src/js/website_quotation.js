$(function () {
'use strict';
var website = openerp.website;

$('.columnID').css("visibility","hidden");
$('#quotation_id').css("visibility","hidden");

website.ready().done( function() {
    $('.bc_attachment_url').each( function( index, element ) {
        var attachment_id = $(element).attr("attachment_id");
        var message_id =  $(element).attr("message_id");
        console.log("attachment_id:",attachment_id);
        console.log("message_id:",message_id);
        console.log("openerp:",website);
        var url = openerp.website.session.url('/mail/download_attachment', {
                'model': 'mail.message',
                'id': message_id,
                'method': 'download_attachment',
                'attachment_id': attachment_id
            });
    //        var url = "empty";
        console.log("url:",url);
        $(element).attr("href", url);
    });
} );

website.if_dom_contains('div.o_bc_website_purchase', function () {

   $('.update_line.js_unitprice.input-group').on('keydown',function(event){
	console.log(event.keyCode);
	if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 8 || event.keyCode == 190 || event.keyCode == 9 || 
		event.keyCode == 13 || event.keyCode == 188) {
		return true;
		}
	else {
		return false;
		}
	});

   $('.update_line.js_leadtime.input-group').on('keydown',function(event){
	if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 13) {
		return true;
		}
	else {
		return false;
		}
	});

   $('#btnCalc').hide();


   // Click on the submit button
   $('#btnSave').on('click', function (ev) {
	console.log('Clicked');
	// Reads quotation ID
	var quotation_id = parseInt($('#quotation_id').text());

	var line_ids = [];
	var line_unit_prices = [];
	var line_leadtimes = [];
	var line_update = []
	var i = 0;

	// Reads quotation lines IDs	
	$('.columnID').each(function(index,element) {
		var element_column = parseInt($(element).text());
		if (!isNaN(element_column)){
			line_ids.push(parseInt($(element).text()));
			}
		});
	
	// Reads quotation lines unit prices
	$('.update_line.js_unitprice.input-group').each(function(index,element) {
		line_unit_prices.push(parseInt($(element).val()));
		});

	// Reads quotation  prices
	$('.update_line.js_leadtime.input-group').each(function(index,element) {
		if ( $(element).val() != 'N/A' ) {
			line_leadtimes.push(parseInt($(element).val()));
			}
		else {
			line_leadtimes.push(0);
			}
		});

	var i = 0;
	for ( i = 0; i < line_ids.length ; i++) {
		console.log(line_ids[i]);
		console.log(line_unit_prices[i]);
		console.log(line_leadtimes[i]);
        	openerp.jsonRpc("/purchase/save", 'call', {
                	'order_id': quotation_id,
                	'line_id': line_ids,
                	'price_unit': line_unit_prices,
                	'leadtime': line_leadtimes,
	                })
        	        .then(function (data) {
				$(".update_line.js_unitprice.input-group").prop('disabled', true);
				$(".update_line.js_leadtime.input-group").prop('disabled', true);
			        location.reload();
	                });
		}

	location.reload();
        return false;
	
	});

   // Click on the submit button
   $('#btnSubmit').on('click', function (ev) {
	console.log('Clicked');
	// Reads quotation ID
	var quotation_id = parseInt($('#quotation_id').text());

	var line_ids = [];
	var line_unit_prices = [];
	var line_leadtimes = [];
	var line_update = []
	var i = 0;

	// Reads quotation lines IDs	
	$('.columnID').each(function(index,element) {
		var element_column = parseInt($(element).text());
		if (!isNaN(element_column)){
			line_ids.push(parseInt($(element).text()));
			}
		});
	
	// Reads quotation lines unit prices
	$('.update_line.js_unitprice.input-group').each(function(index,element) {
		line_unit_prices.push(parseInt($(element).val()));
		});

	// Reads quotation  prices
	$('.update_line.js_leadtime.input-group').each(function(index,element) {
		line_leadtimes.push(parseInt($(element).val()));
		});

	var i = 0;
	for ( i = 0; i < line_ids.length ; i++) {
		console.log(line_ids[i]);
		console.log(line_unit_prices[i]);
		console.log(line_leadtimes[i]);
        	openerp.jsonRpc("/purchase/update_line", 'call', {
                	'order_id': quotation_id,
                	'line_id': line_ids,
                	'price_unit': line_unit_prices,
                	'leadtime': line_leadtimes,
	                })
        	        .then(function (data) {
				$(".update_line.js_unitprice.input-group").prop('disabled', true);
				$(".update_line.js_leadtime.input-group").prop('disabled', true);
			        location.reload();
	                });
		}

	location.reload();
        return false;
	
	});

   // Click on the calc button
   $('.update_line.js_unitprice.input-group').on('blur',function() {
	$('#btnCalc').click();
	});

   $('#btnCalc').on('click', function (ev) {
	var subtotal = [];
	var subtotal_qty = [];
	var total_order = 0;
	var total_order_list = [];
	var i = 0;
	$('.js_product_qty').each(function(index,element) {
		subtotal_qty.push(parseInt($(element).text()));
		});
	$('.update_line.js_unitprice.input-group').each(function(index,element) {
		subtotal.push(parseInt($(element).val()));
		});
	for ( i = 0; i < subtotal.length; i ++) {
		total_order = total_order + subtotal[i] * subtotal_qty[i];
		total_order_list.push(subtotal[i] * subtotal_qty[i]);
		}
	$('.js_line_subtotal span').each(function(index,element) {
		$(element).text(total_order_list[index]);
		});
	$('.subtotal_field').children().text(total_order);
	//for (i = 0 ; i < unit_prices_fields.length ; i++) {
	//	var subtotal_field = parseInt(qty_fields[i].val()) * parseInt(unit_prices_fields[i].val());
	//	console.log(subtotal_field);	
	//	}
	});

   $('a.js_update_line_json').on('click', function (ev) {
        ev.preventDefault();
        var $link = $(ev.currentTarget);
        var href = $link.attr("href");
        var order_id = href.match(/order_id=([0-9]+)/);
        var line_id = href.match(/update_line\/([0-9]+)/);
        var token = href.match(/token=(.*)/);
	console.log('Paso');
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
                    };
                    $link.parents('.input-group:first').find('.js_quantity').val(data[0]);
                    $('[data-id="total_amount"]>span').html(data[1]);
                });
        return false;
    }); // OK



    //$( ".update_line" ).change(function (ev) {
     //   ev.preventDefault();
    //    var $link = $(ev.currentTarget);
    //    var href = $link.attr("data");
    //    var order_id = href.match(/order_id=([0-9]+)/);
    //    var line_id = href.match(/update_line\/([0-9]+)/);
    //    var token = href.match(/token=(.*)/);
    //    var new_price_elem = $link.parents('.input-group:first').find('.js_unitprice');
    //    var new_price = new_price_elem[0].value;
    //    var new_leadtime_elem = $link.parents('.input-group:first').find('.js_leadtime');
    //    var new_leadtime = new_leadtime_elem[0].value;
    //    openerp.jsonRpc("/purchase/update_leadtime", 'call', {
    //            'line_id': line_id[1],
    //            'order_id': parseInt(order_id[1]),
    //            'token': token[1],
    //            'new_leadtime': new_leadtime
    //    }).then(function (data) {
    //            if(!data){
    //                location.reload();
    //                }
    //            $link.parents('.input-group:first').find('.js_leadtime').val(data[0]);
    //            });
    //    openerp.jsonRpc("/purchase/update_unitprice", 'call', {
    //            'line_id': line_id[1],
    //            'order_id': parseInt(order_id[1]),
    //            'token': token[1],
    //           'new_price' : new_price
    //            })
    //           .then(function (data) {
    //                if(!data){
    //                    location.reload();
    //                }
    //                $link.parents('.input-group:first').find('.js_unitprice').val(data[0]);
    //                $('*').find('.js_line_subtotal').each(function() {
    //                    var line_here = parseInt($( this).attr('data'));
    //                    if (line_here == parseInt(line_id[1])) {
    //                        $(this).children('span').html(data[1]);
    //                    }
    //                });
    //                $('[data-id="sub_total_amount"]>span').html(data[2]);
    //                $('[data-id="tax_amount"]>span').html(data[3]);
    //                $('[data-id="total_amount"]>span').html(data[4]);
    //            });
    //    return false;
    // }); //OK


    $('.js_update_line_json3').on('change', function (ev) {
        ev.preventDefault();
	alert('Paso .update_line_json3');
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
    }); // OK

    $('form.js_accept_json').submit(function(ev){
        ev.preventDefault();
	alert('Paso .update_line_json3');
        var $link = $(ev.currentTarget);
        var href = $link.attr("action");
        var order_id = href.match(/accept\/([0-9]+)/);
        var token = href.match(/token=(.*)/);
        if (token) {
            token = token[1]; }
        var signer_name = $("#name").val();
        var sign = $("#signature").jSignature("getData",'image');
        var is_empty = sign?empty_sign[1]==sign[1]:false;
        $('#signer').toggleClass('has-error', ! signer_name);
        $('#drawsign').toggleClass('panel-danger', is_empty).toggleClass('panel-default', ! is_empty);
        if (is_empty || ! signer_name) {
            return false; }
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
    }); // OK

    // automatically generate a menu from h1 and h2 tag in content
    //var $container = $('body[data-target=".navspy"]');
    //var ul = $('[data-id="quote_sidebar"]', $container);
    //var sub_li = null;
    //var sub_ul = null;
    //$("[id^=quote_header_], [id^=quote_]", $container).attr("id", "");
    //$("h1, h2", $container).each(function() {
    //    var id;
    //    switch (this.tagName.toLowerCase()) {
    //        case "h1":
    //            id = _.uniqueId('quote_header_');
    //            $(this.parentNode).attr('id',id);
    //            sub_li = $("<li>").html('<a href="#'+id+'">'+$(this).text()+'</a>').appendTo(ul);
    //            sub_ul = null;
    //            break;
    //        case "h2":
    //            id = _.uniqueId('quote_');
    //            if (sub_li) {
    //                if (!sub_ul) {
    //                    sub_ul = $("<ul class='nav'>").appendTo(sub_li);
    //                }
    //                $(this.parentNode).attr('id',id);
    //                $("<li>").html('<a href="#'+id+'">'+$(this).text()+'</a>').appendTo(sub_ul);
    //            }
    //            break;
    //        }
    //}); // OK
})

});
// }());
