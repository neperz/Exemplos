$(document).ajaxStop(function () {
    console.log('Ajax done');
    var i1 = AUCTION_ID_LIST_ARRAY[0];
    var i2 = AUCTION_ID_LIST_ARRAY[1];
    VerifyItem(i1);
    VerifyItem(i2);
});

function VerifyItem(idItem) {
    var valorInicial = $('#Amt' + idItem).parent().parent().prev().text();
    valorInicial = valorInicial.replace('de  R$ ', '');
    //Amt165864
    var valorFinal = $('#Amt' + idItem).text();
    //Bid165864
    var timerEnd = $('#Bid' + idItem).text();
    console.log('Tempo: ' + timerEnd + 'Valor original: ' + valorInicial +' Valor Final: ' + valorFinal);
}

//href="details.php?productid=165862"


function urlParam(url, name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(url);
    if (results === null) {
        return null;
    }
    else {
        return decodeURI(results[1]) || 0;
    }
}//http://www.lancesdevantagens.com.br/details.php?productid=165863
$("a").each(function () {
    var urlProd = this.href;
    var objId = this;
    if (this.href.indexOf('details.php?productid=') > 0) {
        var idItem = urlParam(urlProd, 'productid');
        var originalTexto = $(this).text();
        if (originalTexto.trim() !== '') {
            $(this).before('<div auctionTitle>ID: ' + idItem + '</div>');
           
        }
    }
});

$("<span/>", {
    html: '<b>ID: 165863</b>',
    insertBefore: '#Usr165863'
});
//
