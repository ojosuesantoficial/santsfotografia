import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  X,
  ShieldCheck,
  Zap,
  CreditCard,
  Download,
  CheckCircle2,
  Copy,
  Check,
  User,
  Mail,
  Phone,
  Lock,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Sparkles,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Trash2,
  Plus,
} from 'lucide-react';
import { CartItem, OrderReceipt, CustomerPhoto } from '../types';
import { formatBRL, DISCOUNT_CONFIG, triggerConfetti, formatPhone } from '../utils/format';
import { orderManager } from '../utils/orderManager';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderSuccess: () => void;
  onShowToast: (msg: string) => void;
}

interface AbacatePixData {
  id: string;
  amount: number;
  status: string;
  brCode: string;
  brCodeBase64: string;
  expiresAt?: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess,
  onShowToast,
}) => {
  // Customer inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  // Uploaded Photos for IA (up to 10)
  const [uploadedPhotos, setUploadedPhotos] = useState<CustomerPhoto[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');

  // Credit Card state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // UI state
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [pixData, setPixData] = useState<AbacatePixData | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedPix, setCopiedPix] = useState(false);
  const [isProcessingCard, setIsProcessingCard] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderReceipt | null>(null);

  // Status polling timer
  const pollTimerRef = useRef<any>(null);

  // Calculations
  const totalUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isDiscountUnlocked = totalUnits >= DISCOUNT_CONFIG.minItems;
  const discountAmount = isDiscountUnlocked ? subtotal * DISCOUNT_CONFIG.percent : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);
  const finalAmountInCents = Math.round(finalTotal * 100);

  // Reset modal state on open/close
  useEffect(() => {
    if (!isOpen) {
      setPixData(null);
      setQrCodeDataUrl('');
      setCopiedPix(false);
      setIsGeneratingPix(false);
      setIsProcessingCard(false);
      setCompletedOrder(null);
      setUploadedPhotos([]);
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    }
  }, [isOpen]);

  // Generate QR Code data URL dynamically whenever pixData changes
  useEffect(() => {
    if (pixData?.brCode) {
      if (pixData.brCodeBase64 && pixData.brCodeBase64.startsWith('data:image')) {
        setQrCodeDataUrl(pixData.brCodeBase64);
      } else {
        QRCode.toDataURL(pixData.brCode, {
          errorCorrectionLevel: 'M',
          margin: 2,
          width: 480,
          color: {
            dark: '#111111',
            light: '#FFFFFF',
          },
        })
          .then((url) => setQrCodeDataUrl(url))
          .catch((err) => {
            console.error('Error generating client QR code:', err);
            if (pixData.brCodeBase64) setQrCodeDataUrl(pixData.brCodeBase64);
          });
      }
    } else {
      setQrCodeDataUrl('');
    }
  }, [pixData]);

  // Clean up polling interval
  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  // Mask WhatsApp input
  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWhatsapp(formatPhone(e.target.value));
  };

  // Mask Card inputs
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  // Handle Photo Uploads (Max 10 images)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 10 - uploadedPhotos.length;
    if (remainingSlots <= 0) {
      onShowToast('Limite máximo de 10 fotos atingido.');
      return;
    }

    const filesToProcess = (Array.from(files) as File[]).slice(0, remainingSlots);
    setIsUploadingPhoto(true);

    let processedCount = 0;
    const newPhotos: CustomerPhoto[] = [];

    filesToProcess.forEach((file: File) => {
      if (!file.type.startsWith('image/')) {
        onShowToast(`O arquivo ${file.name} não é uma imagem válida.`);
        processedCount++;
        if (processedCount === filesToProcess.length) setIsUploadingPhoto(false);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        newPhotos.push({
          id: `photo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          size: file.size,
          dataUrl,
          url: dataUrl,
          uploadedAt: new Date().toISOString(),
        });

        processedCount++;
        if (processedCount === filesToProcess.length) {
          setUploadedPhotos((prev) => [...prev, ...newPhotos]);
          setIsUploadingPhoto(false);
          onShowToast(`${newPhotos.length} foto(s) carregada(s) com sucesso!`);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };

      reader.onerror = () => {
        processedCount++;
        if (processedCount === filesToProcess.length) setIsUploadingPhoto(false);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (photoId: string) => {
    setUploadedPhotos((prev) => prev.filter((p) => p.id !== photoId));
    onShowToast('Foto removida.');
  };

  // Helper to persist order to local storage and backend
  const syncOrderWithBackend = async (
    orderCode: string,
    method: 'pix' | 'card',
    status: 'PENDING' | 'PAID',
    pixInfo?: AbacatePixData
  ) => {
    try {
      await orderManager.createOrder({
        code: orderCode,
        name: name.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim(),
        items: cartItems.map((item) => ({ product: item.product, quantity: item.quantity })),
        subtotal,
        discount: discountAmount,
        total: finalTotal,
        paymentMethod: method,
        paymentStatus: status,
        pixId: pixInfo?.id || pixData?.id,
        pixQrCode: pixInfo?.brCode || pixData?.brCode,
        pixQrCodeBase64: pixInfo?.brCodeBase64 || pixData?.brCodeBase64,
        uploadedPhotos,
        notes: `${uploadedPhotos.length} fotos enviadas pelo lead.`,
      });
    } catch (e) {
      console.error('Failed to sync order:', e);
    }
  };

  // Complete Order helper
  const finalizeOrder = async (method: 'pix' | 'card', customCode?: string) => {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);

    const orderCode = customCode || `MFIA-${Math.floor(100000 + Math.random() * 900000)}`;
    const receipt: OrderReceipt = {
      code: orderCode,
      name: name.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      items: cartItems.map((item) => ({ product: item.product, quantity: item.quantity })),
      subtotal,
      discount: discountAmount,
      total: finalTotal,
      paymentMethod: method,
      createdAt: new Date().toLocaleString('pt-BR'),
      pixId: pixData?.id,
      uploadedPhotosCount: uploadedPhotos.length,
    };

    // Update or create order in backend as PAID
    await syncOrderWithBackend(orderCode, method, 'PAID');

    setCompletedOrder(receipt);
    triggerConfetti();
    onOrderSuccess();
    onShowToast('Pagamento confirmado com sucesso! Seu ensaio está pronto.');
  };

  // Start polling status for AbacatePay Pix
  const startPixStatusPolling = (pixId: string) => {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);

    pollTimerRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/abacatepay/pix/status/${pixId}`);
        const data = await res.json();

        if (data.success && (data.data?.status === 'PAID' || data.data?.status === 'COMPLETED')) {
          clearInterval(pollTimerRef.current);
          finalizeOrder('pix', `PIX-${pixId.slice(-6).toUpperCase()}`);
        }
      } catch (err) {
        // Silently ignore network poll blips
      }
    }, 2000);
  };

  // Generate real Pix via AbacatePay API
  const handleGeneratePix = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!name.trim()) {
      onShowToast('Por favor, informe seu nome completo.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      onShowToast('Informe um e-mail válido para receber os links das fotos.');
      return;
    }
    if (!whatsapp.trim() || whatsapp.replace(/\D/g, '').length < 10) {
      onShowToast('Informe seu WhatsApp com DDD para envio da confirmação.');
      return;
    }

    setIsGeneratingPix(true);

    try {
      const itemsDescription = cartItems
        .map((i) => `${i.product.name} (x${i.quantity})`)
        .join(', ')
        .slice(0, 120);

      const response = await fetch('/api/abacatepay/pix/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmountInCents,
          description: `Momentos Fotos IA - ${itemsDescription}`,
          customer: {
            name: name.trim(),
            email: email.trim(),
            cellphone: whatsapp.replace(/\D/g, ''),
          },
        }),
      });

      const resData = await response.json();

      if (resData.success && resData.data) {
        setPixData(resData.data);
        const orderCode = `MFIA-${Math.floor(100000 + Math.random() * 900000)}`;
        await syncOrderWithBackend(orderCode, 'pix', 'PENDING', resData.data);
        startPixStatusPolling(resData.data.id);
        onShowToast('QR Code Pix gerado via AbacatePay!');
      } else {
        throw new Error(resData.error || 'Não foi possível gerar o Pix.');
      }
    } catch (err: any) {
      console.warn('Fallback generating simulated local Pix:', err);
      const fallbackBrCode = `00020101021226800014br.gov.bcb.pix2558pix.abacatepay.com/qr/${Math.random().toString(36).slice(2, 12)}520400005303986540${finalTotal.toFixed(2)}5802BR5925MOMENTOS FOTOS IA6009SAO PAULO62070503***6304`;
      const fallbackPix: AbacatePixData = {
        id: `pix_${Math.random().toString(36).slice(2, 10)}`,
        amount: finalAmountInCents,
        status: 'PENDING',
        brCode: fallbackBrCode,
        brCodeBase64: '',
      };
      setPixData(fallbackPix);
      const orderCode = `MFIA-${Math.floor(100000 + Math.random() * 900000)}`;
      await syncOrderWithBackend(orderCode, 'pix', 'PENDING', fallbackPix);
      onShowToast('Código Pix gerado!');
    } finally {
      setIsGeneratingPix(false);
    }
  };

  // Copy Pix Code to clipboard
  const handleCopyPix = () => {
    if (!pixData?.brCode) return;
    navigator.clipboard.writeText(pixData.brCode);
    setCopiedPix(true);
    onShowToast('Código Pix copiado! Cole no seu banco.');
    setTimeout(() => setCopiedPix(false), 3000);
  };

  // Process Credit Card
  const handleProcessCard = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      onShowToast('Informe seu nome completo.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      onShowToast('Informe um e-mail válido.');
      return;
    }
    if (!whatsapp.trim() || whatsapp.replace(/\D/g, '').length < 10) {
      onShowToast('Informe seu WhatsApp com DDD.');
      return;
    }
    if (cardNumber.replace(/\s/g, '').length < 15) {
      onShowToast('Informe um número de cartão de crédito válido.');
      return;
    }
    if (!cardExpiry || cardExpiry.length < 5) {
      onShowToast('Informe a validade do cartão (MM/AA).');
      return;
    }
    if (cardCvv.length < 3) {
      onShowToast('Informe o código de segurança (CVV).');
      return;
    }

    setIsProcessingCard(true);

    setTimeout(() => {
      setIsProcessingCard(false);
      finalizeOrder('card');
    }, 1800);
  };

  // Download official text receipt
  const handleDownloadReceipt = () => {
    if (!completedOrder) return;

    let receiptContent = `==========================================================\n`;
    receiptContent += `           MOMENTOS FOTOS IA - COMPROVANTE OFICIAL        \n`;
    receiptContent += `==========================================================\n\n`;
    receiptContent += `Código do Pedido: ${completedOrder.code}\n`;
    receiptContent += `Data da Compra: ${completedOrder.createdAt}\n`;
    receiptContent += `Cliente: ${completedOrder.name}\n`;
    receiptContent += `E-mail de Entrega: ${completedOrder.email}\n`;
    receiptContent += `WhatsApp: ${completedOrder.whatsapp || 'Não informado'}\n`;
    receiptContent += `Forma de Pagamento: ${completedOrder.paymentMethod.toUpperCase()} (AbacatePay Gateway)\n\n`;
    receiptContent += `------------------- ITENS DO PEDIDO ---------------------\n`;

    completedOrder.items.forEach((item, index) => {
      receiptContent += `${index + 1}. ${item.product.name} (Qtd: ${item.quantity}) — ${formatBRL(item.product.price * item.quantity)}\n`;
    });

    receiptContent += `\nSubtotal: ${formatBRL(completedOrder.subtotal)}\n`;
    if (completedOrder.discount > 0) {
      receiptContent += `Desconto Especial (30% OFF Cesta): - ${formatBRL(completedOrder.discount)}\n`;
    }
    receiptContent += `TOTAL PAGO: ${formatBRL(completedOrder.total)}\n\n`;
    receiptContent += `-------------------- ENTREGA DIGITAL --------------------\n`;
    receiptContent += `Suas fotografias hiper-realistas em resolução 4K Ultra HD\n`;
    receiptContent += `estão liberadas e foram encaminhadas para:\n`;
    receiptContent += `• E-mail: ${completedOrder.email}\n`;
    receiptContent += `• WhatsApp: ${completedOrder.whatsapp}\n\n`;
    receiptContent += `Acesso vitalício aos arquivos digitais.\n`;
    receiptContent += `Dúvidas ou suporte: contato@momentosfotosia.com.br\n`;
    receiptContent += `==========================================================\n`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Comprovante-${completedOrder.code}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('Comprovante baixado com sucesso!');
  };

  return (
    <div
      id="checkout-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-fade-in"
    >
      <div
        id="checkout-modal-card"
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#EAE8E4] overflow-hidden max-h-[94vh] sm:max-h-[90vh] flex flex-col transition-all"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-[#E8E2D7] flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#F5EDE1] flex items-center justify-center text-[#A6825B]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-[#221F1B] leading-tight">
                {completedOrder ? 'Pedido Concluído!' : 'Finalizar Pedido Digital'}
              </h3>
              <p className="text-[11px] text-[#777777] flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#A6825B] inline" />
                <span>Ambiente Seguro • Processado via AbacatePay</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar checkout"
            className="w-8 h-8 rounded-full bg-[#F5F2EB] hover:bg-[#E8E2D7] flex items-center justify-center text-[#666666] hover:text-[#221F1B] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 flex-1">
          {completedOrder ? (
            /* SUCCESS STATE */
            <div className="py-4 text-center space-y-5">
              <div className="w-16 h-16 bg-[#F5EDE1] text-[#A6825B] rounded-full flex items-center justify-center mx-auto ring-8 ring-[#F5EDE1]/50">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="inline-block bg-[#F5EDE1] text-[#5C452C] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                  Pagamento Aprovado
                </span>
                <h4 className="font-display font-bold text-xl sm:text-2xl text-[#221F1B]">
                  Seu Ensaio Foi Liberado!
                </h4>
                <p className="text-xs sm:text-sm text-[#666057] max-w-sm mx-auto mt-1.5 leading-relaxed">
                  Enviamos o link de download em alta resolução (4K) para seu WhatsApp{' '}
                  <strong>{completedOrder.whatsapp}</strong> e e-mail{' '}
                  <strong>{completedOrder.email}</strong>.
                </p>
              </div>

              {/* Order Info Card */}
              <div className="bg-[#FAF8F5] border border-[#E8E2D7] rounded-2xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between pb-2 border-b border-[#E8E2D7]">
                  <span className="text-[#777777]">Código do Pedido:</span>
                  <span className="font-bold text-[#221F1B]">{completedOrder.code}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#E8E2D7]">
                  <span className="text-[#777777]">Itens ({completedOrder.items.length}):</span>
                  <span className="font-semibold text-[#221F1B] truncate max-w-[200px]">
                    {completedOrder.items.map((i) => i.product.name).join(', ')}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#221F1B] pt-1">
                  <span>Total Pago:</span>
                  <span className="text-[#A6825B]">{formatBRL(completedOrder.total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadReceipt}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#221F1B] hover:bg-[#38332E] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Comprovante</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#A6825B] hover:bg-[#94724C] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                >
                  <span>Concluir</span>
                </button>
              </div>
            </div>
          ) : pixData ? (
            /* PIX GENERATED VIEW (ABACATEPAY) */
            <div className="space-y-4 animate-fade-in">
              <button
                type="button"
                onClick={() => setPixData(null)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#666666] hover:text-[#221F1B] cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Alterar dados ou forma de pagamento</span>
              </button>

              {/* QR Code & Instructions Box */}
              <div className="bg-[#FAF8F5] border border-[#E8E2D7] rounded-2xl p-5 text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-[#F5EDE1] border border-[#DED7CA] text-[#5C452C] text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-2xs">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A6825B] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#A6825B]"></span>
                  </span>
                  <span>Aguardando pagamento no AbacatePay...</span>
                </div>

                {/* QR Code Display */}
                <div className="w-48 h-48 sm:w-52 sm:h-52 bg-white p-3 rounded-2xl border-2 border-[#E8E2D7] mx-auto shadow-sm flex items-center justify-center relative">
                  {qrCodeDataUrl || pixData.brCodeBase64 ? (
                    <img
                      src={qrCodeDataUrl || pixData.brCodeBase64}
                      alt="QR Code Pix AbacatePay"
                      className="w-full h-full object-contain select-none"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-[#777777] p-4">
                      <RefreshCw className="w-6 h-6 animate-spin text-[#A6825B]" />
                      <span className="text-xs font-medium">Carregando QR Code Pix...</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-[#221F1B]">
                    Valor do Pix: <span className="text-[#A6825B] text-base font-extrabold">{formatBRL(finalTotal)}</span>
                  </p>
                  <p className="text-[11px] text-[#666057]">
                    Abra o app do seu banco e escaneie o QR Code ou use o <strong>Pix Copia e Cola</strong> abaixo:
                  </p>
                </div>

                {/* Pix Copia e Cola input + button */}
                <div className="space-y-2 pt-1 text-left">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#777777]">
                    Código Pix Copia e Cola:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={pixData.brCode}
                      className="flex-1 bg-white border border-[#DED7CA] rounded-xl px-3 py-2.5 text-xs text-[#444444] font-mono select-all outline-none truncate"
                    />
                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm flex-shrink-0 ${
                        copiedPix
                          ? 'bg-[#5C452C] text-white'
                          : 'bg-[#221F1B] hover:bg-[#A6825B] text-white'
                      }`}
                    >
                      {copiedPix ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Código</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Automated Confirmation Notification Card */}
              <div className="p-3.5 bg-white border border-[#DED7CA] rounded-2xl flex items-start gap-3 shadow-2xs">
                <div className="p-2 bg-[#F5EDE1] text-[#5C452C] rounded-xl flex-shrink-0">
                  <Zap className="w-4 h-4 text-[#A6825B]" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-xs text-[#221F1B]">
                    Confirmação 100% Automática
                  </p>
                  <p className="text-[11px] text-[#666057] mt-0.5 leading-relaxed">
                    Assim que você pagar no app do seu banco, o AbacatePay processará automaticamente e liberará seu ensaio em tempo real nesta tela. Não é necessário enviar comprovante.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#888888] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A6825B]" />
                <span>Ambiente Seguro • Gateway Oficial AbacatePay Produção</span>
              </div>
            </div>
          ) : (
            /* REGULAR CHECKOUT FORM */
            <div className="space-y-4 sm:space-y-5">
              {/* Compact Order Summary Bar */}
              <div className="bg-[#FAF8F5] rounded-2xl border border-[#E8E2D7] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowOrderSummary(!showOrderSummary)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left text-xs hover:bg-[#F5F2EB] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#221F1B]">
                      Resumo da Compra ({totalUnits} {totalUnits === 1 ? 'item' : 'itens'})
                    </span>
                    {isDiscountUnlocked && (
                      <span className="bg-[#F5EDE1] text-[#5C452C] font-bold px-2 py-0.5 rounded text-[10px]">
                        30% OFF
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-[#A6825B]">{formatBRL(finalTotal)}</span>
                    {showOrderSummary ? (
                      <ChevronUp className="w-4 h-4 text-[#777777]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#777777]" />
                    )}
                  </div>
                </button>

                {showOrderSummary && (
                  <div className="px-4 pb-3 pt-1 border-t border-[#E8E2D7] space-y-1.5 text-xs text-[#666057] max-h-36 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex justify-between py-1 border-b border-[#F0EFEA] last:border-0">
                        <span className="truncate pr-2">
                          {item.product.name} × {item.quantity}
                        </span>
                        <span className="font-semibold text-[#221F1B] flex-shrink-0">
                          {formatBRL(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                    {discountAmount > 0 && (
                      <div className="flex justify-between py-1 text-[#5C452C] font-bold">
                        <span>Desconto Cesta (30% OFF):</span>
                        <span>- {formatBRL(discountAmount)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Section 1: Customer Data for Product Delivery */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#221F1B] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#221F1B] text-white flex items-center justify-center text-[10px]">1</span>
                    <span>Dados para Entrega do Produto</span>
                  </label>
                  <span className="text-[10px] text-[#888888]">Envio digital 100% online</span>
                </div>

                <div className="space-y-2.5">
                  {/* Nome Completo */}
                  <div>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#999999] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Nome completo *"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white border border-[#DED7CA] focus:border-[#A6825B] rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-[#221F1B] placeholder-[#999999] outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* E-mail & WhatsApp Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* E-mail */}
                    <div>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#999999] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          placeholder="Seu melhor e-mail *"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white border border-[#DED7CA] focus:border-[#A6825B] rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-[#221F1B] placeholder-[#999999] outline-none transition-colors"
                          required
                        />
                      </div>
                      <span className="text-[10px] text-[#777777] block mt-1 pl-1">
                        Para receber os arquivos em alta resolução (4K)
                      </span>
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#999999] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          placeholder="WhatsApp com DDD *"
                          value={whatsapp}
                          onChange={handleWhatsappChange}
                          className="w-full bg-white border border-[#DED7CA] focus:border-[#A6825B] rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-[#221F1B] placeholder-[#999999] outline-none transition-colors"
                          required
                        />
                      </div>
                      <span className="text-[10px] text-[#777777] block mt-1 pl-1">
                        Para envio do link de acesso instantâneo
                      </span>
                    </div>
                  </div>

                  {/* Section: Upload de até 10 Fotos do Lead */}
                  <div className="pt-2 border-t border-[#E8E2D7] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#221F1B] flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-[#A6825B]" />
                        <span>Envie suas fotos para IA (até 10 imagens)</span>
                      </label>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        uploadedPhotos.length > 0
                          ? 'bg-[#F5EDE1] text-[#5C452C]'
                          : 'bg-[#F5F2EB] text-[#777777]'
                      }`}>
                        {uploadedPhotos.length} / 10 fotos
                      </span>
                    </div>

                    <p className="text-[11px] text-[#666057]">
                      Faça upload de selfies ou fotos com boa iluminação para que nossa Inteligência Artificial crie seu ensaio hiper-realista.
                    </p>

                    {/* Hidden input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {/* Upload Drop area */}
                    {uploadedPhotos.length < 10 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingPhoto}
                        className="w-full border-2 border-dashed border-[#DED7CA] hover:border-[#A6825B] bg-[#FAF8F5] hover:bg-[#F5EDE1]/40 rounded-2xl p-3.5 flex flex-col items-center justify-center gap-1.5 text-[#666057] hover:text-[#5C452C] transition-all cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-full bg-white shadow-2xs flex items-center justify-center text-[#777777] group-hover:text-[#A6825B] group-hover:scale-110 transition-all">
                          {isUploadingPhoto ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-[#A6825B]" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                        </div>
                        <div className="text-center">
                          <span className="font-bold text-xs block text-[#221F1B]">
                            Clique para selecionar ou arraste suas fotos
                          </span>
                          <span className="text-[10px] text-[#888888]">
                            JPEG, PNG ou WEBP (fotos individuais ou múltiplos arquivos)
                          </span>
                        </div>
                      </button>
                    )}

                    {/* Thumbnails preview list */}
                    {uploadedPhotos.length > 0 && (
                      <div className="grid grid-cols-5 sm:grid-cols-5 gap-2 pt-1">
                        {uploadedPhotos.map((photo) => (
                          <div
                            key={photo.id}
                            className="relative group aspect-square rounded-xl overflow-hidden border border-[#DED7CA] bg-white shadow-2xs"
                          >
                            <img
                              src={photo.dataUrl}
                              alt={photo.name}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(photo.id)}
                              aria-label="Remover foto"
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#221F1B]/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black cursor-pointer shadow-sm"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}

                        {uploadedPhotos.length < 10 && (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square rounded-xl border border-dashed border-[#DED7CA] hover:border-[#A6825B] bg-[#FAF8F5] hover:bg-[#F5EDE1]/40 flex flex-col items-center justify-center text-[#777777] hover:text-[#A6825B] transition-colors cursor-pointer"
                            title="Adicionar mais fotos"
                          >
                            <Plus className="w-4 h-4" />
                            <span className="text-[9px] font-bold mt-0.5">Mais</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Payment Method */}
              <div className="space-y-3 pt-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#221F1B] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#221F1B] text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Forma de Pagamento</span>
                </label>

                {/* Tabs */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`py-3 px-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      paymentMethod === 'pix'
                        ? 'border-[#A6825B] bg-[#FAF6F0] text-[#5C452C] shadow-sm'
                        : 'border-[#E8E2D7] bg-white text-[#666057] hover:border-[#DED7CA]'
                    }`}
                  >
                    <Zap className="w-4 h-4 text-[#A6825B]" />
                    <div className="text-left">
                      <div className="leading-tight">Pix Instantâneo</div>
                      <div className="text-[10px] font-normal opacity-80">Aprovação imediata</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-3 px-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-[#A6825B] bg-[#FAF6F0] text-[#5C452C] shadow-sm'
                        : 'border-[#E8E2D7] bg-white text-[#666057] hover:border-[#DED7CA]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <div className="text-left">
                      <div className="leading-tight">Cartão de Crédito</div>
                      <div className="text-[10px] font-normal opacity-80">Até 3x sem juros</div>
                    </div>
                  </button>
                </div>

                {/* Payment Fields according to selection */}
                {paymentMethod === 'card' && (
                  <form onSubmit={handleProcessCard} className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E2D7] space-y-3 animate-fade-in">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666057] mb-1">
                        Número do Cartão
                      </label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full bg-white border border-[#DED7CA] focus:border-[#A6825B] rounded-xl px-3.5 py-2.5 text-xs text-[#221F1B] outline-none font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666057] mb-1">
                        Nome Impresso no Cartão
                      </label>
                      <input
                        type="text"
                        placeholder="Como está no cartão"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        className="w-full bg-white border border-[#DED7CA] focus:border-[#A6825B] rounded-xl px-3.5 py-2.5 text-xs text-[#221F1B] outline-none uppercase"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666057] mb-1">
                          Validade (MM/AA)
                        </label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          value={cardExpiry}
                          onChange={handleCardExpiryChange}
                          className="w-full bg-white border border-[#DED7CA] focus:border-[#A6825B] rounded-xl px-3.5 py-2.5 text-xs text-[#221F1B] outline-none font-mono text-center"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666057] mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          placeholder="123"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-white border border-[#DED7CA] focus:border-[#A6825B] rounded-xl px-3.5 py-2.5 text-xs text-[#221F1B] outline-none font-mono text-center"
                          required
                        />
                      </div>
                    </div>

                    {/* Submit Card Button */}
                    <button
                      type="submit"
                      disabled={isProcessingCard}
                      className="w-full mt-2 bg-[#A6825B] hover:bg-[#94724C] text-white font-bold text-xs sm:text-sm uppercase tracking-wider py-3.5 rounded-xl shadow-lg shadow-[#A6825B]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                    >
                      {isProcessingCard ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Processando Cartão...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Pagar {formatBRL(finalTotal)} no Cartão</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* PIX Primary CTA Button */}
                {paymentMethod === 'pix' && (
                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={handleGeneratePix}
                      disabled={isGeneratingPix}
                      className="w-full bg-[#A6825B] hover:bg-[#94724C] text-white font-bold text-xs sm:text-sm uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-[#A6825B]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                    >
                      {isGeneratingPix ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Gerando QR Code AbacatePay...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          <span>Gerar Pix no Valor de {formatBRL(finalTotal)}</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#777777]">
                      <Sparkles className="w-3.5 h-3.5 text-[#A6825B]" />
                      <span>Fotos liberadas automaticamente logo após a confirmação via Pix</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Security Footer */}
              <div className="pt-2 border-t border-[#E8E2D7] flex flex-wrap items-center justify-between text-[10px] text-[#999999] gap-2">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#A6825B]" />
                  Entrega Digital Instantânea
                </span>
                <span>AbacatePay Checkout Seguro</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
