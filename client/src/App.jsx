import { useState } from 'react'

import './App.css'
import AuthPage from './pages/auth'
import { Route, Routes } from 'react-router-dom'
import TaskPage from './pages/task'
import ScrumBoardPage from './pages/scrum-board'
import CommonLayout from './components/common-layout'
import Info from './pages/info'
import TaskDetails from './pages/task-details'
import StatsPage from './pages/stats'

function App() {
 

  return (
    <div>
      
      <Routes>
        <Route path="/auth" element={<AuthPage/>}/>
        {/* <Route path='/tasks' element={<TaskPage/>}/> */}
        
        <Route path='/tasks' element={<CommonLayout/>}>

        <Route path='list' element={<TaskPage/>}/>
        <Route path='scrum-board' element={<ScrumBoardPage/>}/>
        <Route path='details/:id' element={<TaskDetails/>} />
        <Route path='stats' element={<StatsPage/>} />
        <Route path="info" element={<Info/>}/>
        </Route>
        
      </Routes>
    
</div>

  )
}

export default App
