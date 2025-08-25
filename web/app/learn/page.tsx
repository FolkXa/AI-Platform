"use client"
import { memo, useMemo, useState } from "react";

const Parent = () => {
    const [user, setUser] = useState({
        name: "Umais",
        baseSalary: 60000,
        tax: 5000,
        bonus: 10000,
        homeAllowance: 15000,
        fuelAllowance: 5000,
    })

    const updateUser = () => {
        setUser(prev => ({
            ...prev,
            name: "Umais",
            baseSalary: prev.baseSalary + 1000,
        }))
    }

    return (
        <div>
            <button onClick={updateUser}>Update User</button>
            <User user={user} />
            <Child />
        </div>
    )
}   
const User = memo(({ user }: { user: any }) => {
    console.log("User rerendered")  
  
    const grossSalary = useMemo(() => (user.baseSalary + user.bonus + user.homeAllowance + user.fuelAllowance) - user.tax, [user]);
  
    return (
      <div>
        <p>{`${user.name} has gross salary ${grossSalary}`}</p>
      </div>
    )
})

const Child = () => {
    console.log("Child rerendered")
    return (
        <div>
            <p>Child</p>
        </div>
    )
}
  
export default Parent;