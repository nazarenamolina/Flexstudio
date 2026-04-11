import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { iniciarCompraRequest } from "../api/compras";

export const BotonPayPal = () => {
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();
    const cartItems = useCartStore((state) => state.cartItems);
    const clearCart = useCartStore((state) => state.clearCart);
    const initialOptions = {
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
    };

    return (
        <PayPalScriptProvider options={initialOptions}>
            <div className="w-full max-w-md mx-auto relative z-0">
                {cargando && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#131313]/80 rounded-xl">
                        <span className="text-neon-pink font-principal animate-pulse">Procesando...</span>
                    </div>
                )}

                <PayPalButtons
                    style={{
                        layout: "vertical",
                        color: "gold",
                        shape: "rect",
                        label: "pay"
                    }}
                    createOrder={async () => {
                        setCargando(true);
                        try {
                            const idsCategorias = cartItems.map(item => item.id);
                            const respuestaBackend = await iniciarCompraRequest({
                                idsCategorias: idsCategorias
                            });
                            return respuestaBackend.idPagoExterno;

                        } catch (error) {
                            toast.error("Hubo un problema al iniciar el pago seguro.");
                            setCargando(false);
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
                            toast.error("El pago no pudo ser capturado. Intenta nuevamente.");
                        } finally {
                            setCargando(false);
                        }
                    }}

                    onCancel={() => {
                        toast.error("Cancelaste el proceso de pago.");
                        setCargando(false);
                    }}

                    onError={() => {
                        toast.error("Ocurrió un error de comunicación con PayPal.");
                        setCargando(false);
                    }}
                />
            </div>
        </PayPalScriptProvider>
    );
};