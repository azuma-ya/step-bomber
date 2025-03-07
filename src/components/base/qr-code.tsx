"use client";

import { QRCodeCanvas } from "qrcode.react";

interface Props {
  url: string;
}

const QRCode = (props: Props) => {
  return (
    <QRCodeCanvas
      value={props.url}
      size={128}
      bgColor={"#FFF"}
      fgColor={"#000"}
      level={"L"}
      includeMargin={true}
    />
  );
};

export default QRCode;
