// ==UserScript==
// @name EscalasLatam
// @description Encontra voos mais baratos com escalas
// @version 1.0
// @author Neperz
// @license MIT
// @include *
// @icon http://pics.smotri.com/cskins/blue/smiles/bt.gif
// @run-at document-end
// @grant none
// @match https://www.latam.com/pt_br/apps*
// ==/UserScript==

(function () {
    'use strict';

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
            melhor: { flightCode: '' },
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
    //g_csLoaded = true;

    function RenderTela() {
        var urlPlace = 'https://www.latam.com/ws/api/booking-box/v2/originsBB?airline=tam&portal=pessoas&application=compra&country=BR&language=pt';
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
                var sOrigem = 'Origem: <select id="cbnOrigem">' + options + '</select>';
                var sDestino = 'Destino: <select id="cbnDestino">' + options + '</select>';
                var sData = 'Data de Ida: <input id="txtDtIda" value="2018-09-09"> (ano-mes-dia)';
                var sBtnConsulta = '<input type="button" value="Consultar Melhor Preço" onclick="doConsulta()">';
                var sBtnConsultaNormal = '<input type="button" value="Consultar Normal" onclick="doConsultaNormal()">';
                var sLabelInfo = 'Pesquisa Normal <spam id="rOriginal"></spam>';
                var sLabelInfoOriginal = 'Pesquisa Escalas: <spam id="rConsulta"></spam>';
                msg = '<p>' + sOrigem +
                    '<br>' + sDestino +
                    '<br>' + sData +
                    '<br>' + sBtnConsultaNormal + sBtnConsulta +
                    '<br>' + sLabelInfoOriginal +
                    '<br>' + sLabelInfo +
                    '<br> </p>' +
                    '<i id="rStatus">Consulta Interna</i>';
                $('.flight-selection-instruction').html(msg);
                $('.itinerary-route').html('Consulta Personalizada!');
                $('.trip-summary').html('-');
               // $('.flight-list').html('-');
                // $('.flexible-dates-container').html('-');


            },
            error: function (request, error) {
                console.log(error);
                //console.log('Acesso negado a esse report, talvez vc nao tenha ofertas nesta categoria');
                // $('#' + nomeDv).html('Acesso negado a esse report, talvez vc nao tenha ofertas nesta categoria');

                //alert(error + "Request: "+JSON.stringify(request));
            }
        });

    }
    function doConsultaNormal() {
        resetGlobals();
        var origem = $('#cbnOrigem').val();
        var destino = $('#cbnDestino').val();
        var data = $('#txtDtIda').val();
        $('#rStatus').html("..consultando");
        GetNormalPrice(origem, destino, data);
    }
    function doConsulta() {
        resetGlobals();
        var origem = $('#cbnOrigem').val();
        var destino = $('#cbnDestino').val();
        var data = $('#txtDtIda').val();
        $('#rStatus').html('..consultando');
        GetNormalPrice(origem, destino, data);
        FindBestPrice(origem, destino, data);
    }
    function FindBestPrice(origem, destino, datapartida) {
        for (var i = 0; i < places.length; i++) {
            p = places[i];
            if (p.iataCode !== destino) {
                GetPrice(origem, p.iataCode, destino, datapartida);
            }
        }
    }
    function formataDinheiro(n) {
        return "R$ " + n.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
    }

    function mostraMenor() {

        var perc = (menorPreco.valor / normalPreco.valor) * 100;
        var tperc = 100 - perc;

        var msg = 'Encontrada em ' + menorPreco.destino + ' (' + menorPreco.melhor.flightCode + ') por: ' + formataDinheiro(menorPreco.valor) + ' (' + tperc.toFixed(2) + '% OFF) <a target="_new" href="' + menorPreco.link + '">Link</a>';
        if (menorPreco.valor === 999999.9) {
            msg = 'Nenuma escala foi encontrada para esta consulta';
        }
        $('#rConsulta').html(msg);
    }
    function mostraNormal() {
        var msg = 'Preço Normal ' + normalPreco.destino + ' (' + normalPreco.melhor.flightCode + ') ' + formataDinheiro(normalPreco.valor) + '  <a target="_new" href="' + normalPreco.link + '">Link</a>';
        $('#rOriginal').html(msg);
    }
    $(document).ajaxStop(function () {
        mostraNormal();
        mostraMenor();
        $('#rStatus').html('Concluído');
    });
    function GetNormalPrice(origem, destino, data) {

        var consulta =
        {
            country: 'BR',
            language: 'PT',
            home: 'pt_br',
            origin: origem, //'MAO',
            destination: destino, //'BEL',
            departure: data, //'2018-09-09',
            adult: 1,
            cabin: 'Y',
            fecha1_dia: data.slice(-2),
            fecha1_anomes: data.substring(0, 7)
        };

        var urldef = 'https://bff.latam.com/ws/proxy/booking-webapp-bff/v1/public/revenue/recommendations/oneway?' +
            'country=' + consulta.country + '&language=' + consulta.language + '&home=' + consulta.home + '&' +
            'origin=' + consulta.origin + '&destination=' + consulta.destination + '&departure=' + consulta.departure + '&adult=' + consulta.adult + '&cabin=' + consulta.cabin;
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
                            '&flex=1&cabina=Y&nadults=1&nchildren=0&ninfants=0';
                        normalPreco.link = link;
                        mostraNormal();
                    }
                    normalPreco.achados.push(voo);
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

    function GetPrice(origem, destino, destinoProcurado, data) {

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
            adult: 1,
            cabin: 'Y',
            fecha1_dia: data.slice(-2),
            fecha1_anomes: data.substring(0, 7)
        };

        var urldef = 'https://bff.latam.com/ws/proxy/booking-webapp-bff/v1/public/revenue/recommendations/oneway?' +
            'country=' + consulta.country + '&language=' + consulta.language + '&home=' + consulta.home + '&' +
            'origin=' + consulta.origin + '&destination=' + consulta.destination + '&departure=' + consulta.departure + '&adult=' + consulta.adult + '&cabin=' + consulta.cabin;
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
                        console.log(seg.arrival.airportCode + '::' + destinoProcurado);
                        if (seg.arrival.airportCode === destinoProcurado) {
                            var preco = parseFloat(voo.cabins[0].displayPrice);
                            console.log(menorPreco.valor + '-->' + preco);
                            if (menorPreco.valor > preco) {
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
                                    '&flex=1&cabina=Y&nadults=1&nchildren=0&ninfants=0';
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

}
)();