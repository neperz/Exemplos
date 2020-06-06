//Loge no site https://sistemas.df.gov.br/MTeste/Agendamentos com seus dados
//Injete esse código no console do chrome ou firefox
//Clique no botão Procurar para inciar a busca por agendamento
//se quiser parar clique em parar
//quando houver agendamento disponíevel o script toca um mp3 e marca a ocorrencia na tela
javascript:(function() {
    function l(u, i) {
        var d = document;
        if (!d.getElementById(i)) {
            var s = d.createElement('script');
            s.src = u;
            s.id = i;
            d.body.appendChild(s);
        }
    }
    l('//code.jquery.com/jquery-3.2.1.min.js', 'jquery')
})();

var links='';
links = links+ '<p class="text-big-block no-margin">';
links = links+ 'Consultas:';
links = links+ '</p>';
links = links+ '<button type="button" class="button green small" onclick="startTimeLoop()">Procurar</button>' +
'<button type="button" class="button green small" onclick="StopBusca()">Parar</button><p id="labelstart">...</p>'+
'<div style="width: 250px; height: 150px; overflow-y: scroll;" id="painelResult"><spam id="dvResult"/></div>';

var txt3 = document.createElement("p");
txt3.innerHTML = links;
$('.content-middle').append(txt3);
 
function StopBusca()
{
    clearTimeout(tokenTimer);
}
function playSound(){
    var audio = document.createElement('audio');
    audio.style.display = "none";
    audio.src = "https://freesound.org/data/previews/254/254819_4597795-lq.mp3";
    audio.autoplay = true;
    audio.onended = function(){
      audio.remove() //Remove when played.
    };
    document.body.appendChild(audio);
  }

var xtoken ="";
var cdata = getCook('nr2MTeste_Core');       
xtoken = cdata.split(';')[0].replace('crf=','');
//crf=9J1Nd9wL2R8HI5Oq6BvO3FfarYs=;uid=609887;unm=felipe@wikicode.com.b
var lastFind="";
function StartBusca() {    
    //alert(xtoken);    
    var user ={
        versionInfo:
        {moduleVersion:"KClf+PqAhZp2NPaFNjMdMw",apiVersion:"JA1B6YqwehKMvrB7EubHww"},
        viewName:"MainFlow.Agendamentos",inputParameters:{CidadaoId:"369363"}};
        document.getElementById('labelstart').innerHTM=('sending..');

    $.ajax({
        url: '../MTeste/screenservices/MTeste/ActionEnable_Agendar',
        type: 'post',
        dataType: 'json',
        headers: {  "x-csrftoken": xtoken },
        contentType: 'application/json; charset=UTF-8',
        success: function (data) {
            var d = new Date();
            $('#labelstart').html("<p>Pode agendar? " + data.data.EnableAgendar +" ("+ d.toLocaleTimeString() +") ["+ lastFind +"] </p>");
            HasVaga();                      
        },
        error: function (request, status, error) {
            alert(request.responseText);
        },
        data: JSON.stringify(user)
    });
}
var tokenTimer;

function startTimeLoop()
{
    StartBusca();
    tokenTimer = setInterval( StartBusca, 9000);
}

 function HasVaga() {        
        var user = {
            versionInfo:{
                    moduleVersion:"KClf+PqAhZp2NPaFNjMdMw",
                    apiVersion:"XAkysAbiEoXr2hJhK4MkiQ"
                },
                viewName:"MainFlow.Agendamentos",
                inputParameters:{}
            }         
        $.ajax({
            url: '../MTeste/screenservices/MTeste/MainFlow/Agendamentos/ActionPossuiVagas',
            type: 'post',
            dataType: 'json',
            headers: {  "x-csrftoken": xtoken },
            contentType: 'application/json; charset=UTF-8',
            success: function (data) {
                //console.log(data);                
                var d = new Date();
                
                if (data.data.Result==true)
                {
                    lastFind='<h1>LOCALIZADO EM ' + d.toLocaleTimeString() +'</H1>';
                    playSound();
                    //$('#labelstart').append('<h1>LOCALIZADO EM ' + d.toLocaleTimeString() +'</H1>');
                    $('#dvResult').append('<span style="background-color: #f7efa6;color: #6a6641;">'+ d.toLocaleTimeString() +' :: Disponível: ' + data.data.Result +'</span><br>');
                }
                else
                {
                    $('#dvResult').append("<span><strike>"+ d.toLocaleTimeString() +" :: Disponível: " + data.data.Result +"</strike></span><br>");
                }
                $("#painelResult").animate({ scrollTop: $('#painelResult').prop("scrollHeight")}, 1000);
            },
            error: function (request, status, error) {
                alert(request.responseText);
            },
            data: JSON.stringify(user)
        });
    }
    function getCook(cookiename) 
    {
    // Get name followed by anything except a semicolon
    var cookiestring=RegExp(cookiename+"=[^;]+").exec(document.cookie);
    // Return everything after the equal sign, or an empty string if the cookie name not found
    return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
    }
