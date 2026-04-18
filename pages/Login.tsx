import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);

const navigate = useNavigate();

const handleLogin = async () => {
if (!email || !password) {
alert("Please enter email and password");
return;
}

```
setLoading(true);

const { error } = await supabase.auth.signInWithPassword({
  email,
  password
});

setLoading(false);

if (error) {
  alert(error.message);
} else {
  alert("Login successful");
  navigate("/"); // redirect to home
}
```

};

return ( <div className="p-6 max-w-md mx-auto"> <h2 className="text-xl font-bold mb-4">Login</h2>

```
  <input
    className="border p-2 w-full mb-3"
    placeholder="Email"
    onChange={e => setEmail(e.target.value)}
  />

  <input
    type="password"
    className="border p-2 w-full mb-3"
    placeholder="Password"
    onChange={e => setPassword(e.target.value)}
  />

  <button
    onClick={handleLogin}
    disabled={loading}
    className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
  >
    {loading ? "Logging in..." : "Login"}
  </button>
</div>
```

);
}
