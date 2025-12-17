import React from 'react';
import Accordion from '../components/Accordion';

const GuidePage: React.FC = () => {
  return (
    <article>
      <h2>Image Enhance Manager 使用説明</h2>

      <section>
        <h3>システム紹介</h3>
        <p>Image Enhance Manager は、低解像度の画像やスクリーンショットをアップロードし、鮮明度を向上させるための管理システムです。変換された画像は保存され、後で参照、ダウンロード、および管理することができます。</p>
      </section>

      <section>
        <h3>変換フロー</h3>
        <p>以下のステップで画像を変換できます。</p>
        <ol>
          <li>「変換ページ」に移動します。</li>
          <li>画像をアップロードします。</li>
          <li>「変換する」ボタンをクリックします。</li>
          <li>変換が完了すると、元の画像と変換後の画像が表示されます。</li>
          <li>変換履歴は「管理ページ」で確認できます。</li>
        </ol>
      </section>

      <section>
        <h3>よくある質問</h3>
        <Accordion title="Q: アップロードできるファイル形式は何ですか？">
          <p>A: 主にPNG、JPEGなどの一般的な画像形式をサポートしています。</p>
        </Accordion>
        <Accordion title="Q: 変換にはどのくらい時間がかかりますか？">
          <p>A: 画像のサイズや現在のサーバー負荷によりますが、通常数秒から数十秒で完了します。（モックでは1.5秒かかります。）</p>
        </Accordion>
        <Accordion title="Q: 変換に失敗した場合はどうなりますか？">
          <p>A: 失敗した画像は履歴に「failed」として表示されます。再度変換をお試しいただくか、サポートにお問い合わせください。</p>
        </Accordion>
      </section>
    </article>
  );
};

export default GuidePage;

