import { useState } from 'react'
import { createBrowserRouter, RouterProvider, Navigate} from 'react-router-dom';
import RootLayout from './components/RootLayout';
import './App.css'
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import ProblemList from './components/ProblemList';
import MySubmissions from './components/MySubmissions';
import Leaderboard from './components/Leaderboard';
import ManageProblems from './components/ManageProblems';
import ManageUsers from './components/ManageUsers';
import CreateProblem from './components/CreateProblem';
import EditProblem from './components/EditProblem';
import CodeEditor from './components/CodeEditor';
import Compiler from './components/Compiler';

function App() {
  let browserRouter = createBrowserRouter([
    {
      path : '',
      element : <RootLayout />,
      children : [
        {
          path : '',
          element : <Home />,
        },
        {
          path : '/login',
          element : <Login />,
        },
        {
          path : '/register',
          element : <Register />,
        },
      ]
    },

    {
      path : '/AdminDashboard',
      element : <AdminDashboard />,
    },
    {
      path : '/AdminDashboard/ProblemList',
      element : <ProblemList />,
    },
    {
      path : '/AdminDashboard/MySubmissions',
      element : <MySubmissions />,
    },
    {
      path : '/AdminDashboard/Leaderboard',
      element : <Leaderboard />,
    },
    {
      path : '/AdminDashboard/ManageProblems',
      element : <ManageProblems />,
    },
    {
      path : '/AdminDashboard/ManageUsers',
      element : <ManageUsers />,
    },
    {
      path : '/AdminDashboard/ManageProblems/CreateProblem',
      element : <CreateProblem />,
    },
    {
      path : '/AdminDashboard/ManageProblems/EditProblem/:id',
      element : <EditProblem />,
    },
    {
      path : '/UserDashboard',
      element : <UserDashboard />,
    },
    {
      path : '/UserDashboard/ProblemList',
      element : <ProblemList />,
    },
    {
      path : '/CodeEditor/:id',
      element : <CodeEditor />,
    },
    {
      path : '/UserDashboard/MySubmissions',
      element : <MySubmissions />,
    },
    {
      path : '/UserDashboard/Leaderboard',
      element : <Leaderboard />,
    },
    {
      path : '/UserDashboard/Compiler',
      element : <Compiler />,
    },
    {
      path : '/AdminDashboard/Compiler',
      element : <Compiler />,
    },
    
  ]);

  return (
    <>
      <RouterProvider router = {browserRouter}/>
    </>
  )
}

export default App
