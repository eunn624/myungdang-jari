import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Onboarding2() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/onboarding-1');
  }, [router]);

  return null;
}
