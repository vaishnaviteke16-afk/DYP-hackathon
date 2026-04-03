function Auth() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border p-6 rounded w-80">
        <h2 className="text-xl mb-4">Login</h2>

        <input className="border p-2 w-full mb-3" placeholder="Email" />
        <input className="border p-2 w-full mb-3" placeholder="Password" />

        <button className="bg-black text-white w-full py-2">
          Login
        </button>
      </div>
    </div>
  );
}

export default Auth;