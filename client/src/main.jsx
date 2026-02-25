import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomeMain from './HomePage/HomeMain'
import Verif_page from './VerPage/verif';


const router = createBrowserRouter([{
  path:'/',
  element: <Verif_page/>,
},
{
  path:'/home',
  element: <HomeMain/>
}
]);

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
  <RouterProvider router={router}/>
</React.StrictMode>
)
