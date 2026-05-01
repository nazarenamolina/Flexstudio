import { Plus } from 'lucide-react';

interface Props {
    viewMode: 'grid' | 'list';
    onClick: () => void;
}

export const AddCategoriaCard = ({ viewMode, onClick }: Props) => {
    return (
        <div onClick={onClick} className={`relative rounded-2xl overflow-hidden cursor-pointer bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2  border-white/10 hover:border-[#d7f250]/50 hover:shadow-[0_0_30px_rgba(215,242,80,0.1)] transition-all duration-300 ease-out group ${viewMode === 'grid' ? 'h-[280px] sm:h-[320px] flex flex-col items-center justify-center': 'h-[120px] flex flex-row items-center justify-center gap-4 px-6'}`}>
            {/* Fondo con gradiente sutil al hover */}
            <div className="absolute inset-0 bg-[#d7f250]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Contenido */}
            <div className="relative z-10 flex flex-col items-center justify-center">
                <div className=" w-14 h-14 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-[#d7f250]/15 group-hover:border-[#d7f250]/30
                    group-hover:shadow-[0_0_20px_rgba(215,242,80,0.2)] flex items-center justify-center transition-all duration-300"><Plus size={22}className="text-white/40 group-hover:text-[#d7f250] transition-colors duration-300"/>
                </div>

                {/* Texto */}
                <span className={`mt-4 font-bold text-white/40 group-hover:text-[#d7f250]/80 uppercase tracking-[0.15em] transition-colors duration-300 ${viewMode === 'grid' ? 'text-[10px]' : 'text-xs'}`}>{viewMode === 'grid' ? 'Nueva Categoria' : 'Crear Categoría'} </span>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#d7f250]/0 group-hover:bg-[#d7f250]/60 group-hover:w-16 transition-all duration-00" />
            </div>
        </div>
    );
};
