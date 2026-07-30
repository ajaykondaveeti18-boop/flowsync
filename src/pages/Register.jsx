import { useState } from "react";
import { signUp } from "../services/auth";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function Register() {
 const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const handleSubmit = async (e) => {
  e.preventDefault();

  const { error } = await signUp(email, password);

  if (error) {
    alert(error.message);
  } else {
    alert("Registration successful! Check your email.");
  }
};
  return (
    <>
  <h1 className="text-3xl font-bold">Register</h1>
  <form onSubmit={handleSubmit}>
    <Input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Email"
/>

<Input
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Password"
/>
<Button type="submit">
  Register
</Button>
  </form>
  </>
  )
}

export default Register;