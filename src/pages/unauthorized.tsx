import { useRouter } from 'next/router';

export default function Unauthorized() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="mb-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <span className="text-red-600 text-2xl">🚫</span>
          </div>
        </div>
        
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Acceso Denegado
        </h1>
        
        <p className="text-gray-600 mb-6">
          No tienes permisos suficientes para acceder a esta página. 
          Esta sección está disponible solo para administradores.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Ir al Dashboard
          </button>
          
          <button
            onClick={() => router.back()}
            className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}