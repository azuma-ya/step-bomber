import Router from "next/router";
import { useEffect } from "react";
import { useBeforeUnload } from "react-use";

export const useLeavePage = (
  showAlert = true,
  message = "入力した内容がキャンセルされますがよろしいでしょうか？",
) => {
  useBeforeUnload(showAlert, message);

  useEffect(() => {
    const handler = () => {
      if (showAlert && !window.confirm(message)) {
        throw "キャンセル";
      }
    };

    Router.events.on("routeChangeStart", handler);

    return () => {
      Router.events.off("routeChangeStart", handler);
    };
  }, [showAlert, message]);
};
