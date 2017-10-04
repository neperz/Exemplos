// usar no Console do Chrome ou Firefox para exportar o mês atual do guiabolso para excel


var TAB = "\t";
var LF = "\n";
var tab_text = "";

var tab_cagegorias = "Codigo" + TAB + "Descricao" + LF;
for (var j = 0; j < GB.categories.length; j++) {
    var grupo = GB.categories[j];
    //console.log(grupo);
    for (var u = 0; u < grupo.categories.length; u++) {
        var cat = grupo.categories[u];
        console.log(cat);
        tab_cagegorias = tab_cagegorias + cat.id + TAB + grupo.name + " - "+ cat.name + LF;
    }
}
tab_cagegorias = tab_cagegorias + LF + LF;

tab_text = tab_text + "IDCategoria" + TAB +"Data " + TAB + "Transacao"+ TAB + "Valor"+ LF;
for (var i = 0; i < GB.transactions.length; i++) {

    var t = GB.transactions[i];
    //console.log(t.name);
    var data = new Date(t.date).toLocaleString();
    var valor = (t.originalValue + "").replace('.', ',');
    var idCategoria = t.category.id;
    tab_text = tab_text +idCategoria + TAB+  data   + TAB + t.name + TAB + valor + LF;
   // tab_text = tab_text + t.name;
    
    
}
var ua = window.navigator.userAgent;
var msie = ua.indexOf("MSIE ");

if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
{
    txtArea1.document.open("txt/html", "replace");
    txtArea1.document.write(tab_cagegorias + tab_text);
    txtArea1.document.close();
    txtArea1.focus();
    sa = txtArea1.document.execCommand("SaveAs", true, "Say Thanks to Sumit.xls");
}
else                 //other browser not tested on IE 11
    sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_cagegorias + tab_text));
