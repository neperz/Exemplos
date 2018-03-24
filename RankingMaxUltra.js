/*
var tks = new Date().getTime();
fetch('https://raw.githubusercontent.com/neperz/Exemplos/master/RankingMax.js?t=' + tks)
    .then(response => response.text())
    .then(text => eval(text))    
);

var tks = new Date().getTime();
var url = 'https://raw.githubusercontent.com/neperz/Exemplos/master/RankingMax.js?t=' + tks;
$.getScript(url, function () { setStartVars ('neperz', true); })



*/
var databasee = [],
    arrIndex = {};
function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}

function addOrReplace(object) { 
    
    const index = databasee.findIndex(_item => _item.usuario === object.usuario);
    if (index > -1) {
        var atual = databasee[index];
        var va = parseInt(atual.vendaHoje);
        var vo = parseInt(object.vendaHoje);
        if (va != vo) {            
            object.updatecount = object.updatecount + 1;
            object.atualizacao = displayTime();
            databasee[index] = object;
        }
        if (atual.usuario == nome) {
            if (atual.range == object.range) {
                if (atual.position != object.position) {
                    alertaTelegram(object, atual.position, object.position);
                }
            }
        }
        
    }
    else {
        databasee.push(object);        
    }

}
//function addOrReplace(object) {    
//    var tks = new Date().getTime();
//    var index = arrIndex[object.usuario];
   
//    if (index === undefined) {
//        index = databasee.length;        
//    }
//    else {     
//        var atual = databasee[index];
//        var va = parseInt(atual.vendaHoje);
//        var vo = parseInt(object.vendaHoje);
//        if (va != vo) {
//            console.log(atual);
//            console.log(object);
//            object.updatecount = object.updatecount + 1;
//            object.atualizacao = tks;
//        }
//    }    
//    arrIndex[object.usuario] = index;    
//    databasee[index] = object;    
//}



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
var lpos = "";
var salvar = false;
var vendasHoje = false;
var idUserTelegram = '0';
var adsLocal = '<p>Acesse o <a target="_new" href="https://t.me/joinchat/Cdtqg0TOxu5mRMUM4y57ew">grupo do nosso rob�</a> no Telegram e fique por dentro das super ofertas que encontramos!</p>';
$("<div/>", {
    html: "<input type='checkbox' id='chkSalvar'> Download autom�tico do report<br> Nome do usu�rio:<input id='txtUser'>" + adsLocal,
    id: 'dvCheckbox',
    click: function () {
        salvar = $('#chkSalvar').is(":checked");
        nome = $('#txtUser').val();
    },
    insertBefore: "#btn_register_miles"
});

$("<div/>", {
    html: "<input type='checkbox' id='chkVendasHoje'> Ordenar por vendas hoje",
    id: 'dvVendasHoje',
    click: function () {
        vendasHoje = $('#chkVendasHoje').is(":checked");
        LoadTudo();
    },
    insertBefore: "#btn_register_miles"
});
function setStartVars(user, saveOpt) {
    this.nome = user;
    this.salvar = saveOpt;
    alert(nome);
}
function DownloadExcel(data, empresa, range) {
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

    var tab_ranking = "Username" + TAB + "Posicao" + TAB + "Milhas" + TAB + "Preco" + TAB + "VendasHoje" + TAB + "DataConsulta" + TAB + "Empresa" + TAB + "Limite" + LF;
    for (var j = 0; j < data.list.length; j++) {
        var hk = data.list[j];
        var vendaHoje = hk.salesToday;
        if (vendaHoje == null)
            vendaHoje = 0;
        var usuario = hk.username;
        var posicao = hk.position;
        var preco = hk.price.replace(".", ",");
        var milhas = hk.miles.replace(".", ",");

        tab_ranking = tab_ranking + usuario + TAB + posicao + TAB + milhas + TAB + preco + TAB + vendaHoje + TAB + dataField + TAB + empresa + TAB + range + LF;
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

    function sortJSON(data, key) {
        return data.sort(function (a, b) {
            var x = a[key];
            var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }


    $.ajax({
        url: urlMiles + range,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (salvar) {
                DownloadExcel(data, label, range);
            }
            //data = data.sort((a, b) => Number(a.salesToday) - Number(b.salesToday));
            // data.sort(GetSortOrder("salesToday")); 
            if (vendasHoje) {
                data.list.sortById = function () {
                    this.sort(function (a, b) {
                        return b.salesToday - a.salesToday;
                    });
                };
                data.list.sortById();
            }

            $("#price_prefix").toggleClass("fb_dialog fb_dialog_mobile loading", false);
            // $('#' + nomeDv).toggleClass("fb_dialog fb_dialog_mobile loading", false);

            // var tab_rankingHeader = '<div class="ranking-table" style="width: 30%;position:relative;float:left;margin-top:0px"  id="' + nomeDv + '">';
            //if (cria)
            //    tab_ranking = tab_rankingHeader + tab_ranking
            var lastUpdate = displayTime();
            var tab_ranking = "";
            tab_ranking = tab_ranking + '<div class="title"> Ofertas ' + (range / 1000) + 'k *clique para atualizar<br>Atualizado em ' + lastUpdate + '</div>';
            var atual = 0;
            var maior = 0;

            for (var j = 0; j < 2500; j++) {
                var cor = 'green';
                var corPreco = 'green';
                var hk = data.list[j];
                if (!hk)
                    continue;
                var vendaHoje = hk.salesToday;
                if (vendaHoje == null)
                    vendaHoje = 0;
                var usuario = hk.username;
                if (vendaHoje > 5)
                    corPreco = 'blue';
                if (vendaHoje > 50)
                    corPreco = 'red';
                var posicao = hk.position;
                var preco = hk.price.replace(".", ",");
                var milhas = hk.miles.replace(".", ",");

                if (usuario == nome) {
                    cor = 'red';
                    corPreco = 'red';
                    
                }
                
                var xdata = {
                    usuario: usuario,
                    posicao: posicao,
                    price: hk.price,
                    milhas: milhas,
                    vendaHoje: vendaHoje,
                    corPreco: corPreco,
                    cor:cor,
                    updatecount: 1,
                    atualizacao: '-',
                    rankingname : nomeDv,
                    range: range
                };
                addOrReplace(xdata);
               

                tab_ranking = tab_ranking + '<div class="dbody">';
                tab_ranking = tab_ranking + '<strong class="text-gray">' + posicao + '�</strong> ';
                tab_ranking = tab_ranking + '<span class="text-' + corPreco + ' price" data-price="' + hk.price + '" title="' + milhas + ' anunciadas">R$ ' + preco + '</span> ';
                tab_ranking = tab_ranking + '<span class="text-' + cor + '" title="' + vendaHoje + ' vendas hoje">(' + usuario + ') *' + vendaHoje + '</span>';
                tab_ranking = tab_ranking + '</div>';
               
            }
            //tab_footer = + "</div>";
            //console.log(cria);
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
            printResult();
            //e.preventDefault();
           // console.log(databasee);
        },
        error: function (request, error) {
            console.log(error);
            console.log('Acesso negado a esse report, talvez vc nao tenha ofertas nesta categoria');
            $('#' + nomeDv).html('Acesso negado a esse report, talvez vc nao tenha ofertas nesta categoria');

            //alert(error + "Request: "+JSON.stringify(request));
        }
    });
}

function alertaTelegram(usr, de, para) {
    if (usr.usuario == nome) {             
            
            if (idUserTelegram != '0') {
                var tks = new Date().getTime();
                var msg = 'R.' + range + ': usu�rio ' + nome + ' mudou de ' + de + ' para ' + para + ' restam ' + usr.milhas;                
                var urlTelegram = 'https://script.google.com/macros/s/AKfycbyOpmoxdr8hn2CvQ99uxV2kGZkviudHcoRhm5Tk-jdKkL-cx1dj/exec?max=1&idu=' + idUserTelegram + '&msg=' + msg + '&t=' + tks;
                
                $('<iframe />', { id: 'myFrame', src: urlTelegram }).appendTo('body');
                // Get reference to the iframe element
                var iframe = $('#myFrame').get(0);
            }        
    }
}

function printResult() {
    var cria = true;
    if ($('#geralrk').length > 0) {

        cria = false;
    }

    var lastUpdate = displayTime();
    var tab_ranking = "";
    var tab_ranking_10000 = "";
    var tab_ranking_500 = "";
    tab_ranking = tab_ranking + '<div class="title"> Ultimas atualiza��es </div>';

    //databasee
    /*
    loadTables(operadora, 100000);
    loadTables(operadora, 10000);
    loadTables(operadora, 500);
     */
    databasee.sortById = function () {
        this.sort(function (a, b) {
            return b.updatecount - a.updatecount;
        });
    };
    databasee.sortById();
    for (var j = 0; j < 10; j++) {
        
        var hk = databasee[j];
        
        if (!hk)
            continue;
        var preco = roundToTwo(hk.price);//.replace(".", ",");
        
        tab_ranking = tab_ranking + '<div class="dbody">';
        tab_ranking = tab_ranking + '<strong class="text-gray">' + hk.posicao + '�</strong> ';
        tab_ranking = tab_ranking + '<span class="text-' + hk.corPreco + ' price" data-price="' + hk.price + '" title="' + hk.milhas + ' anunciadas">R$ ' + preco + '</span> ';
        tab_ranking = tab_ranking + '<span class="text-' + hk.cor + '" title="' + hk.vendaHoje + ' vendas hoje">(' + hk.usuario + ') *' + hk.vendaHoje + ' ups: ' + hk.updatecount + ' - ' + hk.atualizacao + '</span>';
        tab_ranking = tab_ranking + '</div>';
    }

    if (cria) {
        $("<div/>", {
            html: tab_ranking,
            id: 'geralrk',
            "class": "ranking-table",      // ('class' is still better in quotes)
            css: {
                "width": "30%",
                "position": "relative",
                "float": "left",
                "margin-top": "0px"
            },
            click: function () {
                printResult();
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
        $('#geralrk').html(tab_ranking);
    }

}
//**********************configuracoes**********
//tempo de atualiza��o
let delay = 70000; //5 minutos
//use seu usuario
nome = 'nonono';
//id do usu�rio no telegram � um numero n�a o nome do usu�rio deve seguir o bot @milhasbot para que ele possa enviar mensagens
idUserTelegram = '0';
//salvar arquivo
salvar = false;
//******************fim*********************
var contaTime = 0;
var operadora = window.location.href.split('/')[4];
loadTables(operadora, 100000);
loadTables(operadora, 10000);
//loadTables(operadora, 500);
printResult();

function LoadTudo() {
    var operadora = window.location.href.split('/')[4];
    loadTables(operadora, 100000);
    loadTables(operadora, 10000);
    //loadTables(operadora, 500);
    printResult();
}


let timerId = setTimeout(function request() {
    var operadora = window.location.href.split('/')[4];
    loadTables(operadora, 100000);
    loadTables(operadora, 10000);
    //loadTables(operadora, 500);
    contaTime++;

    timerId = setTimeout(request, delay);

}, delay);
