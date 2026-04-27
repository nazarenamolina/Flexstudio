import { Toaster } from 'react-hot-toast';
import { AppRouter } from './router/AppRouter';

function App() {
  return (
    <>
 
      <AppRouter />
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #333',
          },
          success: {
            iconTheme: {
              primary: '#d7f250', 
              secondary: '#131313', 
            },
            style: {
              border: '1px solid #d7f250', 
            }
          },

          error: {
            style: {
              border: '1px solid #ff4d4f', 
            }
          }
        }}
      />
    </>
  );
}

export default App;