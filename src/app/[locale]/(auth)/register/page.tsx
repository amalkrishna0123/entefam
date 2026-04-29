import RegisterForm from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', border: '1px solid #f3f4f6', padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: 0 }}>Create an Account</h2>
          <p style={{ fontSize: '14px', color: '#4b5563', margin: 0 }}>Start managing your family data today</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
