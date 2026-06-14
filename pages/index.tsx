import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 온보딩으로 자동 리다이렉트
    router.push('/onboarding-1');
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#f8f6f2',
      fontSize: '18px',
      color: '#8c7a6e'
    }}>
      로딩 중...
    </div>
  );
}
