import QRCode from "qrcode";

export async function qrSvg(url: string) {
  return QRCode.toString(url, {
    type: "svg",
    margin: 1,
    color: {
      dark: "#16120e",
      light: "#f7f3ec",
    },
    errorCorrectionLevel: "M",
  });
}

export async function qrPng(url: string) {
  return QRCode.toBuffer(url, {
    type: "png",
    width: 720,
    margin: 2,
    color: {
      dark: "#16120e",
      light: "#ffffff",
    },
    errorCorrectionLevel: "M",
  });
}
