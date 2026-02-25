import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Start from './GraphsPage/Graps'
import Verif_page from './VerPage/verif';
import Profile from './ProfilePage/ProfilePage';
import Work from './WorkPage/Work';


const router = createBrowserRouter([{
  path:'/',
  element: <Verif_page/>,
},
{
  path:'/Graphs',
  element: <Start/>
},
{
  path:'/Profile',
  element: <Profile/>
},
{
  path:'/Work/:id',
  element: <Work/>
}
]);

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
  <RouterProvider router={router}/>
</React.StrictMode>
)
