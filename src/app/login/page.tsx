import { Metadata } from 'next';
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: 'Login | Wesley Reis Imóveis',
  description: 'Área do corretor - faça login para gerenciar seus imóveis.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Área do Corretor</h1>
          <p className="text-muted-foreground mt-2">
            Faça login para gerenciar seus imóveis
          </p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}