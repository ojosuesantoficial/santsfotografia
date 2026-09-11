import confetti from 'canvas-confetti';

export const formatBRL = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const DISCOUNT_CONFIG = {
  minItems: 3,
  percent: 0.30, // 30% OFF
};

export const formatPhone = (val: string): string => {
  const digits = val.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

export const triggerConfetti = () => {
  try {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C2A686', '#A6825B', '#E8DCD1', '#2D2A26', '#D4AF37'],
    });
  } catch (e) {
    // Fallback if canvas confetti fails
  }
};
