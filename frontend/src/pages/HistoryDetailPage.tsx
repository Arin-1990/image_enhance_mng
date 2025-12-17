import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchImageById, type ImageHistory } from '../utils/mockApi';

const HistoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [image, setImage] = useState<ImageHistory | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getImage = async () => {
      try {
        setLoading(true);
        const data = await fetchImageById(id!); // idは常に存在すると仮定
        if (data) {
          setImage(data);
        } else {
          setError('画像が見つかりません。');
        }
      } catch (err) {
        setError('画像の取得中にエラーが発生しました。');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getImage();
  }, [id]);

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;
  if (!image) return <div>画像が見つかりません。</div>;

  const handleDownload = (url: string, filename: string) => {
    // In a real application, you might fetch the blob and then create a URL.
    // For mock, we'll just open the URL.
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2>履歴詳細ページ - {image.original_name}</h2>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div>
          <h3>元の画像</h3>
          <img src={image.original_url} alt={image.original_name} style={{ maxWidth: '400px' }} />
          <button onClick={() => handleDownload(image.original_url, `original_${image.original_name}`)} style={{ display: 'block', marginTop: '10px' }}>
            元の画像をダウンロード
          </button>
        </div>
        {image.enhanced_url && (
          <div>
            <h3>変換後の画像</h3>
            <img src={image.enhanced_url} alt={`Enhanced ${image.original_name}`} style={{ maxWidth: '400px' }} />
            <button onClick={() => handleDownload(image.enhanced_url, `enhanced_${image.original_name}`)} style={{ display: 'block', marginTop: '10px' }}>
              変換後の画像をダウンロード
            </button>
          </div>
        )}
      </div>
      <p><strong>ステータス:</strong> {image.status}</p>
      <p><strong>作成日時:</strong> {new Date(image.created_at).toLocaleString()}</p>
      <p><strong>更新日時:</strong> {new Date(image.updated_at).toLocaleString()}</p>
      {/* 変換パラメータはmockApiにはないので省略 */}
    </div>
  );
};

export default HistoryDetailPage;

