import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        {/* OngleipParkDahyeon 폰트 미리 로드 */}
        <link
          rel="preload"
          as="font"
          href="https://cdn.jsdelivr.net/gh/projectnoonnu/2411-3@1.0/Ownglyph_ParkDaHyun.woff2"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Pretendard 폰트 미리 로드 */}
        <link
          rel="preload"
          as="font"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-regular.woff2"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
