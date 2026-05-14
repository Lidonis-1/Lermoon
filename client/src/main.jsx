import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Start from './GraphsPage/Graps'
import Profile from './ProfilePage/ProfilePage';
import Work from './WorkPage/Work';
import Register from './VerPage/singUp';
import Login from './VerPage/login';


const router = createBrowserRouter([{
  path:'/',
  element: <Login/>,
},
{
  path:'/SignUp',
  element: <Register/>
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
  path: '/Work/:workID', 
  element: <Work/>
}
]);

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
  <RouterProvider router={router}/>
</React.StrictMode>
)
