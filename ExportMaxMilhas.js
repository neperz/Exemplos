
var smilesUrl = 'https://www.maxmilhas.com.br/cliente/get-miles-ranking?airline=Gol&newMiles=';
var latamUrl = 'https://www.maxmilhas.com.br/cliente/get-miles-ranking?airline=latam&newMiles=';
var aviancaUrl = 'https://www.maxmilhas.com.br/cliente/get-miles-ranking?airline=avianca&newMiles=';
var azulUrl= 'https://www.maxmilhas.com.br/cliente/get-miles-ranking?airline=azul&newMiles=';


var links='';
links = links+ '<p class="text-big-block no-margin">';
links = links+ 'Ranking:';
links = links+ '</p>';

links = links+ '<ul>';
var ltam = '<button type="button" class="button green small" onclick="exportReport(\''+ latamUrl +'\',\'Tam\',100000)">Tam 100k</button><button type="button" class="button green small" onclick="exportReport(\''+ latamUrl +'\',\'Tam\',10000)">Tam 10k</button><button type="button" class="button green small" onclick="exportReport(\''+ latamUrl +'\',\'Tam\',500)">Tam 500</button>&nbsp;<spam class="remove-offer remove-points" id="dvTam"/><br>';
var lsmiles = '<button type="button" class="button green small" onclick="exportReport(\''+ smilesUrl +'\',\'Smiles\',100000)">Smiles 100k</button><button type="button" class="button green small" onclick="exportReport(\''+ smilesUrl +'\',\'Smiles\',10000)">Smiles 10k</button><button type="button" class="button green small" onclick="exportReport(\''+ smilesUrl +'\',\'Smiles\',500)">Smiles 500</button>&nbsp;<spam class="remove-offer remove-points" id="dvSmiles"/><br>';
var lavianca = '<button type="button" class="button green small" onclick="exportReport(\''+ aviancaUrl +'\',\'Avianca\',100000)">Avianca 100k</button><button type="button" class="button green small" onclick="exportReport(\''+ aviancaUrl +'\',\'Avianca\',10000)">Avianca 10k</button><button type="button" class="button green small" onclick="exportReport(\''+ aviancaUrl +'\',\'Avianca\',500)">Avianca 500</button>&nbsp;<spam class="remove-offer remove-points" id="dvAvianca"/><br>';
var lazul = '<button type="button" class="button green small" onclick="exportReport(\''+ azulUrl +'\',\'Azul\',100000)">Azul 100k</button><button type="button" class="button green small" onclick="exportReport(\''+ azulUrl +'\',\'Azul\',10000)">Azul 10k</button><button type="button" class="button green small" onclick="exportReport(\''+ azulUrl +'\',\'Azul\',500)">Azul 500</button>&nbsp;<spam class="remove-offer remove-points" id="dvAzul"/><br>';

links = links+ '<li style="margin-bottom: 10px;">' + ltam + '</li>';
links = links+ '<li style="margin-bottom: 10px;">' + lsmiles + '</li>';
links = links+ '<li style="margin-bottom: 10px;">' + lavianca + '</li>';
links = links+ '<li style="margin-bottom: 10px;">' + lazul + '</li>';
links = links+ '</ul>';

links = links+ '<p>Acesse o <a target="_new" href="https://t.me/joinchat/Cdtqg0TOxu5mRMUM4y57ew">grupo do nosso robô</a> no Telegram e fique por dentro das super ofertas que encontramos!</p>';

//$('.legend').html(links);

$( links ).insertAfter( '.legend');

function exportReport(urlmiles, label, range)
{
	$.ajax({
    url : urlmiles + range,
    type : 'GET',
    dataType:'json',
    success : function(data) {              
		var TAB = "\t";
		var LF = "\n";
		var tab_ranking = "";

		var tab_ranking = "Username" + TAB + "Posicao"+ TAB + "Milhas"+ TAB + "Preco"+ TAB + "VendasHoje" + LF;
		for (var j = 0; j < data.list.length; j++) {
			var hk = data.list[j];
			//console.log(hk);   
		var vendaHoje =	hk.salesToday;
		if (vendaHoje==null)
			vendaHoje=0;
		var usuario = hk.username ;
		var posicao = hk.position;
		var preco = hk.price.replace(".", ",");
		var milhas = hk.miles.replace(".", ",") ;

			tab_ranking = tab_ranking + usuario + TAB + posicao + TAB + milhas + TAB + preco + TAB + vendaHoje + LF;     
		}
		tab_ranking = tab_ranking + LF + LF;

		var ua = window.navigator.userAgent;
		var msie = ua.indexOf("MSIE ");
			var dt = new Date();
			var day = dt.getDate();
			var month = dt.getMonth() + 1;
			var year = dt.getFullYear();
			var hour = dt.getHours();
			var mins = dt.getMinutes();
			var postfix = day + "_" + month + "_" + year + "_" + hour + "_" + mins;	
			var fName = label + '_Ranking_'+ range + '_' + postfix + '.xls';		
			
		if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
		{
			txtArea1.document.open("txt/html", "replace");
			txtArea1.document.write(tab_ranking);
			txtArea1.document.close();
			txtArea1.focus();
			sa = txtArea1.document.execCommand("SaveAs", true, fName);
		}
		else                 //other browser not tested on IE 11
			//sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_ranking));
	
			
			var a = document.createElement('a');			
			var data_type = 'data:application/vnd.ms-excel';			 
			a.href = data_type + ', ' + encodeURIComponent(tab_ranking);
			a.download = fName;		
			a.click();
			e.preventDefault();
		
			},
			error : function(request,error)
			{
				$('#dv'+label).html('Acesso negado a esse report, talvez vc nao tenha ofertas nesta categoria');
				console.log('Acesso negado a esse report, talvez vc nao tenha ofertas nesta categoria')
				//alert(error + "Request: "+JSON.stringify(request));
			}
		});
}
