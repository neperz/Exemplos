/*
var tks = new Date().getTime();
fetch('https://raw.githubusercontent.com/neperz/Exemplos/master/RankingMax.js?t=' + tks)
    .then(response => response.text())
    .then(text => eval(text))
    .then(() => {

        setStartVars('neperz', true);
    }
);

var tks = new Date().getTime();
var url = 'https://raw.githubusercontent.com/neperz/Exemplos/master/RankingMax.js?t=' + tks;
$.getScript(url, function () { setStartVars ('neperz', true); })

*/

function displayTime() {
    var str = "";

    var currentTime = new Date()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()

    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds = "0" + seconds
    }
    str += hours + ":" + minutes + ":" + seconds + " ";
    if (hours > 11) {
        str += "PM"
    } else {
        str += "AM"
    }
    return str;
}

var nome = "";
var salvar = false;
$("<div/>", {
    html: "<input type='checkbox' id='chkSalvar'> Download automático do report<br> Nome do usuário:<input id='txtUser'>",
    id: 'dvCheckbox', 
    click: function () {
        salvar = $('#chkSalvar').is(":checked");
        nome = $('#txtUser').val();
    },
    insertBefore: "#btn_register_miles"
});
function setStartVars(user, saveOpt) {
    this.nome = user;
    this.salvar = saveOpt;
    alert(nome);
}
function DownloadExcel(data, empresa, range)
{
    var dt = new Date();
    var day = dt.getDate();
    var month = dt.getMonth() + 1;
    var year = dt.getFullYear();
    var hour = dt.getHours();
    var mins = dt.getMinutes();
    var postfix = day + "_" + month + "_" + year + "_" + hour + "_" + mins;
    var dataField = year + '-' + month + '-' + day + ' ' + hour + ':' + mins + ':00';
    var fName = empresa + '_Ranking_' + range + '_' + postfix + '.xls';
    
    var TAB = "\t";
    var LF = "\n";
    var tab_ranking = "";

    var tab_ranking = "Username" + TAB + "Posicao" + TAB + "Milhas" + TAB + "Preco" + TAB + "VendasHoje" + TAB + "DataConsulta" + TAB +"Empresa" + TAB + "Limite" + LF;
    for (var j = 0; j < data.list.length; j++) {
        var hk = data.list[j];
        var vendaHoje = hk.salesToday;
        if (vendaHoje == null)
            vendaHoje = 0;
        var usuario = hk.username;
        var posicao = hk.position;
        var preco = hk.price.replace(".", ",");
        var milhas = hk.miles.replace(".", ",");

        tab_ranking = tab_ranking + usuario + TAB + posicao + TAB + milhas + TAB + preco + TAB + vendaHoje + TAB + dataField + TAB + empresa + TAB + range +  LF;
    }
    tab_ranking = tab_ranking + LF + LF;

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
    {
        txtArea1.document.open("txt/html", "replace");
        txtArea1.document.write(tab_ranking);
        txtArea1.document.close();
        txtArea1.focus();
        sa = txtArea1.document.execCommand("SaveAs", true, fName);
    }
    else                 //other browser not tested on IE 11
    {
        var a = document.createElement('a');
        var data_type = 'data:application/vnd.ms-excel';
        a.href = data_type + ', ' + encodeURIComponent(tab_ranking);
        a.download = fName;
        a.click();
       // e.preventDefault();
    }

}

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
    var nomeCheckbox = 'chk' + range;
    var cria = true;
    if ($('#' + nomeDv).length > 0) {
       // console.log('existe ' + nomeDv);
       // $('#' + nomeDv).html("");
        //$('#' + nomeDv).toggleClass("fb_dialog fb_dialog_mobile loading", true);
        cria = false;
    }
    $.ajax({
        url: urlMiles + range,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (salvar) {                              
                DownloadExcel(data, label, range);
            }
            var lastUpdate = displayTime();
           var tab_ranking = "";
            $("#price_prefix").toggleClass("fb_dialog fb_dialog_mobile loading", false);
           // $('#' + nomeDv).toggleClass("fb_dialog fb_dialog_mobile loading", false);

           // var tab_rankingHeader = '<div class="ranking-table" style="width: 30%;position:relative;float:left;margin-top:0px"  id="' + nomeDv + '">';
            //if (cria)
            //    tab_ranking = tab_rankingHeader + tab_ranking
            tab_ranking = tab_ranking + '<div class="title"> Ofertas ' + (range / 1000) + 'k *clique para atualizar<br>Atualizado em ' + lastUpdate + '</div>';

            for (var j = 0; j < 100; j++) {
                var cor = 'green';
                var corPreco = 'green';
                var hk = data.list[j];
                
                var vendaHoje = hk.salesToday;
                if (vendaHoje == null)
                    vendaHoje = 0;
                var usuario = hk.username;
                if (usuario == nome) {
                    cor = 'red';
                    corPreco = 'red';
                }
                if (vendaHoje > 5)
                    corPreco = 'blue';
                var posicao = hk.position;
                var preco = hk.price.replace(".", ",");
                var milhas = hk.miles.replace(".", ",");
                
               
               // console.log(usuario);
  
                tab_ranking = tab_ranking + '<div class="dbody">';
                tab_ranking = tab_ranking + '<strong class="text-gray">' + posicao + 'º</strong> ';
                tab_ranking = tab_ranking + '<span class="text-' + corPreco +' price" data-price="' + hk.price + '" title="' + milhas +' anunciadas">R$ ' + preco + '</span> ';
                tab_ranking = tab_ranking + '<span class="text-' + cor + '" title="' + vendaHoje + ' vendas hoje">(' + usuario + ') *' + vendaHoje +'</span>';
                tab_ranking = tab_ranking + '</div>';
            }
            //tab_footer = + "</div>";
            if (cria) {
                $("<div/>", {
                    html: tab_ranking,
                    id: nomeDv,
                    "class": "ranking-table",      // ('class' is still better in quotes)
                    css: {
                        "width": "30%",
                        "position": "relative",
                        "float": "left",
                        "margin-top": "0px"
                    },
                    click: function () {
                        loadTables(label, range);
                    },
                    insertBefore: "#btn_register_miles"
                });
            }
            //if (cria)
              //  tab_ranking =  tab_ranking + tab_footer
            //$('#' + nomeDv).html(tab_ranking);
            if (cria) {
              //  $(tab_ranking).insertBefore("#btn_register_miles");
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
//**********************configuracoes**********
//tempo de atualização
let delay = 300000; //5 minutos
//use seu usuario
nome = 'usuario';
//salvar arquivo
salvar = false;
//******************fim*********************
var contaTime = 0;
var operadora = window.location.href.split('/')[4];
loadTables( operadora, 100000);
loadTables( operadora, 10000);
loadTables(operadora, 500);




let timerId = setTimeout(function request() {
    var operadora = window.location.href.split('/')[4];
    loadTables(operadora, 100000);
    loadTables(operadora, 10000);
    loadTables(operadora, 500);
    contaTime++;

timerId = setTimeout(request, delay);

}, delay);
