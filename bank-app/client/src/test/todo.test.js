import { render, screen, waitFor } from "@testing-library/react"
import Layout from "../views/Layout";
/*import React from 'react'

import LoginPage from "../components/LoginPage"
import userEvent from "@testing-library/user-event"

const onSubmit = jest.fn()
    
beforeEach(()=>{
    render(<LoginPage onSubmitForTest={onSubmit} />)
})

test('testing login page', async () => {
    const loginId = screen.getByTestId('loginId')
    const password = screen.getByTestId('password')
    userEvent.type(loginId, "john123")
    userEvent.type(password, "password")
  
    userEvent.click(screen.getByTestId('loginButton'))
  
    await waitFor(()=>{
      expect(onSubmit).toHaveBeenCalledTimes(1);
})
})*/
test('should render login component',() =>{
    render(<Layout/>)
    const loginElement = screen.getByTestId('login-1');
    expect(loginElement).toBeInTheDocument();
})