import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import './App.css';
import Layout from './Layout';
import Home from './components/home/Home';
import Products from './components/products/Products';
import Services from './components/products/Services';
import Login from './components/authentication/Login';
import Signup from './components/authentication/Signup';

import Unauthorized from './components/authentication/Unauthorized';
import { Role } from './react-app-env.d';
import Restricted from './components/authentication/Restricted';
import PersistLogin from './components/authentication/PersistAuth';


  
function App() {
	const router = createBrowserRouter(
		createRoutesFromElements(//createRoutesFromElements = <Routes>
			<Route path="/" element={<Layout />}>
				{/* public */}
				{/* <Route index element={<Index />}></Route> */}
				<Route path='/' element={<Home />} />
				<Route path='/login' element={<Login />} />
				<Route path='/signup' element={<Signup />} />
				<Route path="/unauthorized" element={<Unauthorized />} />

				<Route element={<PersistLogin />}>
					{/* protected */}
					<Route element={<Restricted to={[Role.ADMIN]} />}>
						<Route path='/products' element={<Products />} />
					</Route>
				</Route>

				<Route path='/services' element={<Services />} />
			</Route>
		)//TODO: create protected routes
	);
	return <RouterProvider router={router} />;
}

export default App;
