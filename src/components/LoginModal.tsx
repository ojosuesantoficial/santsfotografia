import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CustomerOrder } from '../types';
import { formatBRL } from '../utils/format';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Crown,
  Download,
  LogOut,
  ImageIcon,
  AlertCircle,
  RefreshCw,
  User,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (text: string, type?: 'success' | 'info' | 'error') => void;
  onNavigateToCatalog?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  onNavigateToCatalog,
}) => {
  const { user, loginWithGoogleReal, logout, setIsAdminPanelOpen } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [userOrders, setUserOrders] = useState<CustomerOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Fetch orders when a regular user is logged in
  useEffect(() => {
    if (isOpen && user && !user.isAdmin && user.email) {
      setIsLoadingOrders(true);
      fetch(`/api/orders?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.orders)) {
            setUserOrders(data.orders);
          }
        })
        .catch((e) => console.error('Error fetching user orders:', e))
        .finally(() => setIsLoadingOrders(false));
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const loggedUser = await loginWithGoogleReal();
      if (loggedUser.isAdmin || loggedUser.email === 'jomamilionarios@gmail.com') {
        onShowToast(`Bem-vindo, ${loggedUser.name}! Painel Admin liberado.`, 'success');
        onClose();
        setIsAdminPanelOpen(true);
      } else {
        onShowToast(`Login realizado com sucesso! Olá, ${loggedUser.name}.`, 'success');
      }
    } catch (err: any) {
      console.warn('Google Auth notice:', err);
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'momentoscomfotosia.vercel.app';
      if (err.code === 'auth/unauthorized-domain' || (err.message && err.message.includes('unauthorized-domain'))) {
        setAuthError(
          `O domínio "${currentHost}" precisa ser autorizado no Firebase Console. Para liberar: acesse o Firebase Console > Authentication > Settings (Configurações) > Authorized domains (Domínios autorizados) e adicione "${currentHost}".`
        );
      } else if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('A janela de login do Google foi fechada antes de selecionar sua conta.');
      } else if (err.code === 'auth/popup-blocked') {
        setAuthError('O seu navegador bloqueou a janela pop-up do Google. Por favor, permita pop-ups para este site.');
      } else {
        setAuthError(err.message || 'Falha ao autenticar com o Google. Tente novamente.');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#E8E6E2] overflow-hidden relative my-auto">
        {/* Header */}
        <div className="bg-[#221F1B] text-white p-7 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <h3 className="font-display text-2xl font-bold text-white tracking-tight">
            {user
              ? user.isAdmin
                ? 'Painel do Administrador'
                : 'Painel do Cliente'
              : 'Entrar com Google Gmail'}
          </h3>
          <p className="text-xs text-[#D5CEBF] mt-2 leading-relaxed">
            {user
              ? user.isAdmin
                ? 'Gerenciamento oficial de pedidos, Pix e fotos de clientes.'
                : 'Acompanhe o status do seu ensaio fotográfico e baixe suas fotos geradas por IA.'
              : 'Acesse seus ensaios fotográficos gerados por inteligência artificial com persistência de sessão e acompanhamento em tempo real.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {user ? (
            /* User is Logged In */
            <div className="space-y-4">
              {/* Profile Card */}
              <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D7] rounded-2xl flex items-center gap-3.5">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border border-[#D5D2CB] shadow-xs flex-shrink-0"
                  />
                ) : (
                  <div
                    className={`w-12 h-12 rounded-full font-bold flex items-center justify-center text-lg flex-shrink-0 text-white shadow-sm ${
                      user.isAdmin ? 'bg-[#A6825B]' : 'bg-[#C2A37E]'
                    }`}
                  >
                    {user.isAdmin ? (
                      <Crown className="w-6 h-6" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#221F1B] truncate">{user.name}</span>
                    {user.isAdmin ? (
                      <span className="bg-[#F5EDE1] text-[#5C452C] border border-[#DED7CA] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Crown className="w-3 h-3 text-[#A6825B]" />
                        Admin
                      </span>
                    ) : (
                      <span className="bg-[#F5EDE1] text-[#5C452C] border border-[#DED7CA] text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Usuário
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#666057] truncate">{user.email}</p>
                </div>
              </div>

              {/* Admin Quick Action */}
              {user.isAdmin ? (
                <div className="p-4 bg-[#FAF6F0] border border-[#E8E2D7] rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-[#5C452C] font-bold text-xs uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-[#A6825B]" />
                    <span>Modo Administrador Ativo</span>
                  </div>
                  <p className="text-xs text-[#666057] leading-relaxed">
                    Você tem acesso total para gerenciar pedidos de clientes, links de entrega de fotos no Google Drive e sincronização Pix AbacatePay.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setIsAdminPanelOpen(true);
                    }}
                    className="w-full bg-[#A6825B] hover:bg-[#94724C] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Abrir Painel Administrativo</span>
                  </button>
                </div>
              ) : (
                /* Customer Orders & Deliveries View */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#221F1B] uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#A6825B]" />
                      <span>Meus Ensaios e Fotos Geradas</span>
                    </h4>
                    <span className="text-[11px] text-[#888888]">
                      {userOrders.length} {userOrders.length === 1 ? 'ensaio' : 'ensaios'}
                    </span>
                  </div>

                  {isLoadingOrders ? (
                    <div className="p-6 text-center text-xs text-[#888888] bg-[#FAF8F5] rounded-xl border border-[#E8E2D7]">
                      Carregando seus pedidos...
                    </div>
                  ) : userOrders.length === 0 ? (
                    <div className="p-5 text-center bg-[#FAF8F5] border border-[#E8E2D7] rounded-2xl space-y-2">
                      <p className="text-xs text-[#666057]">
                        Nenhum ensaio associado a este e-mail ainda.
                      </p>
                      <p className="text-[11px] text-[#999999]">
                        Ao comprar qualquer álbum ou fazer upload de fotos, seus pedidos e downloads aparecerão aqui.
                      </p>
                    </div>
                  ) : (
                    <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
                      {userOrders.map((order) => {
                        const isPaid = order.paymentStatus === 'PAID';
                        const isDelivered = order.aiDeliveryStatus === 'delivered' && order.aiDeliveryLink;

                        return (
                          <div
                            key={order.id}
                            className="p-3.5 bg-[#FAF8F5] border border-[#E8E2D7] rounded-xl space-y-2"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-[#221F1B]">{order.code}</span>
                              <span className="text-[#888888]">{formatBRL(order.total)}</span>
                            </div>

                            <div className="flex items-center gap-2 text-[11px]">
                              {isPaid ? (
                                <span className="inline-flex items-center gap-1 text-[#5C452C] bg-[#F5EDE1] px-2 py-0.5 rounded-full font-semibold border border-[#DED7CA]">
                                  <CheckCircle2 className="w-3 h-3 text-[#A6825B]" />
                                  Pago
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[#8C6D48] bg-[#FAF6F0] px-2 py-0.5 rounded-full font-semibold border border-[#E8E2D7]">
                                  <Clock className="w-3 h-3 text-[#A6825B]" />
                                  Aguardando Pix
                                </span>
                              )}

                              {isDelivered ? (
                                <span className="inline-flex items-center gap-1 text-[#5C452C] bg-[#F5EDE1] px-2 py-0.5 rounded-full font-semibold border border-[#DED7CA]">
                                  <Sparkles className="w-3 h-3 text-[#A6825B]" />
                                  Fotos Prontas!
                                </span>
                              ) : (
                                <span className="text-[#888888]">
                                  {isPaid ? 'Gerando fotos com IA...' : 'Aguardando confirmação'}
                                </span>
                              )}
                            </div>

                            {/* Download Button if delivered */}
                            {isDelivered && order.aiDeliveryLink && (
                              <a
                                href={order.aiDeliveryLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 w-full bg-[#A6825B] hover:bg-[#94724C] text-white font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Baixar Fotos do Ensaio (Google Drive)</span>
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {onNavigateToCatalog && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateToCatalog();
                      }}
                      className="w-full bg-[#221F1B] hover:bg-[#A6825B] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Explorar Catálogo / Gerar Fotos</span>
                    </button>
                  )}
                </div>
              )}

              {/* Logout Button */}
              <button
                type="button"
                onClick={() => {
                  logout();
                  setUserOrders([]);
                  onShowToast('Você saiu da sua conta.', 'info');
                }}
                className="w-full bg-[#F5F2EB] hover:bg-[#E8E2D7] text-[#666057] font-semibold text-xs py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair da Conta (Logout)</span>
              </button>
            </div>
          ) : (
            /* User is NOT Logged In */
            <div className="space-y-4 py-2">
              {authError && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-800 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed font-medium">
                    {authError}
                  </div>
                </div>
              )}

              <button
                type="button"
                id="modal-google-login-btn"
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
          )}
        </div>
      </div>
    </div>
  );
};
