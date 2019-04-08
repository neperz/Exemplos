
var menorPreco = {
    valor: 999999.9,
    destino: '',
    achados: [],
    link: '',
    melhor: { flightCode: '' },
};
var normalPreco = {
    valor: 999999.9,
    destino: '',
    achados: [],
    link: '',
    melhor: { flightCode: '' },
};
function resetGlobals() {
    menorPreco = {
        valor: 999999.9,
        destino: '',
        achados: [],
        melhor: { flightCode:''},
        link: ''
    };
    normalPreco = {
        valor: 999999.9,
        destino: '',
        achados: [],
        melhor: { flightCode: '' },
        link: ''
    };
    $('#rConsulta').html('');
    $('#rOriginal').html('');
}
var places = [];
g_csLoaded = true;

function RenderTela() {
    var urlPlace = 'https://bff.latam.com/ws/api/bookingbox-services/v1/origins?airline=tam&portal=pessoas&application=compra&applicationName=shopping&country=BR&language=pt&step=2';
    $.ajax({
        url: urlPlace,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            var options = '<option value="">Selecione</option>';
            for (var i = 0; i < data.data.places.length; i++) {
                p = data.data.places[i];
                if (p.label.indexOf('Brasil') > 0) {
                    places.push(p);
                    options += '<option value="' + p.iataCode + '">' + p.label + '</option>';
                }
            }
            var sOrigem =  '<tr><td> Origem: </td> <td><select id="cbnOrigem">' + options + '</select></td></tr>';
            var sDestino = '<tr><td> Destino: </td> <td><select id="cbnDestino">' + options + '</select></td></tr>';
            var sAdultos = '<tr><td> Adultos: </td> <td><input id="txtAdultos" value="1"></td></tr>';
            var sData = '<tr><td> Data de Ida: </td> <td><input id="txtDtIda" value="2018-09-09"> (ano-mes-dia)</td></tr>';
            var sBtnConsulta = '<input type="button" value="Consultar Melhor Pre�o" onclick="doConsulta()">';
            var sBtnConsultaNormal = '<input type="button" value="Consultar Normal" onclick="doConsultaNormal()">';
            var sLabelInfo = 'Pesquisa Normal <spam id="rOriginal"></spam>';
            var sLabelInfoOriginal = 'Pesquisa Escalas: <spam id="rConsulta"></spam>';
            msg = '<p><table border="0">' + sOrigem +
                 sDestino +
                sData + sAdultos + 
                '</table>' +
                '<strong id="rStatus" class="week-day-string">Consulta Interna</strong>' +
                '<br>' + sBtnConsultaNormal + sBtnConsulta +  
                '<br>' + sLabelInfoOriginal +
                '<br>' + sLabelInfo + 
                '<br> ' +
                '</p>';

            $("<div/>", {
                html: msg,
                id: 'dvPrincipal',
                "class": "ranking-table",      // ('class' is still better in quotes)
                css: {
                    "width": "90%" //,
                    //"position": "relative",
                   // "float": "left",
                   // "margin-top": "0px"
                },
                //click: function () {
                //    printResult();
                //},
                insertBefore: ".flight-selection-instruction"
            });

           // $('.flight-selection-instruction').html(msg);
            $('.itinerary-route').html('Consulta Personalizada!');
            $('.trip-summary').html('-');
            //$('.flight-list').html('-');
            //$('.flexible-dates-container').html('-');            
            
        },
        error: function (request, error) {
            console.log(error);
            //console.log('Acesso negado a esse report, talvez vc nao tenha ofertas nesta categoria');
            // $('#' + nomeDv).html('Acesso negado a esse report, talvez vc nao tenha ofertas nesta categoria');

            //alert(error + "Request: "+JSON.stringify(request));
        }
    });

}
refreshIntervalId  = 0;
function doConsultaNormal() {
    resetGlobals();
    var origem = $('#cbnOrigem').val();
    var destino = $('#cbnDestino').val();
    var adultos = $('#txtAdultos').val();
    var data = $('#txtDtIda').val();
    text = "Aguarde Consultando..";
    refreshIntervalId = setInterval(function () {
        $("#rStatus").html(text + Array((++i % 4) + 1).join("."));
       // if (i === 10) text = "Conclu�do";
    }, 500);
   // $('#rStatus').html("..consultando");
    GetNormalPrice(origem, destino, data, adultos);
}
function doConsulta() {
    resetGlobals();
    var origem = $('#cbnOrigem').val();
    var destino = $('#cbnDestino').val();
    var data = $('#txtDtIda').val();
    var adultos = $('#txtAdultos').val();
    text = "Aguarde Consultando..";
    refreshIntervalId = setInterval(function () {
        $("#rStatus").html(text + Array((++i % 4) + 1).join("."));
        // if (i === 10) text = "Conclu�do";
    }, 500);
    //$('#rStatus').html('..consultando');
    GetNormalPrice(origem, destino, data, adultos);
    FindBestPrice(origem, destino, data, adultos);
}
function FindBestPrice(origem, destino, datapartida, adultos) {
    for (var i = 0; i < places.length; i++) {
        p = places[i];
        if (p.iataCode !== destino) {
            GetPrice(origem, p.iataCode, destino, datapartida, adultos);
        }
    }
}
function formataDinheiro(n) {
    return "R$ " + n.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
}

function mostraMenor() {

    var perc = (menorPreco.valor / normalPreco.valor) * 100;
    var tperc = 100 - perc;

    var msg = menorPreco.destino + ' (' + menorPreco.melhor.flightCode + ') por: <b>' + formataDinheiro(menorPreco.valor) + '</b> (' + tperc.toFixed(2) + '% OFF) ' 
        
    if (menorPreco.valor === 999999.9) {
        msg = 'Nenuma escala foi encontrada para esta consulta';
    }
    msg += printTable(menorPreco.achados);
    msg += '<a class="week-day-selector" target="_new" href="' + menorPreco.link + '">Link</a>';
    
    $('#rConsulta').html(msg);
}
function printTable(achados) {
    var tabela = '';
    if (achados) {
        var linhas = '';
        nAchados = achados.length;
        achados.sortByPreco = function () {
            this.sort(function (a, b) {
                return a.cabins[0].displayPrice - b.cabins[0].displayPrice;
            });
        };
        achados.sortByPreco();
        if (nAchados >= 3) {
            nAchados = 3;
        }
        for (var j = 0; j < nAchados; j++) {
            var a = achados[j];
            linhas += '<tr>' +
                '<td style="padding: 2px;">' + j + ' - ' + a.arrival.airportCode + '</td>' +
                '<td style="padding: 2px;"><b>' + formataDinheiro(a.cabins[0].displayPrice) + '</b></td>' +
                '<td style="padding: 2px;">' + a.flightCode + '</td>' +
                '<td style="padding: 2px;">' + a.arrival.time.stamp + '</td>' +
                '</tr>';
        }

        tabela = '<br>Melhores Resultados:<table border="1" cellpadding ="1"><tr><td>Destino</td><td>Pre�o</td><td>Voo</td><td>Chegada</td></tr>' + linhas + '</table>';
    }
    return tabela;
}
function mostraNormal() {
    var msg = normalPreco.destino + ' (' + normalPreco.melhor.flightCode + ') <b>' + formataDinheiro(normalPreco.valor) + '</b> '
        
    msg += printTable(normalPreco.achados);
    msg += '<a class="week-day-selector" target="_new" href="' + normalPreco.link + '">Link</a>';   
    $('#rOriginal').html(msg);
}
$(document).ajaxStop(function () {
    mostraNormal();
    mostraMenor();    
    clearInterval(refreshIntervalId);
    $('#rStatus').html('Conclu�do');
});
function GetNormalPrice(origem, destino, data, adultos) {
  
    var consulta =
    {
        country: 'BR',
        language: 'PT',
        home: 'pt_br',
        origin: origem, //'MAO',
        destination: destino, //'BEL',
        departure: data, //'2018-09-09',
        adult: adultos,
        cabin: 'Y',
        fecha1_dia: data.slice(-2),
        fecha1_anomes: data.substring(0, 7)
    };
        
    var urldef = 'https://bff.latam.com/ws/proxy/booking-webapp-bff/v1/public/revenue/recommendations/oneway?' +
        'country=' + consulta.country + '&language=' + consulta.language + '&home=' + consulta.home + '&' +
        'origin=' + consulta.origin + '&destination=' + consulta.destination + '&departure=' + consulta.departure + '&adult=' + consulta.adult + '&cabin=' + consulta.cabin +'&promoCode='; 
    $.ajax({
        url: urldef,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            for (var i = 0; i < data.data.flights.length; i++) {
                var voo = data.data.flights[i];
                var preco = parseFloat(voo.cabins[0].displayPrice);
                if (normalPreco.valor > preco) {
                    normalPreco.valor = preco;
                    normalPreco.destino = destino;
                    normalPreco.melhor = voo;
                    var link = 'https://www.latam.com/pt_br/apps/personas/booking?' +
                        'fecha1_dia=' + consulta.fecha1_dia +
                        '&fecha1_anomes=' + consulta.fecha1_anomes +
                        '&auAvailability=1' +
                        '&ida_vuelta=ida' +
                        '&from_city1=' + consulta.origin +
                        '&to_city1=' + destino +
                        '&flex=1' +
                        '&cabina=Y' +
                        '&nadults=' + consulta.adult +
                        '&nchildren=0' +
                        '&ninfants=0';
                    normalPreco.link = link;
                    mostraNormal();
                }
                normalPreco.achados.push(voo);                                    
            }            
        },
        error: function (request, error) {
            console.log(error);
        }
    });
}

function GetPrice(origem, destino, destinoProcurado, data, adultos) {

    if (destino === destinoProcurado)
        return;
    var consulta =
    {
        country: 'BR',
        language: 'PT',
        home: 'pt_br',
        origin: origem, //'MAO',
        destination: destino, //'BEL',
        departure: data, //'2018-09-09',
        adult: adultos,
        cabin: 'Y',
        fecha1_dia: data.slice(-2),
        fecha1_anomes: data.substring(0, 7)
    };

    var urldef = 'https://bff.latam.com/ws/proxy/booking-webapp-bff/v1/public/revenue/recommendations/oneway?' +
        'country=' + consulta.country +
        '&language=' + consulta.language +
        '&home=' + consulta.home + '&' +
        'origin=' + consulta.origin +
        '&destination=' + consulta.destination +
        '&departure=' + consulta.departure +
        '&adult=' + consulta.adult +
        '&cabin=' + consulta.cabin;
    $.ajax({
        url: urldef,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            for (var i = 0; i < data.data.flights.length; i++) {
                var voo = data.data.flights[i];
                var segs = voo.segments;
                //console.log(segs);
                for (var j = 0; j < segs.length; j++) {
                    var seg = segs[j];
                    //console.log(seg.arrival.airportCode + '::' + destinoProcurado);
                    if (seg.arrival.airportCode === destinoProcurado) {
                        var preco = parseFloat(voo.cabins[0].displayPrice);                        
                        if (menorPreco.valor > preco) {
                            console.log(menorPreco.valor + '-->' + preco);
                            menorPreco.valor = preco;
                            menorPreco.destino = destino;
                            menorPreco.melhor = voo;
                            var link = 'https://www.latam.com/pt_br/apps/personas/booking?' +
                                'fecha1_dia=' + consulta.fecha1_dia +
                                '&fecha1_anomes=' + consulta.fecha1_anomes +
                                '&auAvailability=1' +
                                '&ida_vuelta=ida' +
                                '&from_city1=' + consulta.origin +
                                '&to_city1=' + destino +
                                '&flex=1' +
                                '&cabina=Y' +
                                '&nadults=' + consulta.adult  +
                                '&nchildren=0' +
                                '&ninfants=0';
                            menorPreco.link = link;
                            mostraMenor();
                        }
                        menorPreco.achados.push(voo);
                    }
                }
            }
        },
        error: function (request, error) {
            console.log(error);
            // console.log('Acesso negado a esse report, talvez vc nao tenha ofertas nesta categoria');
            // $('#' + nomeDv).html('Acesso negado a esse report, talvez vc nao tenha ofertas nesta categoria');

            //alert(error + "Request: "+JSON.stringify(request));
        }
    });
}

RenderTela();