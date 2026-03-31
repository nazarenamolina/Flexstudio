    interface AvatarProps {
  nombre: string;
  apellido?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AvatarIniciales = ({ nombre, apellido = '', size = 'md', className = '' }: AvatarProps) => {
  const inicialNombre = nombre ? nombre.charAt(0).toUpperCase() : '?';
  const inicialApellido = apellido ? apellido.charAt(0).toUpperCase() : '';
  const iniciales = `${inicialNombre}${inicialApellido}`;
  const colores = [
    'bg-[#d7f250] text-[#131313]', 
    'bg-[#ff1493] text-white',     
    'bg-purple-500 text-white',
    'bg-blue-500 text-white',
    'bg-orange-500 text-white',
    'bg-cyan-500 text-[#131313]',
  ];

  const textoCompleto = `${nombre}${apellido}`;
  let hash = 0;
  for (let i = 0; i < textoCompleto.length; i++) {
    hash = textoCompleto.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % colores.length;
  const colorElegido = colores[colorIndex];

  // 4. Clases de tamaño (Tailwind)
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl'
  };

  return (
    <div 
      className={`flex items-center justify-center rounded-full font-bold shadow-sm select-none ${colorElegido} ${sizes[size]} ${className}`}
      title={`${nombre} ${apellido}`}
    >
      {iniciales}
    </div>
  );
};