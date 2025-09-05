import Link from 'next/link';

export default function LoginNavigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/login">Login</Link>
        </li>
        <li>
          <Link href="/login/forgot-password">Forgot Password</Link>
        </li>
        <li>
          <Link href="/">Home</Link>
        </li>
      </ul>
    </nav>
  );
}