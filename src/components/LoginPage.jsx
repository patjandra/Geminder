import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';

export default function Login({ onLogin}) {
    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("Signed in as:", user.displayName);
            onLogin(user);
        } catch (error) {
            console.error("Sign-in error:", error);
            alert("Failed to sign in. Please try again.");
        }
    };

    const handleContinueWithoutLogin = () => {
        onLogin({ displayName: "Guest" });
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-10 rounded-lg shadow-md text-center">
                <h1 className="text-3xl font-bold mb-6">Welcome to Geminder</h1>

                <button 
                    onClick={handleLogin}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mb-4 w-full"
                >
                    Sign in with Google
                </button>

                <p className="text-gray-500 my-2">or</p>

                <button
                    onClick={handleContinueWithoutLogin}
                    className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded w-full"
                >
                    Continue without login
                </button>
            </div>
        </div>
    );
}