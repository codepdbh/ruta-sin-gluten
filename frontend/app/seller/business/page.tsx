'use client';

import { FormEvent, useState } from 'react';
import { createSellerProfile } from '@/lib/api/services/vendors';

export default function SellerBusinessPage() {
  const [message, setMessage] = useState('Guardá tu perfil comercial con el token del login seller.');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setLoading(true);
    setMessage('Guardando perfil...');

    try {
      await createSellerProfile({
        businessName: String(formData.get('businessName') ?? ''),
        ownerName: String(formData.get('ownerName') ?? ''),
        businessType: String(formData.get('businessType') ?? 'OTRO'),
        description: String(formData.get('description') ?? ''),
        department: String(formData.get('department') ?? ''),
        city: String(formData.get('city') ?? ''),
        whatsapp: String(formData.get('whatsapp') ?? ''),
        hasPhysicalStore: formData.get('hasPhysicalStore') === 'on',
        hasShipping: formData.get('hasShipping') === 'on',
        modality: String(formData.get('modality') ?? '') || undefined,
        crossContaminationRisk: String(formData.get('crossContaminationRisk') ?? '') || undefined,
        separateUtensils: formData.get('separateUtensils') === 'on',
        separateArea: formData.get('separateArea') === 'on',
        trainedStaff: formData.get('trainedStaff') === 'on',
        safetyNotes: String(formData.get('safetyNotes') ?? ''),
      });

      setMessage('Perfil guardado. Ahora podés cargar ubicación, envíos y productos.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo guardar el perfil.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-card">
      <p className="eyebrow">Seller</p>
      <h1>Perfil del comercio</h1>
      <form className="form-grid two-col" onSubmit={handleSubmit}>
        <label>
          Nombre comercial
          <input name="businessName" required />
        </label>
        <label>
          Nombre del responsable
          <input name="ownerName" required />
        </label>
        <label>
          Tipo
          <select name="businessType" defaultValue="PANADERIA">
            <option value="TIENDA">Tienda</option>
            <option value="EMPRENDIMIENTO">Emprendimiento</option>
            <option value="PANADERIA">Panadería</option>
            <option value="CAFETERIA">Cafetería</option>
            <option value="RESTAURANTE">Restaurante</option>
            <option value="OTRO">Otro</option>
          </select>
        </label>
        <label>
          WhatsApp
          <input name="whatsapp" required />
        </label>
        <label>
          Departamento
          <input name="department" defaultValue="La Paz" required />
        </label>
        <label>
          Ciudad
          <input name="city" defaultValue="La Paz" required />
        </label>
        <label>
          Modalidad
          <select name="modality" defaultValue="CON_OPCIONES">
            <option value="CON_OPCIONES">Con opciones</option>
            <option value="CIEN_PORCIENTO_LIBRE_GLUTEN">100% libre gluten</option>
          </select>
        </label>
        <label>
          Riesgo de contaminación
          <select name="crossContaminationRisk" defaultValue="NO_INFORMADO">
            <option value="BAJO">Bajo</option>
            <option value="MEDIO">Medio</option>
            <option value="ALTO">Alto</option>
            <option value="NO_INFORMADO">No informado</option>
          </select>
        </label>
        <label style={{ gridColumn: '1 / -1' }}>
          Descripción
          <textarea name="description" />
        </label>
        <label style={{ gridColumn: '1 / -1' }}>
          Notas de inocuidad
          <textarea name="safetyNotes" />
        </label>
        <label className="checkbox-field">
          <input name="hasPhysicalStore" type="checkbox" defaultChecked />
          Tiene local físico
        </label>
        <label className="checkbox-field">
          <input name="hasShipping" type="checkbox" defaultChecked />
          Hace envíos
        </label>
        <label className="checkbox-field">
          <input name="separateUtensils" type="checkbox" />
          Usa utensilios separados
        </label>
        <label className="checkbox-field">
          <input name="separateArea" type="checkbox" />
          Tiene área separada
        </label>
        <label className="checkbox-field">
          <input name="trainedStaff" type="checkbox" />
          Personal capacitado
        </label>
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar perfil'}
        </button>
      </form>
      <p className="status-pill">{message}</p>
    </section>
  );
}
