import { RouterProvider } from 'react-router-dom';
import router from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import GlobalStore from './store/GlobalStore';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

export default function App() {
  return (
    <Provider store={GlobalStore}>
      <ThemeCustomization>
        <ScrollTop>
          <RouterProvider router={router} />
          <ToastContainer position="bottom-right" />
        </ScrollTop>
      </ThemeCustomization>
    </Provider>
  );
}
