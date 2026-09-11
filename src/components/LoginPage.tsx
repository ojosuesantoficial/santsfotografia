import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CustomerOrder } from '../types';
import { formatBRL } from '../utils/format';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowLeft,
  Crown,
  Download,
  ShoppingBag,
  LogOut,
  ImageIcon,
  RefreshCw,
  ExternalLink,
  Package,
  AlertCircle,
  ArrowRight,
  User,
} from 'lucide-react';

interface LoginPageProps {
  onNavigateHome: () => void;
  onNavigateToCatalog: () => void;
  onNavigateToAdmin?: () => void;
  onShowToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateHome,
  onNavigateToCatalog,
  onNavigateToAdmin,
  onShowToast,
}) => {
  const { user, loginWithGoogleReal, logout, isLoadingAuth } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [userOrders, setUserOrders] = useState<CustomerOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Load user orders whenever user state changes
  useEffect(() => {
    if (user && user.email) {
      setIsLoadingOrders(true);
      fetch(`/api/orders?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.orders)) {
            setUserOrders(data.orders);
          }
        })
        .catch((err) => console.error('Error loading orders:', err))
        .finally(() => setIsLoadingOrders(false));
    }
  }, [user]);

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const loggedUser = await loginWithGoogleReal();
      if (loggedUser.isAdmin || loggedUser.email === 'jomamilionarios@gmail.com') {
        onShowToast(`Bem-vindo, ${loggedUser.name}! Redirecionando para o Painel Admin.`, 'success');
        if (onNavigateToAdmin) {
          onNavigateToAdmin();
        }
      } else {
        onShowToast(`Login com Google realizado! Olá, ${loggedUser.name}.`, 'success');
      }
    } catch (err: any) {
      console.warn('Google Auth Error:', err);
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'momentoscomfotosia.vercel.app';
      if (err.code === 'auth/unauthorized-domain' || (err.message && err.message.includes('unauthorized-domain'))) {
        setAuthError(
          `O domínio "${currentHost}" precisa ser autorizado no Firebase Console. Para liberar: acesse o Firebase Console > Authentication > Settings (Configurações) > Authorized domains (Domínios autorizados) e adicione "${currentHost}".`
        );
      } else if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('A janela de login do Google foi fechada antes de selecionar uma conta.');
      } else if (err.code === 'auth/popup-blocked') {
        setAuthError('O navegador bloqueou a janela pop-up do Google. Por favor, permita pop-ups para este site.');
      } else {
        setAuthError(err.message || 'Falha ao autenticar com o Google. Tente novamente.');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserOrders([]);
    onShowToast('Você saiu da sua conta com segurança.', 'info');
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[#A6825B] mx-auto" />
          <p className="text-xs font-bold text-[#666666] uppercase tracking-wider">
            Sincronizando Sessão Google...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E8E6E2]">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#666666] hover:text-[#111111] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar à Loja</span>
          </button>

          <button
            onClick={onNavigateToCatalog}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A6825B] hover:text-[#94724C] transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Ver Catálogo de Ensaios</span>
          </button>
        </div>

        {/* Not Logged In Screen */}
        {!user ? (
          <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-[#E8E6E2] overflow-hidden">
            {/* Header Banner */}
            <div className="bg-[#111111] text-white p-8 relative">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Entrar com Google Gmail
              </h1>
              <p className="text-xs sm:text-sm text-[#A0A0A0] mt-2 leading-relaxed">
                Acesse seus ensaios fotográficos gerados por inteligência artificial com persistência de sessão e acompanhamento em tempo real.
              </p>
            </div>

            {/* Login Action Body */}
            <div className="p-7 space-y-5">
              {authError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-800 animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed font-medium">
                    {authError}
                  </div>
                </div>
              )}

              <button
                type="button"
                id="google-login-direct-btn"
                disabled={isAuthenticating}
                onClick={handleGoogleLogin}
                className="w-full py-4 px-6 rounded-2xl bg-[#1A73E8] hover:bg-[#1557B0] active:scale-[0.99] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-between cursor-pointer disabled:opacity-60"
              >
                <div className="flex items-center gap-3">
                  {isAuthenticating ? (
                    <RefreshCw className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-xs flex-shrink-0">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        />
                      </svg>
                    </div>
                  )}
                  <span className="font-semibold tracking-wide">
                    {isAuthenticating ? 'Conectando ao Google...' : 'Entrar com Google Gmail'}
                  </span>
                </div>

                {!isAuthenticating && <ArrowRight className="w-5 h-5 text-white/90" />}
              </button>

              <div className="p-4 bg-[#FAF9F7] rounded-2xl border border-[#E8E6E2] space-y-1.5 text-xs text-[#666666]">
                <div className="flex items-center gap-2 font-bold text-[#111111]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Sessão Persistente & Realtime</span>
                </div>
                <p className="leading-relaxed text-[11px]">
                  Sua conta permanece logada de forma segura entre recarregamentos e acessos com verificação direta no Google Cloud.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Full Page Logged-In User Dashboard */
          <div className="space-y-6 animate-fade-in">
            {/* User Profile Bar */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E6E2] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl object-cover border border-[#D5D2CB] shadow-sm flex-shrink-0"
                  />
                ) : (
                  <div
                    className={`w-14 h-14 rounded-2xl font-bold flex items-center justify-center text-xl flex-shrink-0 text-white shadow-sm ${
                      user.isAdmin ? 'bg-amber-600' : 'bg-[#A6825B]'
                    }`}
                  >
                    {user.isAdmin ? <Crown className="w-7 h-7" /> : user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h2 className="font-display text-xl font-bold text-[#111111] truncate">{user.name}</h2>
                    {user.isAdmin ? (
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Crown className="w-3.5 h-3.5 text-amber-600" />
                        Admin
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                        Usuário
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#666666] truncate mt-1 flex items-center gap-1.5">
                    <span>{user.email}</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-semibold">Conta Google Autenticada</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {user.isAdmin && onNavigateToAdmin && (
                  <button
                    onClick={onNavigateToAdmin}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Painel Admin</span>
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-[#FAF9F7] hover:bg-[#F0EFEA] border border-[#E8E6E2] text-[#666666] hover:text-[#111111] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair</span>
                </button>
              </div>
            </div>

            {/* Admin Overview Notice */}
            {user.isAdmin && (
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold">Painel de Super Administrador</h3>
                    <p className="text-xs text-amber-100">
                      Você está conectado como o Administrador principal da Momentos Fotos IA.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                    <span className="text-[11px] text-amber-200 uppercase font-bold tracking-wider">Gestão de Pix</span>
                    <p className="text-sm font-bold mt-0.5">AbacatePay Integrado</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                    <span className="text-[11px] text-amber-200 uppercase font-bold tracking-wider">Entrega IA</span>
                    <p className="text-sm font-bold mt-0.5">Google Drive + Notificação</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                    <span className="text-[11px] text-amber-200 uppercase font-bold tracking-wider">Banco de Dados</span>
                    <p className="text-sm font-bold mt-0.5">Sincronização em Tempo Real</p>
                  </div>
                </div>

                {onNavigateToAdmin && (
                  <button
                    onClick={onNavigateToAdmin}
                    className="w-full sm:w-auto bg-white hover:bg-amber-50 text-amber-900 font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Ir para o Gerenciador de Pedidos & Fotos</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

              {/* Orders & IA Deliveries Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E6E2] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E6E2] pb-5">
                <div>
                  <h3 className="font-display text-xl font-bold text-[#111111] flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#A6825B]" />
                    <span>Meus Pedidos & Ensaios com IA</span>
                  </h3>
                  <p className="text-xs text-[#666666] mt-1">
                    Acompanhe a produção das suas fotos em ultra-definição e faça o download dos ensaios entregues.
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-[#FAF9F7] rounded-full border border-[#E8E6E2] text-[#666666] self-start sm:self-auto">
                  {userOrders.length} {userOrders.length === 1 ? 'ensaio contratado' : 'ensaios contratados'}
                </span>
              </div>

              {isLoadingOrders ? (
                <div className="py-12 text-center space-y-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#A6825B] mx-auto" />
                  <p className="text-xs text-[#888888]">Carregando seus pedidos e fotos...</p>
                </div>
              ) : userOrders.length === 0 ? (
                <div className="py-12 text-center max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#FAF9F7] border border-[#E8E6E2] flex items-center justify-center mx-auto text-[#A6825B]">
                    <ImageIcon className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-[#111111]">Nenhum pedido encontrado</h4>
                    <p className="text-xs text-[#666666] leading-relaxed">
                      Você ainda não realizou nenhum pedido associado ao e-mail <span className="font-bold">{user.email}</span>. Escolha um dos nossos álbuns e gere suas fotos!
                    </p>
                  </div>
                  <button
                    onClick={onNavigateToCatalog}
                    className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#A6825B] text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-2xl transition-all cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Ver Catálogo de Ensaios</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((order) => {
                    const isPaid = order.paymentStatus === 'PAID';
                    const isDelivered = order.aiDeliveryStatus === 'delivered' && order.aiDeliveryLink;

                    return (
                      <div
                        key={order.id}
                        className="p-5 sm:p-6 bg-[#FAF9F7] rounded-2xl border border-[#E8E6E2] space-y-4 transition-all hover:border-[#D5D2CB]"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E6E2] pb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-[#111111]">{order.code}</span>
                              <span className="text-xs text-[#888888]">·</span>
                              <span className="text-xs text-[#666666]">
                                {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                            <p className="text-xs text-[#888888] mt-0.5">
                              {order.items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ')}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="text-xs text-[#888888] block">Total</span>
                              <span className="text-sm font-bold text-[#111111]">
                                {formatBRL(order.total)}
                              </span>
                            </div>

                            {/* Status Badge */}
                            {isPaid ? (
                              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Pago via Pix</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Aguardando Pix</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Delivery Info & Link */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                          <div className="flex items-center gap-2 text-xs">
                            {isDelivered ? (
                              <span className="flex items-center gap-1.5 text-blue-700 font-bold">
                                <Sparkles className="w-4 h-4 text-blue-600" />
                                Ensaio Fotográfico Pronto para Download!
                              </span>
                            ) : isPaid ? (
                              <span className="flex items-center gap-1.5 text-[#666666]">
                                <Clock className="w-4 h-4 text-amber-500" />
                                Nossos servidores estão renderizando suas fotos com IA...
                              </span>
                            ) : (
                              <span className="text-[#888888]">
                                Efetue o pagamento Pix para iniciar o processamento das fotos.
                              </span>
                            )}
                          </div>

                          {isDelivered && order.aiDeliveryLink && (
                            <a
                              href={order.aiDeliveryLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl shadow-sm transition-all"
                            >
                              <Download className="w-4 h-4" />
                              <span>Baixar Fotos (Google Drive)</span>
                              <ExternalLink className="w-3 h-3 opacity-70" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
