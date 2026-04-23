import LoginForm from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to FamilyOS</h2>
          <p className="mt-2 text-sm text-gray-600">Enter your credentials to access your dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
