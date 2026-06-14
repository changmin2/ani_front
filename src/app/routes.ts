import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { MainPage } from "./components/MainPage";
import { CustomerNoticePage } from "./components/CustomerNoticePage";
import { MarketingContentPage } from "./components/MarketingContentPage";
import { ProductManualPage } from "./components/ProductManualPage";
import { TranslationResultPage } from "./components/TranslationResultPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: MainPage },
      { path: "customer-notice", Component: CustomerNoticePage },
      { path: "marketing-content", Component: MarketingContentPage },
      { path: "product-manual", Component: ProductManualPage },
      { path: "translation-result", Component: TranslationResultPage },
    ],
  },
]);
