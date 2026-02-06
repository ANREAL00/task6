import React from 'react'
import './WelcomePage.css'

function WelcomePage() {

  return (
    <>
      <div className='wrapper'>
        <form>
          <div className='form-field'>
            <label>Name</label>
            <input type='text' className='input' />
          </div>
          <button type="submit">Connect</button>
        </form>
      </div>
    </>
  )
}

export default WelcomePage
