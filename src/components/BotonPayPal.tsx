import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { iniciarCompraRequest } from "../api/compras";
import { ArrowLeft } from "lucide-react";

export const BotonPayPal = () => {
    const [cargando, setCargando] = useState(false);
    const [metodoSeleccionado, setMetodoSeleccionado] = useState(false);
    const [resetKey, setResetKey] = useState(0);
    const navigate = useNavigate();
    const cartItems = useCartStore((state) => state.cartItems);
    const clearCart = useCartStore((state) => state.clearCart);
    const initialOptions = {
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
    };

    const volverOpciones = () => {
        setResetKey(prev => prev + 1);
        setMetodoSeleccionado(false);
    };

    return (
        <PayPalScriptProvider options={initialOptions}>
            <div className="w-full max-w-[280px] mx-auto relative z-0 flex flex-col items-center">
                {cargando && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#131313]/90 rounded-xl">
                        <span className="text-[#d7f250] text-sm font-bold animate-pulse">Conectando con PayPal...</span>
                    </div>
                )}
                {metodoSeleccionado && (
                    <button
                        onClick={volverOpciones}
                        className="mb-4 flex items-center gap-2 text-xs font-bold text-[#a1a1aa] hover:text-white transition-colors self-start z-100"
                    >
                        <ArrowLeft size={14} /> Volver a los botones
                    </button>
                )}

                <div className="w-full">
                    <PayPalButtons
                        key={resetKey}
                        onClick={(_data, actions) => {
                            if (cargando) {
                                return actions.reject();
                            }
                            return actions.resolve();
                        }}
                        style={{
                            layout: "vertical",
                            color: "gold",
                            shape: "rect",
                            label: "pay"
                        }}

                        createOrder={async () => {
                            if (cargando) return "";
                            setCargando(true);
                            setMetodoSeleccionado(true);
                            try {
                                const idsCategorias = cartItems.map(item => item.id);
                                const respuestaBackend = await iniciarCompraRequest({ idsCategorias });
                                return respuestaBackend.idPagoExterno;
                            } catch (error) {
                                toast.error("Hubo un problema al iniciar el pago.");
                                setCargando(false);
                                setMetodoSeleccionado(false);
                                throw error;
                            }
                        }}
                        onApprove={async (_data, actions) => {
                            try {
                                const detallesPago = await actions.order?.capture();
                                if (detallesPago?.status === "COMPLETED") {
                                    toast.success("¡Pago completado con éxito!");
                                    clearCart();
                                    navigate("/checkout/exito");
                                }
                            } catch (error) {
                                toast.error("El pago no pudo ser capturado.");
                                setMetodoSeleccionado(false);
                            } finally {
                                setCargando(false);
                            }
                        }}

                        onCancel={() => {
                            setCargando(false);
                            // Si cancelan el popup flotante, reseteamos el estado visual
                            setMetodoSeleccionado(false);
                        }}

                        onError={() => {
                            toast.error("Error de comunicación con PayPal.");
                            setCargando(false);
                            setMetodoSeleccionado(false);
                        }}
                    />
                </div>
            </div>
        </PayPalScriptProvider>
    );
};