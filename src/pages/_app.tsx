import { AppProps } from 'next/app';
import { AuthProvider, useAuth } from '@/lib/auth';
import InviteGate from '@/components/InviteGate';
import '@/styles/globals.css';

function AppContent({ Component, pageProps }: AppProps) {
  const { authState } = useAuth();

  // 显示加载状态
  if (authState.loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载...</p>
        </div>
      </div>
    );
  }

  // 未认证用户显示邀请码验证界面
  if (!authState.isAuthenticated) {
    return <InviteGate />;
  }

  // 已认证用户显示正常内容
  return <Component {...pageProps} />;
}

export default function App(props: AppProps) {
  return (
    <AuthProvider>
      <AppContent {...props} />
    </AuthProvider>
  );
}