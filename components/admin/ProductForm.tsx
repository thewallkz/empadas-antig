"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, Save } from "lucide-react";

type ProductFormValues = {
  available: boolean;
  description: string | null;
  imageUrl: string | null;
  name: string;
  price: number;
};

type ProductFormProps = {
  initialValues?: ProductFormValues;
  method: "PATCH" | "POST";
  submitLabel: string;
  submitUrl: string;
};

export function ProductForm({
  initialValues,
  method,
  submitLabel,
  submitUrl,
}: ProductFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    initialValues?.imageUrl ?? null
  );
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch(submitUrl, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(payload?.error || "Nao foi possivel salvar o produto.");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Nao foi possivel salvar o produto.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }

    if (!file) {
      setPreview(initialValues?.imageUrl ?? null);
      return;
    }

    const nextPreview = URL.createObjectURL(file);
    setObjectUrl(nextPreview);
    setPreview(nextPreview);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">
              Nome do Salgado
            </label>
            <input
              name="name"
              required
              defaultValue={initialValues?.name ?? ""}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-neutral-400 font-medium"
              placeholder="Ex: Empada de Frango"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">
              Descricao (Opcional)
            </label>
            <textarea
              name="description"
              rows={3}
              defaultValue={initialValues?.description ?? ""}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-neutral-400 resize-none font-medium"
              placeholder="Ex: Massa leve com recheio caseiro"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">
                Preco (R$)
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={initialValues?.price ?? ""}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-neutral-400 font-medium"
                placeholder="0.00"
              />
            </div>
            <div className="flex items-center pt-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="available"
                  value="true"
                  defaultChecked={initialValues?.available ?? true}
                  className="w-5 h-5 text-emerald-500 rounded border-neutral-300 focus:ring-emerald-500"
                />
                <span className="font-bold text-neutral-700">Disponivel</span>
              </label>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-bold text-neutral-700 mb-2">
            Imagem do Produto
          </label>
          <div className="mt-1 relative group w-full aspect-square md:aspect-auto md:h-full bg-neutral-50 border-2 border-dashed border-neutral-300 hover:border-emerald-500 rounded-2xl flex flex-col items-center justify-center transition-colors cursor-pointer overflow-hidden max-h-[300px]">
            {preview ? (
              <img
                src={preview}
                alt="Preview do produto"
                className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
              />
            ) : (
              <div className="text-center p-6 pointer-events-none">
                <ImageIcon className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
                <p className="text-sm font-medium text-neutral-600">
                  Clique para selecionar
                </p>
                <p className="text-xs text-neutral-400 mt-2">
                  JPEG, PNG ou WebP ate 2MB
                </p>
              </div>
            )}

            <input
              type="file"
              name="image"
              accept="image/jpeg, image/png, image/webp"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <p className="mt-3 text-sm text-neutral-500">
            {initialValues?.imageUrl
              ? "Selecione outra imagem apenas se quiser substituir a atual."
              : "Formatos aceitos: JPEG, PNG e WebP."}
          </p>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-neutral-100 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white px-8 py-3.5 rounded-full font-bold shadow-sm transition-all shadow-emerald-500/20 hover:shadow-emerald-500/40 w-full md:w-auto justify-center"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <Save size={20} strokeWidth={2.5} />
          )}
          <span>{loading ? "Salvando..." : submitLabel}</span>
        </button>
      </div>
    </form>
  );
}
