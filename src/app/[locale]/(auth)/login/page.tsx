import LoginForm from '@/components/auth/login-form';


export default function LoginPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', padding: '0px' }}>
      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', border: '1px solid #f3f4f6', padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: 0 }}>Sign in to <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: 'center',
              color: '#222831',
              fontWeight: 800,
            }}
          >
            <img src="" alt="" />
            EnteFam
          </span>
          </h2>
          <p style={{ fontSize: '14px', color: '#4b5563', margin: 0 }}>Enter your credentials to access your dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
