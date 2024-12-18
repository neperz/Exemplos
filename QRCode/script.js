function generateQRCode() {
  const container = document.getElementById('qrCodeContainer');
  container.innerHTML = ''; // Limpa o conteúdo anterior

  const hasMoldura = document.getElementById('moldura');
  console.log(hasMoldura.checked);
  const frameColor = document.getElementById('frameColor').value;
  const labelColor = document.getElementById('labelColor').value;
  const qrBackground = document.getElementById('qrBackground').value;
  const labelFont = document.getElementById('labelFont').value;

  const qrdatatext = document.getElementById('text').value;
  const qrlabeltext = document.getElementById('qrlabel').value;
  if (hasMoldura.checked)
  {
    generateQRCodeWithRoundedFrameSVG('qrCodeContainer', qrdatatext, qrlabeltext, {
        frameColor,
        labelColor,
        qrBackground,
        labelFont
    });
  }
  else
  {
    const qr = new QRCode(qrCodeContainer, {
      text: qrdatatext,
      width: 256,            // Largura do QR Code
      height: 256,           // Altura do QR Code
      colorDark: "#000000",  // Cor escura (linhas do QR Code)
      colorLight: "#ffffff", // Cor clara (fundo do QR Code)
      correctLevel: 2 // Nível de correção de erro
  });
  }
}

function generateQRCodeWithRoundedFrameSVG(elementId, text, label, options) {
  const { frameColor, labelColor, qrBackground, labelFont } = options;

  const qrCodeSize = 200;
  const padding = 10;
  const labelHeight = 40;
  const borderRadius = 15;

  QRCodeModern.toString(text, { type: "svg", margin: 0, width: qrCodeSize }, function (err, qrSVG) {
      if (err) throw err;

      const svgNS = "http://www.w3.org/2000/svg";
      const totalWidth = qrCodeSize + 2 * padding;
      const totalHeight = qrCodeSize + 2 * padding + labelHeight;

      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("width", totalWidth);
      svg.setAttribute("height", totalHeight);
      svg.setAttribute("viewBox", `0 0 ${totalWidth} ${totalHeight}`);

      const frame = document.createElementNS(svgNS, "rect");
      frame.setAttribute("x", 0);
      frame.setAttribute("y", 0);
      frame.setAttribute("width", totalWidth);
      frame.setAttribute("height", totalHeight);
      frame.setAttribute("rx", borderRadius);
      frame.setAttribute("ry", borderRadius);
      frame.setAttribute("fill", frameColor);
      svg.appendChild(frame);

      const qrBackgroundRect = document.createElementNS(svgNS, "rect");
      qrBackgroundRect.setAttribute("x", padding);
      qrBackgroundRect.setAttribute("y", padding);
      qrBackgroundRect.setAttribute("width", qrCodeSize);
      qrBackgroundRect.setAttribute("height", qrCodeSize);
      qrBackgroundRect.setAttribute("rx", borderRadius / 2);
      qrBackgroundRect.setAttribute("ry", borderRadius / 2);
      qrBackgroundRect.setAttribute("fill", qrBackground);
      svg.appendChild(qrBackgroundRect);

      const qrGroup = document.createElementNS(svgNS, "g");
      qrGroup.innerHTML = qrSVG;
      qrGroup.setAttribute("transform", `translate(${padding}, ${padding})`);
      svg.appendChild(qrGroup);

      const textLabel = document.createElementNS(svgNS, "text");
      textLabel.setAttribute("x", totalWidth / 2);
      textLabel.setAttribute("y", totalHeight - labelHeight / 3);
      textLabel.setAttribute("fill", labelColor);
      textLabel.setAttribute("font-size", "20");
      textLabel.setAttribute("font-weight", "bold");
      textLabel.setAttribute("font-family", labelFont);
      textLabel.setAttribute("text-anchor", "middle");
      textLabel.textContent = label;
      svg.appendChild(textLabel);

      const container = document.getElementById(elementId);
      container.appendChild(svg);

      // Adiciona link de download
      const downloadLink = document.createElement("a");
      downloadLink.href = "#";
      downloadLink.textContent = "Download como PNG";
      downloadLink.style.display = "block";
      downloadLink.style.marginTop = "10px";
      downloadLink.style.color = "#0000EE";
      downloadLink.style.textDecoration = "underline";
      downloadLink.onclick = () => downloadSVGAsPNG(svg, "qrcode.png");
      container.appendChild(downloadLink);
  });
}

function downloadSVGAsPNG(svgElement, fileName) {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = svgElement.getAttribute("width");
      canvas.height = svgElement.getAttribute("height");
      const ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0);

      const pngURL = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngURL;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      URL.revokeObjectURL(url);
  };
  img.src = url;
}