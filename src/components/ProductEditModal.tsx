import React, { useState, useEffect } from 'react';
import { Product, ProductCategory } from '../types';
import {
  X,
  Save,
  Sparkles,
  Image as ImageIcon,
  DollarSign,
  Plus,
  Trash2,
  Tag,
  Clock,
  Camera,
  Check,
} from 'lucide-react';

interface ProductEditModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => Promise<void>;
  onShowToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

const SUGGESTED_CATEGORIES = [
  'Aniversário',
  'Casal & Romântico',
  'Turismo & Viagens',
  'Profissional & LinkedIn',
  'Infantil & Kids',
  'Fitness & Lifestyle',
  'Moda & Editorial',
  'Formatura',
  'Casamento',
  'Pets & Animais',
  'Gestante & Família',
  'Carnaval & Festas',
];

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  isOpen,
  product,
  onClose,
  onSave,
  onShowToast,
}) => {
  const isEditing = Boolean(product && product.id);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'Aniversário',
    cat: 'Aniversário',
    price: 39.90,
    originalPrice: 79.90,
    photoCount: 20,
    deliveryHours: 12,
    rating: 5.0,
    reviewsCount: 50,
    isPopular: false,
    isPromo: true,
    badge: 'Mais Vendido',
    coverImage: '',
    gallery: [],
    description: '',
    features: [],
    tags: [],
  });

  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newFeatureText, setNewFeatureText] = useState('');
  const [newTagText, setNewTagText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (product) {
      const initialCat = product.category || product.cat || 'Aniversário';
      setFormData({
        ...product,
        category: initialCat,
        cat: initialCat,
        gallery: product.gallery ? [...product.gallery] : [],
        features: product.features ? [...product.features] : [],
        tags: product.tags ? [...product.tags] : [],
      });
    } else {
      setFormData({
        name: '',
        category: 'Aniversário',
        cat: 'Aniversário',
        price: 39.90,
        originalPrice: 79.90,
        photoCount: 20,
        deliveryHours: 12,
        rating: 5.0,
        reviewsCount: 1,
        isPopular: false,
        isPromo: true,
        badge: 'Novo Álbum',
        coverImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80'
        ],
        description: 'Ensaio fotográfico hiper-realista com tecnologia de ponta em Inteligência Artificial.',
        features: [
          'Fotografias em alta definição 4K ultra-realistas',
          'Entrega rápida e segura',
          'Download ilimitado por 1 ano'
        ],
        tags: ['IA', 'Ensaio', 'Fotos'],
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      onShowToast('Informe o nome do álbum.', 'error');
      return;
    }
    if (!formData.coverImage?.trim()) {
      onShowToast('Informe a URL da imagem de capa.', 'error');
      return;
    }

    const finalCategory = (formData.category || formData.cat || 'Geral').trim();

    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        category: finalCategory,
        cat: finalCategory,
        gallery: formData.gallery && formData.gallery.length > 0 ? formData.gallery : [formData.coverImage!],
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const addGalleryImage = () => {
    if (!newGalleryUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      gallery: [...(prev.gallery || []), newGalleryUrl.trim()],
    }));
    setNewGalleryUrl('');
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery?.filter((_, i) => i !== index),
    }));
  };

  const addFeature = () => {
    if (!newFeatureText.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...(prev.features || []), newFeatureText.trim()],
    }));
    setNewFeatureText('');
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (!newTagText.trim()) return;
    setFormData((prev) => ({
      ...prev,
      tags: [...(prev.tags || []), newTagText.trim()],
    }));
    setNewTagText('');
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-[#D5D2CB] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#EAE8E4] flex items-center justify-between bg-[#FAF9F7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#A6825B]/10 text-[#A6825B] flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-[#111111]">
                {isEditing ? `Editar Álbum: ${product?.name}` : 'Criar Novo Álbum de Fotos'}
              </h2>
              <p className="text-xs text-[#666666]">
                Configure preço, promoções, imagem de capa e diferenciais exibidos na loja.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#EAE8E4] text-[#666666] flex items-center justify-center transition-colors cursor-pointer border border-[#E0DDD8]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Main Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#888888] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#A6825B]" />
              <span>Informações Principais</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#222222] mb-1">
                  Nome do Álbum *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Álbum Aniversário 20 Fotos Black"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FAF9F7] border border-[#D5D2CB] focus:border-[#A6825B] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#111111] outline-none transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#222222]">
                    Nome da Categoria *
                  </label>
                  <span className="text-[11px] text-[#777777]">
                    Digite qualquer categoria ou escolha uma sugestão
                  </span>
                </div>
                <input
                  type="text"
                  required
                  list="category-suggestions"
                  placeholder="Ex: Aniversário, Casamento, Natal, Formatura, Pets..."
                  value={formData.category || formData.cat || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value, cat: e.target.value })}
                  className="w-full bg-[#FAF9F7] border border-[#D5D2CB] focus:border-[#A6825B] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#111111] outline-none transition-all"
                />
                <datalist id="category-suggestions">
                  {SUGGESTED_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>

                {/* Quick select suggestions */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] uppercase font-bold text-[#888888] mr-1">Sugestões rápidas:</span>
                  {SUGGESTED_CATEGORIES.slice(0, 7).map((cat) => {
                    const isSelected = (formData.category || formData.cat)?.toLowerCase() === cat.toLowerCase();
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setFormData({ ...formData, category: cat, cat: cat })}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                            : 'bg-[#FAF9F7] text-[#555555] border-[#E0DDD8] hover:bg-[#F0EFEA] hover:text-[#111111]'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#222222] mb-1">
                  Selo de Destaque / Badge (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Mais Vendido, Super Completo, 50% OFF"
                  value={formData.badge || ''}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full bg-[#FAF9F7] border border-[#D5D2CB] focus:border-[#A6825B] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#111111] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Promotions */}
          <div className="space-y-4 pt-4 border-t border-[#EAE8E4]">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#888888] flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>Valores & Promoções</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-bold text-[#222222] mb-1">
                  Preço Atual (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="39.90"
                  value={formData.price ?? ''}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#FAF9F7] border border-emerald-300 focus:border-emerald-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-emerald-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#222222] mb-1">
                  Preço Original Riscado (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="79.90"
                  value={formData.originalPrice ?? ''}
                  onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || undefined })}
                  className="w-full bg-[#FAF9F7] border border-[#D5D2CB] focus:border-[#A6825B] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#777777] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#222222] mb-1">
                  Qtd de Fotos
                </label>
                <input
                  type="number"
                  required
                  placeholder="20"
                  value={formData.photoCount ?? 20}
                  onChange={(e) => setFormData({ ...formData, photoCount: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#FAF9F7] border border-[#D5D2CB] focus:border-[#A6825B] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#111111] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#222222] mb-1">
                  Prazo de Entrega (Horas)
                </label>
                <input
                  type="number"
                  required
                  placeholder="12"
                  value={formData.deliveryHours ?? 12}
                  onChange={(e) => setFormData({ ...formData, deliveryHours: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#FAF9F7] border border-[#D5D2CB] focus:border-[#A6825B] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#111111] outline-none"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isPromo ?? false}
                  onChange={(e) => setFormData({ ...formData, isPromo: e.target.checked })}
                  className="w-4 h-4 rounded text-[#A6825B] focus:ring-[#A6825B] accent-[#A6825B]"
                />
                <span className="text-xs font-bold text-[#222222]">
                  Exibir Tag de Promoção
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isPopular ?? false}
                  onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 accent-amber-500"
                />
                <span className="text-xs font-bold text-[#222222]">
                  Destaque na Página Inicial (Popular)
                </span>
              </label>
            </div>
          </div>

          {/* Media & Images */}
          <div className="space-y-4 pt-4 border-t border-[#EAE8E4]">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#888888] flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
              <span>Imagens & Galeria de Exemplos</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#222222] mb-1">
                URL da Imagem de Capa Principal *
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formData.coverImage || ''}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="flex-1 bg-[#FAF9F7] border border-[#D5D2CB] focus:border-[#A6825B] focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#111111] outline-none"
                />
                {formData.coverImage && (
                  <img
                    src={formData.coverImage}
                    alt="Preview Capa"
                    className="w-10 h-10 rounded-xl object-cover border border-[#D5D2CB]"
                  />
                )}
              </div>
            </div>

            {/* Gallery list */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#222222]">
                Fotos Adicionais da Galeria ({formData.gallery?.length || 0})
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Cole a URL de mais fotos de exemplo..."
                  value={newGalleryUrl}
                  onChange={(e) => setNewGalleryUrl(e.target.value)}
                  className="flex-1 bg-[#FAF9F7] border border-[#D5D2CB] rounded-xl px-3 py-2 text-xs text-[#111111] outline-none"
                />
                <button
                  type="button"
                  onClick={addGalleryImage}
                  className="px-3.5 py-2 bg-[#111111] hover:bg-[#333333] text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Foto</span>
                </button>
              </div>

              {formData.gallery && formData.gallery.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                  {formData.gallery.map((url, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-[#D5D2CB]">
                      <img src={url} alt={`Galeria ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        title="Remover foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description & Features */}
          <div className="space-y-4 pt-4 border-t border-[#EAE8E4]">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#888888] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              <span>Descrição & Benefícios Inclusos</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#222222] mb-1">
                Descrição do Ensaio
              </label>
              <textarea
                rows={3}
                placeholder="Explique o conceito fotográfico, temas e cenários..."
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#FAF9F7] border border-[#D5D2CB] focus:border-[#A6825B] focus:bg-white rounded-xl p-3 text-xs text-[#111111] outline-none"
              />
            </div>

            {/* Features list */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#222222]">
                Itens Inclusos / Diferenciais ({formData.features?.length || 0})
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: 20 Fotos em 4K ultra-realistas com champagne..."
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  className="flex-1 bg-[#FAF9F7] border border-[#D5D2CB] rounded-xl px-3 py-2 text-xs text-[#111111] outline-none"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-3.5 py-2 bg-[#111111] hover:bg-[#333333] text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar</span>
                </button>
              </div>

              {formData.features && formData.features.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {formData.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2 bg-[#FAF9F7] rounded-xl border border-[#EAE8E4] text-xs text-[#333333]"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="text-[#888888] hover:text-red-600 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#222222]">
                Tags ({formData.tags?.length || 0})
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Black, Festa, 4K, Aniversário..."
                  value={newTagText}
                  onChange={(e) => setNewTagText(e.target.value)}
                  className="flex-1 bg-[#FAF9F7] border border-[#D5D2CB] rounded-xl px-3 py-2 text-xs text-[#111111] outline-none"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3.5 py-2 bg-[#FAF9F7] hover:bg-[#EAE8E4] border border-[#D5D2CB] text-[#333333] text-xs font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tag</span>
                </button>
              </div>

              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-[#FAF9F7] text-[#444444] border border-[#D5D2CB] text-[11px] font-medium px-2.5 py-1 rounded-lg"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(idx)}
                        className="hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Action buttons */}
          <div className="pt-4 border-t border-[#EAE8E4] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#D5D2CB] text-xs font-bold text-[#555555] hover:text-[#111111] hover:bg-[#FAF9F7] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#A6825B] hover:bg-[#94724C] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Criar Álbum'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
