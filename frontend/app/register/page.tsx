"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import dynamic from "next/dynamic";
import { register } from "@/lib/api/services/auth";
import { saveAuthToken } from "@/lib/api/client";

const LocationPicker = dynamic(
  () =>
    import("@/components/map/LocationPicker").then(
      (module) => module.LocationPicker,
    ),
  {
    ssr: false,
  },
);

type PointDraft = {
  id: string;
  name: string;
  addressText: string;
  reference: string;
  schedule: string;
  lat?: number;
  lng?: number;
};

const LOCATIONS_BY_COUNTRY: Record<string, Record<string, string[]>> = {
  Bolivia: {
    Beni: [
      "Trinidad",
      "Riberalta",
      "Guayaramerin",
      "San Borja",
      "Rurrenabaque",
    ],
    Chuquisaca: ["Sucre", "Monteagudo", "Camargo", "Padilla", "Villa Serrano"],
    Cochabamba: [
      "Cochabamba",
      "Sacaba",
      "Quillacollo",
      "Tiquipaya",
      "Colcapirhua",
      "Cliza",
      "Punata",
    ],
    "La Paz": [
      "La Paz",
      "El Alto",
      "Viacha",
      "Achocalla",
      "Mecapaca",
      "Copacabana",
      "Caranavi",
      "Coroico",
    ],
    Oruro: ["Oruro", "Huanuni", "Challapata", "Caracollo"],
    Pando: ["Cobija", "Porvenir", "Puerto Rico"],
    Potosi: ["Potosi", "Uyuni", "Villazon", "Tupiza", "Llallagua"],
    "Santa Cruz": [
      "Santa Cruz de la Sierra",
      "Warnes",
      "Montero",
      "La Guardia",
      "Cotoca",
      "Porongo",
      "Yapacani",
    ],
    Tarija: ["Tarija", "Yacuiba", "Bermejo", "Villa Montes", "Entre Rios"],
  },
  Argentina: {
    "Buenos Aires": [
      "La Plata",
      "Mar del Plata",
      "Bahia Blanca",
      "Tandil",
      "San Isidro",
    ],
    "Ciudad Autonoma de Buenos Aires": ["Buenos Aires"],
    Cordoba: ["Cordoba", "Villa Carlos Paz", "Rio Cuarto", "Villa Maria"],
    Mendoza: ["Mendoza", "Godoy Cruz", "Guaymallen", "San Rafael"],
    Salta: ["Salta", "San Ramon de la Nueva Oran", "Tartagal"],
    "Santa Fe": ["Rosario", "Santa Fe", "Rafaela", "Venado Tuerto"],
    Tucuman: ["San Miguel de Tucuman", "Yerba Buena", "Tafi Viejo"],
  },
  Brasil: {
    "Distrito Federal": ["Brasilia"],
    "Minas Gerais": [
      "Belo Horizonte",
      "Uberlandia",
      "Contagem",
      "Juiz de Fora",
    ],
    Parana: ["Curitiba", "Londrina", "Maringa", "Foz do Iguacu"],
    "Rio de Janeiro": ["Rio de Janeiro", "Niteroi", "Petropolis"],
    "Rio Grande do Sul": ["Porto Alegre", "Caxias do Sul", "Pelotas"],
    "Santa Catarina": ["Florianopolis", "Joinville", "Blumenau"],
    "Sao Paulo": ["Sao Paulo", "Campinas", "Santos", "Ribeirao Preto"],
  },
  Chile: {
    Antofagasta: ["Antofagasta", "Calama", "Tocopilla"],
    Coquimbo: ["La Serena", "Coquimbo", "Ovalle"],
    "Region Metropolitana": ["Santiago", "Puente Alto", "Maipu", "Providencia"],
    Valparaiso: ["Valparaiso", "Vina del Mar", "Quilpue", "San Antonio"],
    Biobio: ["Concepcion", "Talcahuano", "Los Angeles"],
    "La Araucania": ["Temuco", "Villarrica", "Angol"],
  },
  Colombia: {
    Antioquia: ["Medellin", "Envigado", "Bello", "Rionegro"],
    Atlantico: ["Barranquilla", "Soledad", "Puerto Colombia"],
    "Bogota D.C.": ["Bogota"],
    Cundinamarca: ["Soacha", "Chia", "Zipaquira", "Facatativa"],
    Santander: ["Bucaramanga", "Floridablanca", "Barrancabermeja"],
    "Valle del Cauca": ["Cali", "Palmira", "Buenaventura", "Tulua"],
  },
  Ecuador: {
    Azuay: ["Cuenca", "Gualaceo", "Paute"],
    "El Oro": ["Machala", "Santa Rosa", "Pasaje"],
    Guayas: ["Guayaquil", "Duran", "Samborondon", "Daule"],
    Loja: ["Loja", "Catamayo", "Macara"],
    Manabi: ["Manta", "Portoviejo", "Chone"],
    Pichincha: ["Quito", "Cumbaya", "Sangolqui", "Cayambe"],
  },
  Paraguay: {
    "Alto Parana": ["Ciudad del Este", "Presidente Franco", "Hernandarias"],
    Asuncion: ["Asuncion"],
    Boqueron: ["Filadelfia", "Loma Plata", "Mariscal Estigarribia"],
    Caaguazu: ["Coronel Oviedo", "Caaguazu", "Repatriacion"],
    Central: ["San Lorenzo", "Luque", "Fernando de la Mora", "Capiata"],
    Itapua: ["Encarnacion", "Hohenau", "Cambyreta"],
  },
  Peru: {
    Arequipa: ["Arequipa", "Camana", "Mollendo"],
    Cusco: ["Cusco", "Sicuani", "Urubamba"],
    "La Libertad": ["Trujillo", "Chepen", "Pacasmayo"],
    Lambayeque: ["Chiclayo", "Lambayeque", "Ferrenafe"],
    Lima: ["Lima", "Miraflores", "San Isidro", "Barranco", "San Borja"],
    Puno: ["Puno", "Juliaca", "Ilave"],
    Tacna: ["Tacna", "Alto de la Alianza"],
  },
  Uruguay: {
    Canelones: ["Canelones", "Ciudad de la Costa", "Las Piedras", "Pando"],
    Colonia: ["Colonia del Sacramento", "Carmelo", "Nueva Helvecia"],
    Maldonado: ["Maldonado", "Punta del Este", "San Carlos"],
    Montevideo: ["Montevideo"],
    Paysandu: ["Paysandu", "Guichon"],
    Salto: ["Salto", "Dayman"],
  },
};

const COUNTRY_OPTIONS = Object.keys(LOCATIONS_BY_COUNTRY);

export default function RegisterPage() {
  const [role, setRole] = useState<"USER" | "SELLER">("USER");
  const [country, setCountry] = useState(COUNTRY_OPTIONS[0]);
  const [department, setDepartment] = useState("");
  const [city, setCity] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [mainLocation, setMainLocation] = useState<{
    addressText: string;
    reference: string;
    lat?: number;
    lng?: number;
  }>({
    addressText: "",
    reference: "",
  });
  const [deliveryPoints, setDeliveryPoints] = useState<PointDraft[]>([]);
  const [message, setMessage] = useState(
    "Creá una cuenta como usuario o vendedor.",
  );
  const [loading, setLoading] = useState(false);
  const countryLocations = LOCATIONS_BY_COUNTRY[country] ?? {};
  const departmentOptions = Object.keys(countryLocations);
  const cityOptions = department ? (countryLocations[department] ?? []) : [];

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      setter("");
      return;
    }

    const reader = new FileReader();
    const result = await new Promise<string>((resolve, reject) => {
      reader.onload = () =>
        resolve(typeof reader.result === "string" ? reader.result : "");
      reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
      reader.readAsDataURL(file);
    });

    setter(result);
  }

  function addDeliveryPoint() {
    if (deliveryPoints.length >= 6) {
      setMessage("Solo se permiten hasta 6 puntos de entrega o comercio.");
      return;
    }

    setDeliveryPoints((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name: `Punto ${current.length + 1}`,
        addressText: "",
        reference: "",
        schedule: "",
      },
    ]);
  }

  function updateDeliveryPoint(id: string, patch: Partial<PointDraft>) {
    setDeliveryPoints((current) =>
      current.map((point) =>
        point.id === id ? { ...point, ...patch } : point,
      ),
    );
  }

  function removeDeliveryPoint(id: string) {
    setDeliveryPoints((current) => current.filter((point) => point.id !== id));
  }

  function handleDepartmentChange(nextDepartment: string) {
    setDepartment(nextDepartment);
    setCity("");
  }

  function handleCountryChange(nextCountry: string) {
    setCountry(nextCountry);
    setDepartment("");
    setCity("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setLoading(true);
    setMessage("Creando cuenta...");

    try {
      const response = await register({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        avatarUrl: avatarUrl || undefined,
        businessName: String(formData.get("businessName") ?? "") || undefined,
        logoUrl: logoUrl || undefined,
        businessType:
          (String(formData.get("businessType") ?? "") as
            | "TIENDA"
            | "EMPRENDIMIENTO"
            | "PANADERIA"
            | "CAFETERIA"
            | "RESTAURANTE"
            | "OTRO") || undefined,
        department: String(formData.get("department") ?? "") || undefined,
        city: String(formData.get("city") ?? "") || undefined,
        country: String(formData.get("country") ?? "") || undefined,
        whatsapp: String(formData.get("whatsapp") ?? "") || undefined,
        description: String(formData.get("description") ?? "") || undefined,
        hasPhysicalStore: formData.get("hasPhysicalStore") === "on",
        hasShipping: formData.get("hasShipping") === "on",
        mainLocation:
          role === "SELLER"
            ? {
                addressText: mainLocation.addressText,
                reference: mainLocation.reference || undefined,
                lat: mainLocation.lat,
                lng: mainLocation.lng,
              }
            : undefined,
        deliveryPoints:
          role === "SELLER"
            ? deliveryPoints
                .filter(
                  (point) =>
                    point.addressText &&
                    typeof point.lat === "number" &&
                    typeof point.lng === "number",
                )
                .map((point) => ({
                  name: point.name,
                  addressText: point.addressText,
                  reference: point.reference || undefined,
                  schedule: point.schedule || undefined,
                  lat: point.lat!,
                  lng: point.lng!,
                }))
            : undefined,
        role,
      });

      saveAuthToken(response.accessToken);
      setMessage(
        response.emailVerificationSent
          ? `Cuenta creada como ${response.user.role === "SELLER" ? "vendedor" : "usuario"}. Revisa tu correo para verificarlo.`
          : `Cuenta creada como ${response.user.role === "SELLER" ? "vendedor" : "usuario"}. La verificacion por correo quedo pendiente.`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "No se pudo registrar.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-card">
      <p className="eyebrow">Registro</p>
      <h1>Crear cuenta</h1>
      <form className="form-grid two-col" onSubmit={handleSubmit}>
        <label>
          Nombre de usuario
          <input name="name" required />
        </label>
        <label>
          Celular
          <input name="phone" />
        </label>
        <label>
          Correo
          <input name="email" type="email" required />
        </label>
        <label>
          Rol
          <select
            name="role"
            value={role}
            onChange={(event) =>
              setRole(event.target.value as "USER" | "SELLER")
            }
          >
            <option value="USER">Usuario</option>
            <option value="SELLER">Vendedor / Comercio</option>
          </select>
        </label>
        {role === "USER" ? (
          <label className="upload-field">
            Foto de perfil
            <input
              type="file"
              accept="image/*"
              onChange={(event) => void handleImageUpload(event, setAvatarUrl)}
            />
            {avatarUrl ? (
              <img
                className="upload-preview"
                src={avatarUrl}
                alt="Vista previa del perfil"
              />
            ) : null}
          </label>
        ) : (
          <>
            <label>
              Nombre del comercio
              <input name="businessName" required={role === "SELLER"} />
            </label>
            <label>
              Tipo de negocio
              <select name="businessType" defaultValue="OTRO">
                <option value="OTRO">Otro</option>
                <option value="TIENDA">Tienda</option>
                <option value="EMPRENDIMIENTO">Emprendimiento</option>
                <option value="PANADERIA">Panaderia</option>
                <option value="CAFETERIA">Cafeteria</option>
                <option value="RESTAURANTE">Restaurante</option>
              </select>
            </label>
            <label className="upload-field">
              Logo del negocio
              <input
                type="file"
                accept="image/*"
                onChange={(event) => void handleImageUpload(event, setLogoUrl)}
              />
              {logoUrl ? (
                <img
                  className="upload-preview"
                  src={logoUrl}
                  alt="Vista previa del logo"
                />
              ) : null}
            </label>
            <label>
              WhatsApp del negocio
              <input name="whatsapp" required={role === "SELLER"} />
            </label>
            <label>
              Pais
              <select
                name="country"
                value={country}
                onChange={(event) => handleCountryChange(event.target.value)}
              >
                {COUNTRY_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Departamento / region
              <select
                name="department"
                value={department}
                onChange={(event) => handleDepartmentChange(event.target.value)}
                required={role === "SELLER"}
              >
                <option value="">Selecciona departamento o region</option>
                {departmentOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Ciudad
              <select
                name="city"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                disabled={!department}
                required={role === "SELLER"}
              >
                <option value="">
                  {department
                    ? "Selecciona ciudad"
                    : "Primero selecciona departamento"}
                </option>
                {cityOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="checkbox-field">
              <input name="hasPhysicalStore" type="checkbox" />
              Tiene local fisico
            </label>
            <label className="checkbox-field">
              <input name="hasShipping" type="checkbox" />
              Hace envios
            </label>
            <label className="form-grid__full">
              Descripcion del negocio
              <textarea
                name="description"
                placeholder="Contanos que vende tu comercio y que opciones sin gluten ofrece."
              />
            </label>
            <div className="form-grid__full register-location-block">
              <div className="register-location-block__header">
                <div>
                  <h2>Ubicacion principal</h2>
                  <p className="muted">
                    Selecciona en el mapa donde queda tu comercio o punto
                    principal.
                  </p>
                </div>
              </div>
              <div className="form-grid two-col">
                <label>
                  Direccion escrita
                  <input
                    value={mainLocation.addressText}
                    onChange={(event) =>
                      setMainLocation((current) => ({
                        ...current,
                        addressText: event.target.value,
                      }))
                    }
                    required={role === "SELLER"}
                  />
                </label>
                <label>
                  Referencia del lugar
                  <input
                    value={mainLocation.reference}
                    onChange={(event) =>
                      setMainLocation((current) => ({
                        ...current,
                        reference: event.target.value,
                      }))
                    }
                    placeholder="Frente a la plaza, segundo piso, puerta roja..."
                  />
                </label>
                <label>
                  Latitud
                  <input
                    value={mainLocation.lat ?? ""}
                    onChange={(event) =>
                      setMainLocation((current) => ({
                        ...current,
                        lat: event.target.value
                          ? Number(event.target.value)
                          : undefined,
                      }))
                    }
                    type="number"
                    step="any"
                    required={role === "SELLER"}
                  />
                </label>
                <label>
                  Longitud
                  <input
                    value={mainLocation.lng ?? ""}
                    onChange={(event) =>
                      setMainLocation((current) => ({
                        ...current,
                        lng: event.target.value
                          ? Number(event.target.value)
                          : undefined,
                      }))
                    }
                    type="number"
                    step="any"
                    required={role === "SELLER"}
                  />
                </label>
              </div>
              <LocationPicker
                value={mainLocation}
                onChange={(next) =>
                  setMainLocation((current) => ({
                    ...current,
                    lat: next.lat,
                    lng: next.lng,
                  }))
                }
                deliveryPoints={deliveryPoints}
              />
            </div>
            <div className="form-grid__full register-location-block">
              <div className="register-location-block__header">
                <div>
                  <h2>Puntos de entrega o sucursales</h2>
                  <p className="muted">
                    Puedes registrar hasta 6 ubicaciones adicionales con
                    descripcion escrita.
                  </p>
                </div>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={addDeliveryPoint}
                >
                  Agregar punto
                </button>
              </div>
              <div className="data-list">
                {deliveryPoints.map((point, index) => (
                  <article
                    key={point.id}
                    className="panel-card register-point-card"
                  >
                    <div className="register-point-card__header">
                      <h3>Punto {index + 1}</h3>
                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() => removeDeliveryPoint(point.id)}
                      >
                        Quitar
                      </button>
                    </div>
                    <div className="form-grid two-col">
                      <label>
                        Nombre del punto
                        <input
                          value={point.name}
                          onChange={(event) =>
                            updateDeliveryPoint(point.id, {
                              name: event.target.value,
                            })
                          }
                        />
                      </label>
                      <label>
                        Horario
                        <input
                          value={point.schedule}
                          onChange={(event) =>
                            updateDeliveryPoint(point.id, {
                              schedule: event.target.value,
                            })
                          }
                        />
                      </label>
                      <label>
                        Direccion escrita
                        <input
                          value={point.addressText}
                          onChange={(event) =>
                            updateDeliveryPoint(point.id, {
                              addressText: event.target.value,
                            })
                          }
                        />
                      </label>
                      <label>
                        Referencia del lugar
                        <input
                          value={point.reference}
                          onChange={(event) =>
                            updateDeliveryPoint(point.id, {
                              reference: event.target.value,
                            })
                          }
                        />
                      </label>
                      <label>
                        Latitud
                        <input
                          value={point.lat ?? ""}
                          onChange={(event) =>
                            updateDeliveryPoint(point.id, {
                              lat: event.target.value
                                ? Number(event.target.value)
                                : undefined,
                            })
                          }
                          type="number"
                          step="any"
                        />
                      </label>
                      <label>
                        Longitud
                        <input
                          value={point.lng ?? ""}
                          onChange={(event) =>
                            updateDeliveryPoint(point.id, {
                              lng: event.target.value
                                ? Number(event.target.value)
                                : undefined,
                            })
                          }
                          type="number"
                          step="any"
                        />
                      </label>
                    </div>
                    <LocationPicker
                      value={point}
                      onChange={(next) =>
                        updateDeliveryPoint(point.id, {
                          lat: next.lat,
                          lng: next.lng,
                        })
                      }
                      deliveryPoints={deliveryPoints.filter(
                        (item) => item.id !== point.id,
                      )}
                      heightClassName="location-picker location-picker--compact"
                    />
                  </article>
                ))}
              </div>
            </div>
          </>
        )}
        <label>
          Contraseña
          <input name="password" type="password" minLength={8} required />
        </label>
        <div className="inline-actions">
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Crear cuenta"}
          </button>
        </div>
      </form>
      <p className="status-pill">{message}</p>
    </section>
  );
}
