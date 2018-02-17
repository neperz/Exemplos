/*

fetch('https://raw.githubusercontent.com/neperz/Exemplos/master/ExportMaxObfuscate')
    .then(response => response.text())
    .then(text => eval(text));

*/


var latamUrl = 'https://www.maxmilhas.com.br/cliente/get-miles-ranking?airline=latam&newMiles=';


function loadTables(label, range) {

    var urlMiles = "";
    var smilesUrl = 'https://www.maxmilhas.com.br/cliente/get-miles-ranking?airline=Gol&newMiles=';
    var latamUrl = 'https://www.maxmilhas.com.br/cliente/get-miles-ranking?airline=latam&newMiles=';
    var aviancaUrl = 'https://www.maxmilhas.com.br/cliente/get-miles-ranking?airline=avianca&newMiles=';
    var azulUrl = 'https://www.maxmilhas.com.br/cliente/get-miles-ranking?airline=azul&newMiles=';
    if (label == 'latam')
        urlMiles = latamUrl;
    if (label == 'avianca')
        urlMiles = aviancaUrl;
    if (label == 'azul')
        urlMiles = azulUrl;
    if (label == 'gol')
        urlMiles = smilesUrl;

    $("#price_prefix").toggleClass("fb_dialog fb_dialog_mobile loading", true);
    var nomeDv = 'dv' + range;
    var cria = true;
    if ($('#' + nomeDv).length > 0) {
        $('#' + nomeDv).html("");
        //$('#' + nomeDv).toggleClass("fb_dialog fb_dialog_mobile loading", true);
        cria = false;
    }
    $.ajax({
        url: urlMiles + range,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
           var tab_ranking = "";
            $("#price_prefix").toggleClass("fb_dialog fb_dialog_mobile loading", false);
           // $('#' + nomeDv).toggleClass("fb_dialog fb_dialog_mobile loading", false);
            var tab_rankingHeader = '<div class="ranking-table" style="width: 30%;position:relative;float:left;margin-top:0px"  id="' + nomeDv + '">';
            if (cria)
                tab_ranking = tab_rankingHeader + tab_ranking
            tab_ranking = tab_ranking + '<div class="title" onclick="loadTables(\'' + label + '\', ' + range + ')"> Reais ofertantes no momento (' + range + ') </div>';

            for (var j = 0; j < 20; j++) {
                var hk = data.list[j];
                //console.log(hk);   
                var vendaHoje = hk.salesToday;
                if (vendaHoje == null)
                    vendaHoje = 0;
                var usuario = hk.username;
                var posicao = hk.position;
                var preco = hk.price.replace(".", ",");
                var milhas = hk.miles.replace(".", ",");
               
               // console.log(usuario);
  
                tab_ranking = tab_ranking + '<div class="dbody">';
                tab_ranking = tab_ranking + '<strong class="text-gray">' + posicao + 'º</strong> ';
                tab_ranking = tab_ranking + '<span class="text-green price" data-price="' + hk.price + '">R$ ' + preco + '</span> ';
                tab_ranking = tab_ranking + '<span class="text-gray">(' + usuario + ')</span>';
                tab_ranking = tab_ranking + '</div>';
            }
            tab_footer = + "</div>";
            if (cria)
                tab_ranking =  tab_ranking + tab_footer
            //$('#' + nomeDv).html(tab_ranking);
            if (cria) {
                $(tab_ranking).insertBefore("#btn_register_miles");
            }
            else {
                $('#' + nomeDv).html(tab_ranking);
            }

            //e.preventDefault();

        },
        error: function (request, error) {
            console.log(error);
            console.log('Acesso negado a esse report, talvez vc nao tenha ofertas nesta categoria');
            $('#' + nomeDv).html('Acesso negado a esse report, talvez vc nao tenha ofertas nesta categoria');
            
            //alert(error + "Request: "+JSON.stringify(request));
        }
    });
}
var operadora = window.location.href.split('/')[4];
loadTables( operadora, 100000);
loadTables( operadora, 10000);
loadTables( operadora, 500);