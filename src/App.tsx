import React, { useState } from 'react';
import { ContactProvider, useContactos } from './context/ContactContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { ToastContainer } from './components/common/Toast';
import { MiDiaScreen } from './components/screens/MiDiaScreen';
import { ContactosScreen } from './components/screens/ContactosScreen';
import { DetalleContactoScreen } from './components/screens/DetalleContactoScreen';
import { OportunidadesScreen } from './components/screens/OportunidadesScreen';
import { ResultadosScreen } from './components/screens/ResultadosScreen';
import { NuevoContactoModal } from './components/modals/NuevoContactoModal';
import { RegistrarSeguimientoModal } from './components/modals/RegistrarSeguimientoModal';
import { ProgramarSeguimientoModal } from './components/modals/ProgramarSeguimientoModal';
import { CerrarOportunidadModal } from './components/modals/CerrarOportunidadModal';
import { RestablecerModal } from './components/modals/RestablecerModal';
import { Contacto } from './types';

const MainLayout: React.FC = () => {
  const { pantallaActiva, contactoSeleccionadoId } = useContactos();

  // Modales
  const [modalNuevoAbierto, setModalNuevoAbierto] = useState(false);
  const [modalRestablecerAbierto, setModalRestablecerAbierto] = useState(false);
  const [contactoParaSeguimiento, setContactoParaSeguimiento] = useState<Contacto | null>(null);
  const [contactoParaProgramar, setContactoParaProgramar] = useState<Contacto | null>(null);
  const [contactoParaCierre, setContactoParaCierre] = useState<{
    contacto: Contacto;
    etapa: 'cerrado_con_venta' | 'cerrado_sin_venta';
  } | null>(null);

  const abrirRegistrarSeguimiento = (contacto: Contacto) => {
    setContactoParaSeguimiento(contacto);
  };

  const abrirProgramarSeguimiento = (contacto: Contacto) => {
    setContactoParaProgramar(contacto);
  };

  const abrirCerrarOportunidad = (
    contacto: Contacto,
    etapa: 'cerrado_con_venta' | 'cerrado_sin_venta'
  ) => {
    setContactoParaCierre({ contacto, etapa });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-fondo text-texto-principal font-sans antialiased selection:bg-petroleo-100 selection:text-petroleo-900">
      {/* Cabecera superior compacta para móvil */}
      <Header onAbrirRestablecer={() => setModalRestablecerAbierto(true)} />

      {/* Barra lateral de escritorio (240px) */}
      <Sidebar onAbrirRestablecer={() => setModalRestablecerAbierto(true)} />

      {/* Área de contenido principal con ancho controlado y espaciado de 32px */}
      <div className="flex-1 flex flex-col min-w-0">
        <main
          id="contenido-principal"
          tabIndex={-1}
          className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-12 focus:outline-none w-full"
        >
          {pantallaActiva === 'mi_dia' && (
            <MiDiaScreen
              onAbrirNuevoContacto={() => setModalNuevoAbierto(true)}
              onRegistrarSeguimiento={abrirRegistrarSeguimiento}
            />
          )}

          {pantallaActiva === 'contactos' && (
            <ContactosScreen
              onAbrirNuevoContacto={() => setModalNuevoAbierto(true)}
            />
          )}

          {pantallaActiva === 'detalle' && (
            <DetalleContactoScreen
              contactoId={contactoSeleccionadoId}
              onRegistrarSeguimiento={abrirRegistrarSeguimiento}
              onProgramarSeguimiento={abrirProgramarSeguimiento}
              onCerrarOportunidad={abrirCerrarOportunidad}
            />
          )}

          {pantallaActiva === 'oportunidades' && (
            <OportunidadesScreen
              onAbrirNuevoContacto={() => setModalNuevoAbierto(true)}
              onCerrarOportunidad={abrirCerrarOportunidad}
            />
          )}

          {pantallaActiva === 'resultados' && <ResultadosScreen />}
        </main>
      </div>

      {/* Navegación inferior fija en pantallas móviles */}
      <BottomNav />

      {/* Notificaciones accesibles flotantes */}
      <ToastContainer />

      {/* Modales del sistema */}
      <NuevoContactoModal
        abierto={modalNuevoAbierto}
        alCerrar={() => setModalNuevoAbierto(false)}
      />

      <RegistrarSeguimientoModal
        abierto={!!contactoParaSeguimiento}
        contacto={contactoParaSeguimiento}
        alCerrar={() => setContactoParaSeguimiento(null)}
      />

      <ProgramarSeguimientoModal
        abierto={!!contactoParaProgramar}
        contacto={contactoParaProgramar}
        alCerrar={() => setContactoParaProgramar(null)}
      />

      <CerrarOportunidadModal
        abierto={!!contactoParaCierre}
        contacto={contactoParaCierre?.contacto || null}
        etapaDestino={contactoParaCierre?.etapa || null}
        alCerrar={() => setContactoParaCierre(null)}
      />

      <RestablecerModal
        abierto={modalRestablecerAbierto}
        alCerrar={() => setModalRestablecerAbierto(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ContactProvider>
      <MainLayout />
    </ContactProvider>
  );
}
