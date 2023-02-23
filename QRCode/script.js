function gerarQRCode() {
    var texto = document.getElementById("text").value;
    if (texto == "") {
      alert("Digite um texto para gerar o QR Code");
      return;
    }
    var qr = new QRCode(document.getElementById("qrcode"), {
      text: texto,
      width: 256,
      height: 256,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
    //document.getElementById("qrcode").src = qr.toDataURL("image/png");
  }