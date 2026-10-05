import React, { useState } from 'react';
import { ASSETS } from '../../data/mockData';

interface LoginViewProps {
  onLoginSuccess: (role: 'coach' | 'aluno', name: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('coach.carlos@fitpulse.com.br');
  const [password, setPassword] = useState('fitpulse2026');
  const [role, setRole] = useState<'coach' | 'aluno'>('coach');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      if (email && password) {
        onLoginSuccess(role, role === 'coach' ? 'Carlos Rossi' : 'Mariana Silva');
      } else {
        setErrorMessage('Por favor, preencha todos os campos.');
      }
    }, 800);
  };

  const handleQuickLogin = (quickRole: 'coach' | 'aluno') => {
    setRole(quickRole);
    if (quickRole === 'coach') {
      setEmail('coach.carlos@fitpulse.com.br');
    } else {
      setEmail('mariana.silva@fitpulse.com.br');
    }
    setPassword('fitpulse2026');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(quickRole, quickRole === 'coach' ? 'Carlos Rossi' : 'Mariana Silva');
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-[#141b2b] flex items-center justify-center p-4 font-sans selection:bg-[#7ffc97] selection:text-[#002109]">
      {/* Background Decorative Gradient Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#006b2c]/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#0058be]/20 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col gap-6 border border-[#e9edff]">
        {/* Logo & Brand Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-[#006b2c]/10 flex items-center justify-center p-3 shadow-inner">
            <img src={ASSETS.logo} alt="FitPulse Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#006b2c] bg-[#7ffc97]/30 px-2.5 py-1 rounded-full">
              FitPulse Pro Enterprise
            </span>
            <h1 className="text-2xl font-black text-[#141b2b] tracking-tight mt-1.5">
              Bem-vindo de volta
            </h1>
            <p className="text-xs text-[#6e7b6c] mt-0.5">
              Gestão de treinos de elite & inteligência esportiva
            </p>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#f1f3ff] rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setRole('coach');
              setEmail('coach.carlos@fitpulse.com.br');
            }}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              role === 'coach'
                ? 'bg-[#006b2c] text-white shadow-xs'
                : 'text-[#6e7b6c] hover:text-[#141b2b]'
            }`}
          >
            Personal Trainer / Coach
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('aluno');
              setEmail('mariana.silva@fitpulse.com.br');
            }}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              role === 'aluno'
                ? 'bg-[#006b2c] text-white shadow-xs'
                : 'text-[#6e7b6c] hover:text-[#141b2b]'
            }`}
          >
            Área do Aluno
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-[#fff0f0] border border-[#ffdad6] rounded-xl text-xs text-[#ba1a1a] font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#141b2b]">E-mail de Acesso</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-[#6e7b6c] material-symbols-outlined text-[18px]">
                mail
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@fitpulse.com.br"
                className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-[#f1f3ff] text-[#141b2b] text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006b2c]/20"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#141b2b]">Senha de Acesso</label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Instruções de recuperação enviadas para o e-mail cadastrado.');
                }}
                className="text-[11px] font-semibold text-[#006b2c] hover:underline"
              >
                Esqueceu a senha?
              </a>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-[#6e7b6c] material-symbols-outlined text-[18px]">
                lock
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-[#f1f3ff] text-[#141b2b] text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006b2c]/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#006b2c] hover:bg-[#00873a] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.98] cursor-pointer disabled:opacity-70 mt-1"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">login</span>
                <span>Entrar no Sistema</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-[#e9edff]"></div>
          <span className="flex-shrink mx-4 text-[11px] text-[#6e7b6c] font-medium">Acesso Rápido de Demonstração</span>
          <div className="flex-grow border-t border-[#e9edff]"></div>
        </div>

        {/* Quick Demo Login Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('coach')}
            className="h-10 px-3 bg-[#f1f3ff] hover:bg-[#e9edff] text-[#141b2b] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-[#006b2c]">sports</span>
            <span>Entrar como Coach</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('aluno')}
            className="h-10 px-3 bg-[#f1f3ff] hover:bg-[#e9edff] text-[#141b2b] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-[#0058be]">person</span>
            <span>Entrar como Aluna</span>
          </button>
        </div>

        {/* Footer info */}
        <p className="text-[10px] text-center text-[#6e7b6c]">
          FitPulse Pro • Hospedado em ambiente seguro com criptografia TLS.
        </p>
      </div>
    </div>
  );
};
