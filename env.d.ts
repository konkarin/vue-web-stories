/// <reference types="vite/client" />

// .tsファイルの中で.vueの型定義を補完します
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
